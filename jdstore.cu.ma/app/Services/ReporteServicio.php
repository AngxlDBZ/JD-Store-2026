<?php

namespace App\Services;

use App\Models\DetallePedido;
use App\Models\Pedido;
use App\Models\Producto;
use App\Models\Usuario;
use Illuminate\Support\Carbon;

class ReporteServicio
{
    public function resumenDashboard(): array
    {
        $ingresosTotales = (float) $this->queryPedidosConPagoAprobado()->sum('total');

        $pedidosPendientes = (int) Pedido::query()
            ->whereIn('estado', ['pendiente', 'en_preparacion'])
            ->count();

        $pagosAprobados = (int) $this->queryPedidosConPagoAprobado()->count();

        $pagosPendientes = (int) Pedido::query()
            ->where('estado_pago', 'pendiente')
            ->count();

        $pagosFallidos = (int) Pedido::query()
            ->whereIn('estado_pago', ['rechazado', 'anulado', 'error'])
            ->count();

        $productosActivos = (int) Producto::query()
            ->where('estado', 'activo')
            ->count();

        $alertasBajoStock = (int) Producto::query()
            ->where('estado', 'activo')
            ->where('stock', '<=', 5)
            ->count();

        return [
            'ingresos_totales' => $ingresosTotales,
            'pedidos_pendientes' => $pedidosPendientes,
            'pagos_aprobados' => $pagosAprobados,
            'pagos_pendientes' => $pagosPendientes,
            'pagos_fallidos' => $pagosFallidos,
            'productos_activos' => $productosActivos,
            'alertas_bajo_stock' => $alertasBajoStock,
        ];
    }

    public function ventasPorPeriodo(?string $desde, ?string $hasta): array
    {
        $desdeCarbon = $desde ? Carbon::parse($desde)->startOfDay() : now()->subDays(30)->startOfDay();
        $hastaCarbon = $hasta ? Carbon::parse($hasta)->endOfDay() : now()->endOfDay();

        $ventas = $this->queryPedidosConPagoAprobado()
            ->selectRaw('DATE(fecha) as fecha_dia, SUM(total) as total')
            ->whereBetween('fecha', [$desdeCarbon, $hastaCarbon])
            ->groupByRaw('DATE(fecha)')
            ->orderBy('fecha_dia')
            ->get()
            ->map(fn ($fila) => ['fecha' => $fila->fecha_dia, 'total' => (float) $fila->total])
            ->values()
            ->all();

        return [
            'desde' => $desdeCarbon->toDateString(),
            'hasta' => $hastaCarbon->toDateString(),
            'ventas' => $ventas,
        ];
    }

    public function reporteDiario(?string $fecha): array
    {
        $fechaCarbon = $fecha ? Carbon::parse($fecha) : now();
        $inicio = $fechaCarbon->copy()->startOfDay();
        $fin = $fechaCarbon->copy()->endOfDay();

        $pedidos = Pedido::query()
            ->with(['cliente', 'detalles.producto'])
            ->whereBetween('fecha', [$inicio, $fin])
            ->orderByDesc('fecha')
            ->get();

        return [
            'fecha' => $fechaCarbon->toDateString(),
            'totales' => [
                'pedidos' => $pedidos->count(),
                'ingresos' => (float) $pedidos
                    ->filter(fn ($pedido) => $this->pedidoTienePagoAprobado($pedido))
                    ->sum('total'),
                'pendientes' => (int) $pedidos->whereIn('estado', ['pendiente', 'en_preparacion'])->count(),
                'pagos_aprobados' => (int) $pedidos->filter(fn ($pedido) => $this->pedidoTienePagoAprobado($pedido))->count(),
                'pagos_pendientes' => (int) $pedidos->where('estado_pago', 'pendiente')->count(),
                'pagos_fallidos' => (int) $pedidos->whereIn('estado_pago', ['rechazado', 'anulado', 'error'])->count(),
            ],
            'pedidos' => $pedidos,
        ];
    }

    public function productosMasVendidos(?string $desde, ?string $hasta, int $limite = 10): array
    {
        $desdeCarbon = $desde ? Carbon::parse($desde)->startOfDay() : now()->subDays(30)->startOfDay();
        $hastaCarbon = $hasta ? Carbon::parse($hasta)->endOfDay() : now()->endOfDay();

        $limite = max(1, min(50, $limite));

        $filas = DetallePedido::query()
            ->selectRaw('detalle_pedidos.producto_id, SUM(detalle_pedidos.cantidad) as unidades, SUM(detalle_pedidos.cantidad * detalle_pedidos.precio_unitario) as ingresos')
            ->join('pedidos', 'pedidos.id', '=', 'detalle_pedidos.pedido_id')
            ->whereBetween('pedidos.fecha', [$desdeCarbon, $hastaCarbon])
            ->where(function ($query) {
                $query->where('pedidos.estado_pago', 'aprobado')->orWhereNull('pedidos.estado_pago');
            })
            ->groupBy('detalle_pedidos.producto_id')
            ->orderByDesc('unidades')
            ->limit($limite)
            ->get();

        $productos = Producto::query()
            ->whereIn('id', $filas->pluck('producto_id')->all())
            ->get()
            ->keyBy('id');

        $resultado = $filas
            ->map(function ($fila) use ($productos) {
                $producto = $productos->get($fila->producto_id);

                return [
                    'producto_id' => (int) $fila->producto_id,
                    'producto' => $producto ? [
                        'id' => $producto->id,
                        'sku' => $producto->sku,
                        'nombre' => $producto->nombre,
                        'precio' => (float) $producto->precio,
                    ] : null,
                    'unidades' => (int) $fila->unidades,
                    'ingresos' => (float) $fila->ingresos,
                ];
            })
            ->values()
            ->all();

        return [
            'desde' => $desdeCarbon->toDateString(),
            'hasta' => $hastaCarbon->toDateString(),
            'productos' => $resultado,
        ];
    }

    public function clientesFrecuentes(?string $desde, ?string $hasta, int $limite = 10): array
    {
        $desdeCarbon = $desde ? Carbon::parse($desde)->startOfDay() : now()->subDays(90)->startOfDay();
        $hastaCarbon = $hasta ? Carbon::parse($hasta)->endOfDay() : now()->endOfDay();

        $limite = max(1, min(50, $limite));

        $filas = Pedido::query()
            ->selectRaw('cliente_id, COUNT(*) as pedidos, SUM(total) as total')
            ->whereBetween('fecha', [$desdeCarbon, $hastaCarbon])
            ->where(function ($query) {
                $query->where('estado_pago', 'aprobado')->orWhereNull('estado_pago');
            })
            ->groupBy('cliente_id')
            ->orderByDesc('total')
            ->orderByDesc('pedidos')
            ->limit($limite)
            ->get();

        $clientes = Usuario::query()
            ->whereIn('id', $filas->pluck('cliente_id')->all())
            ->get()
            ->keyBy('id');

        $resultado = $filas
            ->map(function ($fila) use ($clientes) {
                $cliente = $clientes->get($fila->cliente_id);

                return [
                    'cliente_id' => (int) $fila->cliente_id,
                    'cliente' => $cliente ? [
                        'id' => $cliente->id,
                        'nombre_completo' => $cliente->nombre_completo,
                        'email' => $cliente->email,
                        'telefono' => $cliente->telefono,
                    ] : null,
                    'pedidos' => (int) $fila->pedidos,
                    'total' => (float) $fila->total,
                ];
            })
            ->values()
            ->all();

        return [
            'desde' => $desdeCarbon->toDateString(),
            'hasta' => $hastaCarbon->toDateString(),
            'clientes' => $resultado,
        ];
    }

    private function queryPedidosConPagoAprobado()
    {
        return Pedido::query()->where(function ($query) {
            $query->where('estado_pago', 'aprobado')
                ->orWhereNull('estado_pago');
        });
    }

    private function pedidoTienePagoAprobado(Pedido $pedido): bool
    {
        return $pedido->estado_pago === null || $pedido->estado_pago === 'aprobado';
    }
}
