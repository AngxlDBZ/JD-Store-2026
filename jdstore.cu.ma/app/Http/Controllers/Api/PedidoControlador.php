<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\GuardarPedidoRequest;
use App\Models\Pedido;
use App\Services\PedidoServicio;
use App\Services\NotificacionServicio;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class PedidoControlador extends Controller
{
    public function crear(GuardarPedidoRequest $request, PedidoServicio $servicio)
    {
        $pedido = $servicio->crearPedido(
            $request->user(),
            $request->validated()['items'],
            [
                'direccion_envio' => $request->validated()['direccion_envio'] ?? null,
                'metodo_pago' => $request->validated()['metodo_pago'] ?? null,
                'cupon_codigo' => $request->validated()['cupon_codigo'] ?? null,
            ]
        );

        return response()->json(['pedido' => $pedido], 201);
    }

    public function misPedidos(Request $request)
    {
        $usuario = $request->user();

        $pedidos = Pedido::query()
            ->where('cliente_id', $usuario->id)
            ->with(['detalles.producto'])
            ->orderByDesc('id')
            ->paginate(10);

        return response()->json(['pedidos' => $pedidos]);
    }

    public function listar()
    {
        $buscar = trim((string) request()->query('buscar', ''));
        $estado = request()->query('estado');
        $desde = request()->query('desde');
        $hasta = request()->query('hasta');

        $pedidos = Pedido::query()
            ->when($buscar !== '', function ($query) use ($buscar) {
                $query->where(function ($q) use ($buscar) {
                    $q->where('id', 'like', '%'.$buscar.'%')
                        ->orWhereHas('cliente', function ($clienteQuery) use ($buscar) {
                            $clienteQuery->where('nombre_completo', 'like', '%'.$buscar.'%')
                                ->orWhere('email', 'like', '%'.$buscar.'%');
                        });
                });
            })
            ->when($estado, fn ($query) => $query->where('estado', $estado))
            ->when($desde, fn ($query) => $query->whereDate('fecha', '>=', $desde))
            ->when($hasta, fn ($query) => $query->whereDate('fecha', '<=', $hasta))
            ->with(['cliente', 'detalles.producto'])
            ->orderByDesc('id')
            ->paginate(15);

        return response()->json([
            'pedidos' => $pedidos,
            'resumen' => [
                'total' => Pedido::query()->count(),
                'pendientes' => Pedido::query()->whereIn('estado', ['pendiente', 'en_preparacion'])->count(),
                'completados' => Pedido::query()->where('estado', 'completado')->count(),
            ],
        ]);
    }

    public function mostrar(Request $request, Pedido $pedido)
    {
        $usuario = $request->user();

        if ($usuario->rol !== 'admin' && (int) $pedido->cliente_id !== (int) $usuario->id) {
            return response()->json(['mensaje' => 'No autorizado'], 403);
        }

        return response()->json(['pedido' => $pedido->load(['cliente', 'detalles.producto'])]);
    }

    public function actualizarEstado(Request $request, Pedido $pedido)
    {
        $request->validate([
            'estado' => ['required', Rule::in(['pendiente', 'en_preparacion', 'enviado', 'completado', 'cancelado'])],
        ]);

        $estado = $request->input('estado');
        $estadoAnterior = $pedido->estado;

        if (
            $estado !== $pedido->estado &&
            filled($pedido->estado_pago) &&
            $pedido->estado_pago !== 'aprobado' &&
            $estado !== 'cancelado'
        ) {
            return response()->json([
                'mensaje' => 'No puedes avanzar este pedido mientras el pago no esté aprobado.',
            ], 422);
        }

        $pedido->estado = $estado;
        $pedido->save();

        if ($estadoAnterior !== $estado) {
            $cliente = $pedido->cliente()->first();
            if ($cliente) {
                app(NotificacionServicio::class)->crear(
                    $cliente,
                    'pedido',
                    'Actualización de pedido',
                    "Tu pedido #{$pedido->id} cambió a estado: {$estado}.",
                    ['pedido_id' => $pedido->id, 'estado' => $estado]
                );
            }
        }

        return response()->json(['pedido' => $pedido->load(['cliente', 'detalles.producto'])]);
    }
}
