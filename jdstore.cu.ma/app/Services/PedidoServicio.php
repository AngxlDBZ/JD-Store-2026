<?php

namespace App\Services;

use App\Models\DetallePedido;
use App\Models\Pedido;
use App\Models\Producto;
use App\Models\ProductoVariante;
use App\Models\Recibo;
use App\Models\Usuario;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;

class PedidoServicio
{
    public function crearPedido(Usuario $cliente, array $items, array $meta = []): Pedido
    {
        return DB::transaction(function () use ($cliente, $items, $meta) {
            [$productosPorId, $variantesPorId] = $this->cargarProductosYVariantes($items);
            [$subtotal, $detalles] = $this->prepararDetallesYDescontarStock($items, $productosPorId, $variantesPorId);
            $descuento = $this->resolverDescuento($meta['cupon_codigo'] ?? null, $subtotal);

            $pedido = Pedido::create([
                'cliente_id' => $cliente->id,
                'subtotal' => $subtotal,
                'total' => $descuento['total'],
                'descuento_total' => $descuento['descuento'],
                'cupon_codigo' => $descuento['codigo'],
                'metodo_pago' => $meta['metodo_pago'] ?? null,
                'proveedor_pago' => $meta['proveedor_pago'] ?? null,
                'estado_pago' => $meta['estado_pago'] ?? 'aprobado',
                'referencia_pago' => $meta['referencia_pago'] ?? $this->generarReferenciaPago(),
                'estado' => 'pendiente',
                'direccion_envio' => $meta['direccion_envio'] ?? $cliente->direccion,
                'fecha' => now(),
            ]);

            if ($descuento['cupon']) {
                app(CuponServicio::class)->registrarUso($descuento['cupon']);
            }

            foreach ($detalles as $detalle) {
                DetallePedido::create(array_merge($detalle, ['pedido_id' => $pedido->id]));
            }

            Recibo::create([
                'pedido_id' => $pedido->id,
                'numero_recibo' => $this->generarNumeroRecibo($pedido->id),
                'fecha_hora' => now(),
                'caja_id' => null,
            ]);

            return $pedido->load(['detalles.producto', 'detalles.variante']);
        });
    }

    public function crearPedidoPendientePago(Usuario $cliente, array $items, array $meta = []): Pedido
    {
        return DB::transaction(function () use ($cliente, $items, $meta) {
            [$productosPorId, $variantesPorId] = $this->cargarProductosYVariantes($items);
            [$subtotal, $detalles] = $this->prepararDetallesYDescontarStock($items, $productosPorId, $variantesPorId);
            $descuento = $this->resolverDescuento($meta['cupon_codigo'] ?? null, $subtotal);

            $pedido = Pedido::create([
                'cliente_id' => $cliente->id,
                'subtotal' => $subtotal,
                'total' => $descuento['total'],
                'descuento_total' => $descuento['descuento'],
                'cupon_codigo' => $descuento['codigo'],
                'metodo_pago' => 'Wompi',
                'proveedor_pago' => 'wompi',
                'estado_pago' => 'pendiente',
                'referencia_pago' => $this->generarReferenciaPago(),
                'estado' => 'pendiente',
                'direccion_envio' => $meta['direccion_envio'] ?? $cliente->direccion,
                'fecha' => now(),
            ]);

            if ($descuento['cupon']) {
                app(CuponServicio::class)->registrarUso($descuento['cupon']);
            }

            foreach ($detalles as $detalle) {
                DetallePedido::create(array_merge($detalle, ['pedido_id' => $pedido->id]));
            }

            Recibo::create([
                'pedido_id' => $pedido->id,
                'numero_recibo' => $this->generarNumeroRecibo($pedido->id),
                'fecha_hora' => now(),
                'caja_id' => null,
            ]);

            return $pedido->load(['detalles.producto', 'detalles.variante']);
        });
    }

    public function registrarCheckoutWompi(Pedido $pedido, array $linkPago): Pedido
    {
        $pedido->forceFill([
            'wompi_payment_link_id' => $linkPago['id'] ?? $pedido->wompi_payment_link_id,
            'wompi_checkout_url' => $linkPago['_checkout_url'] ?? $linkPago['permalink'] ?? $pedido->wompi_checkout_url,
            'wompi_payload' => $this->mergePayload($pedido->wompi_payload, [
                'payment_link' => $linkPago,
            ]),
        ])->save();

        return $pedido->fresh()->load(['detalles.producto', 'detalles.variante']);
    }

    public function sincronizarEstadoPagoWompi(Pedido $pedido, array $transaccion): Pedido
    {
        $estadoWompi = strtoupper((string) ($transaccion['status'] ?? ''));

        return match ($estadoWompi) {
            'APPROVED' => $this->marcarPagoComoAprobado($pedido, $transaccion),
            'DECLINED' => $this->marcarPagoComoFallido($pedido, 'rechazado', $transaccion),
            'VOIDED' => $this->marcarPagoComoFallido($pedido, 'anulado', $transaccion),
            'ERROR' => $this->marcarPagoComoFallido($pedido, 'error', $transaccion),
            default => $this->registrarTransaccionPendiente($pedido, $transaccion),
        };
    }

    public function marcarPagoComoFallido(Pedido $pedido, string $estadoPago, array $payload = []): Pedido
    {
        return DB::transaction(function () use ($pedido, $estadoPago, $payload) {
            $pedidoActualizado = Pedido::query()
                ->whereKey($pedido->id)
                ->lockForUpdate()
                ->firstOrFail();

            if ($pedidoActualizado->estado_pago === 'aprobado') {
                return $pedidoActualizado->load(['detalles.producto', 'detalles.variante']);
            }

            if (! in_array($pedidoActualizado->estado_pago, ['rechazado', 'anulado', 'error'], true)) {
                $this->restaurarStock($pedidoActualizado);
            }

            $pedidoActualizado->forceFill([
                'estado' => 'cancelado',
                'estado_pago' => $estadoPago,
                'wompi_transaction_id' => $payload['id'] ?? $pedidoActualizado->wompi_transaction_id,
                'wompi_payload' => $this->mergePayload($pedidoActualizado->wompi_payload, [
                    'transaction' => $payload,
                ]),
            ])->save();

            $cliente = $pedidoActualizado->cliente()->first();
            if ($cliente) {
                app(NotificacionServicio::class)->crear(
                    $cliente,
                    'pago',
                    'Pago no aprobado',
                    'Tu pago no fue aprobado y el pedido fue cancelado.',
                    ['pedido_id' => $pedidoActualizado->id, 'estado_pago' => $estadoPago]
                );
            }

            return $pedidoActualizado->load(['detalles.producto', 'detalles.variante']);
        });
    }

    private function marcarPagoComoAprobado(Pedido $pedido, array $transaccion): Pedido
    {
        return DB::transaction(function () use ($pedido, $transaccion) {
            $pedidoActualizado = Pedido::query()
                ->whereKey($pedido->id)
                ->lockForUpdate()
                ->firstOrFail();

            $pedidoActualizado->forceFill([
                'estado' => 'en_preparacion',
                'estado_pago' => 'aprobado',
                'metodo_pago' => $this->resolverMetodoPago($transaccion),
                'wompi_transaction_id' => $transaccion['id'] ?? $pedidoActualizado->wompi_transaction_id,
                'wompi_payload' => $this->mergePayload($pedidoActualizado->wompi_payload, [
                    'transaction' => $transaccion,
                ]),
            ])->save();

            $cliente = $pedidoActualizado->cliente()->first();
            if ($cliente) {
                app(NotificacionServicio::class)->crear(
                    $cliente,
                    'pago',
                    'Pago aprobado',
                    'Tu pago fue aprobado y tu pedido está en preparación.',
                    ['pedido_id' => $pedidoActualizado->id]
                );
            }

            return $pedidoActualizado->load(['detalles.producto', 'detalles.variante']);
        });
    }

    private function registrarTransaccionPendiente(Pedido $pedido, array $transaccion): Pedido
    {
        $pedido->forceFill([
            'estado_pago' => 'pendiente',
            'wompi_transaction_id' => $transaccion['id'] ?? $pedido->wompi_transaction_id,
            'wompi_payload' => $this->mergePayload($pedido->wompi_payload, [
                'transaction' => $transaccion,
            ]),
        ])->save();

        return $pedido->fresh()->load(['detalles.producto', 'detalles.variante']);
    }

    private function generarNumeroRecibo(int $pedidoId): string
    {
        $fecha = now()->format('Ymd');

        return 'JD-'.$fecha.'-'.str_pad((string) $pedidoId, 6, '0', STR_PAD_LEFT).'-'.Str::upper(Str::random(4));
    }

    private function generarReferenciaPago(): string
    {
        do {
            $referencia = 'JDW-'.now()->format('YmdHis').'-'.Str::upper(Str::random(6));
        } while (Pedido::query()->where('referencia_pago', $referencia)->exists());

        return $referencia;
    }

    private function resolverMetodoPago(array $transaccion): string
    {
        $tipo = strtoupper((string) ($transaccion['payment_method_type'] ?? ''));

        return $tipo !== '' ? 'Wompi - '.$tipo : 'Wompi';
    }

    private function restaurarStock(Pedido $pedido): void
    {
        $detalles = $pedido->detalles()->get();
        $productos = Producto::query()
            ->whereIn('id', $detalles->pluck('producto_id')->all())
            ->lockForUpdate()
            ->get()
            ->keyBy('id');
        $variantes = ProductoVariante::query()
            ->whereIn('id', $detalles->pluck('producto_variante_id')->filter()->all())
            ->lockForUpdate()
            ->get()
            ->keyBy('id');

        foreach ($detalles as $detalle) {
            $producto = $productos->get($detalle->producto_id);

            if (! $producto) {
                continue;
            }

            if ($detalle->producto_variante_id) {
                $variante = $variantes->get($detalle->producto_variante_id);

                if ($variante) {
                    $variante->stock = $variante->stock + (int) $detalle->cantidad;
                    $variante->save();
                    $this->sincronizarStockProducto($producto);
                }

                continue;
            }

            $producto->stock = $producto->stock + (int) $detalle->cantidad;
            $producto->save();
        }
    }

    private function cargarProductosYVariantes(array $items): array
    {
        $productosPorId = Producto::query()
            ->whereIn('id', collect($items)->pluck('producto_id')->all())
            ->lockForUpdate()
            ->get()
            ->keyBy('id');

        $variantesPorId = ProductoVariante::query()
            ->whereIn('id', collect($items)->pluck('variante_id')->filter()->all())
            ->lockForUpdate()
            ->get()
            ->keyBy('id');

        return [$productosPorId, $variantesPorId];
    }

    private function prepararDetallesYDescontarStock(array $items, $productosPorId, $variantesPorId): array
    {
        $total = 0;
        $detalles = [];

        foreach ($items as $item) {
            $producto = $productosPorId->get($item['producto_id']);

            if (! $producto || $producto->estado !== 'activo') {
                abort(422, 'Producto no disponible');
            }

            $cantidad = (int) $item['cantidad'];

            if ($cantidad <= 0) {
                abort(422, 'Cantidad inválida');
            }

            $varianteId = $item['variante_id'] ?? null;

            $precioAplicado = app(PromocionServicio::class)->obtenerPrecioPromocional($producto);
            $precioUnitario = (float) $precioAplicado['precio_unitario'];

            if ($varianteId) {
                $variante = $variantesPorId->get((int) $varianteId);

                if (! $variante || (int) $variante->producto_id !== (int) $producto->id || $variante->estado !== 'activo') {
                    abort(422, 'La talla seleccionada no está disponible');
                }

                if ((int) $variante->stock < $cantidad) {
                    abort(422, 'Stock insuficiente para la talla seleccionada');
                }

                $variante->stock = (int) $variante->stock - $cantidad;
                $variante->save();
                $this->sincronizarStockProducto($producto);

                $detalles[] = [
                    'producto_id' => $producto->id,
                    'producto_variante_id' => $variante->id,
                    'talla' => $variante->talla,
                    'cantidad' => $cantidad,
                    'precio_unitario' => $precioUnitario,
                ];
            } else {
                if ($producto->variantes()->where('estado', 'activo')->exists()) {
                    abort(422, 'Selecciona una talla antes de continuar');
                }

                if ((int) $producto->stock < $cantidad) {
                    abort(422, 'Stock insuficiente');
                }

                $producto->stock = $producto->stock - $cantidad;
                $producto->save();

                $detalles[] = [
                    'producto_id' => $producto->id,
                    'cantidad' => $cantidad,
                    'precio_unitario' => $precioUnitario,
                ];
            }

            $total += (float) $precioUnitario * $cantidad;
        }

        return [$total, $detalles];
    }

    private function sincronizarStockProducto(Producto $producto): void
    {
        $producto->stock = (int) $producto->variantes()
            ->where('estado', 'activo')
            ->sum('stock');
        $producto->save();
    }

    private function resolverDescuento(?string $cuponCodigo, float $subtotal): array
    {
        if ($subtotal <= 0) {
            throw ValidationException::withMessages([
                'items' => 'El pedido debe tener un total válido.',
            ]);
        }

        $resultado = app(CuponServicio::class)->validarCodigo($cuponCodigo, $subtotal);

        if (! $resultado) {
            return [
                'cupon' => null,
                'codigo' => null,
                'descuento' => 0,
                'total' => $subtotal,
            ];
        }

        return $resultado;
    }

    private function mergePayload(?array $actual, array $nuevo): array
    {
        return array_merge($actual ?? [], $nuevo);
    }
}
