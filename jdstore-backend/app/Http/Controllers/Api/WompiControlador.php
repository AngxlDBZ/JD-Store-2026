<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\GuardarPedidoRequest;
use App\Models\Pedido;
use App\Services\PedidoServicio;
use App\Services\WompiServicio;
use Illuminate\Http\Request;
use Throwable;

class WompiControlador extends Controller
{
    public function crearCheckout(GuardarPedidoRequest $request, PedidoServicio $pedidoServicio, WompiServicio $wompiServicio)
    {
        if (! $wompiServicio->estaConfigurado()) {
            return response()->json(['mensaje' => 'Wompi no está configurado en el backend.'], 422);
        }

        $datos = $request->validated();
        $pedido = $pedidoServicio->crearPedidoPendientePago(
            $request->user(),
            $datos['items'],
            [
                'direccion_envio' => $datos['direccion_envio'] ?? null,
                'cupon_codigo' => $datos['cupon_codigo'] ?? null,
            ]
        );

        try {
            $linkPago = $wompiServicio->crearLinkDePago($pedido);
            $checkoutUrl = $wompiServicio->extraerCheckoutUrl($linkPago);
            $linkPago['_checkout_url'] = $checkoutUrl;
            $pedido = $pedidoServicio->registrarCheckoutWompi($pedido, $linkPago);

            return response()->json([
                'pedido' => $pedido,
                'checkout_url' => $checkoutUrl,
                'link_pago' => $linkPago,
            ], 201);
        } catch (Throwable $exception) {
            $pedido = $pedidoServicio->marcarPagoComoFallido($pedido, 'error', [
                'error_creando_link' => $exception->getMessage(),
            ]);

            report($exception);

            return response()->json([
                'mensaje' => 'No se pudo iniciar el pago con Wompi.',
                'pedido' => $pedido,
            ], 422);
        }
    }

    public function sincronizarPedido(Request $request, Pedido $pedido, PedidoServicio $pedidoServicio, WompiServicio $wompiServicio)
    {
        $usuario = $request->user();

        if ($usuario->rol !== 'admin' && (int) $pedido->cliente_id !== (int) $usuario->id) {
            return response()->json(['mensaje' => 'No autorizado'], 403);
        }

        $transactionId = trim((string) $request->query('transaction_id', ''));

        if ($transactionId !== '' && $pedido->proveedor_pago === 'wompi') {
            try {
                $transaccion = $wompiServicio->obtenerTransaccion($transactionId);
                $pedido = $pedidoServicio->sincronizarEstadoPagoWompi($pedido, $transaccion);
            } catch (Throwable $exception) {
                report($exception);
            }
        }

        return response()->json(['pedido' => $pedido->fresh()->load(['detalles.producto'])]);
    }

    public function webhook(Request $request, PedidoServicio $pedidoServicio, WompiServicio $wompiServicio)
    {
        $payload = $request->all();

        if (($payload['event'] ?? null) !== 'transaction.updated') {
            return response()->json(['ok' => true]);
        }

        if (! $wompiServicio->validarFirmaEvento($payload, $request->header('X-Event-Checksum'))) {
            return response()->json(['mensaje' => 'Firma de evento no válida'], 400);
        }

        $transaccionEvento = $payload['data']['transaction'] ?? [];
        $transactionId = $transaccionEvento['id'] ?? null;

        if (! $transactionId) {
            return response()->json(['ok' => true]);
        }

        try {
            $transaccion = $wompiServicio->obtenerTransaccion((string) $transactionId);
        } catch (Throwable $exception) {
            report($exception);

            return response()->json(['mensaje' => 'No se pudo consultar la transacción'], 500);
        }

        $pedido = Pedido::query()
            ->when(
                ! empty($transaccion['payment_link_id']),
                fn ($query) => $query->where('wompi_payment_link_id', $transaccion['payment_link_id']),
                fn ($query) => $query->where('referencia_pago', $transaccion['reference'] ?? '')
            )
            ->first();

        if (! $pedido) {
            return response()->json(['ok' => true]);
        }

        $pedidoServicio->sincronizarEstadoPagoWompi($pedido, $transaccion);

        return response()->json(['ok' => true]);
    }
}
