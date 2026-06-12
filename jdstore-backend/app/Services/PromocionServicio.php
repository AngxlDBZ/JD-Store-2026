<?php

namespace App\Services;

use App\Models\Producto;
use App\Models\Promocion;
use Illuminate\Support\Collection;

class PromocionServicio
{
    public function aplicarAPaginacion($paginacion)
    {
        $coleccion = $paginacion->getCollection();
        $this->aplicarAProductos($coleccion);
        $paginacion->setCollection($coleccion);

        return $paginacion;
    }

    public function aplicarAProductos(Collection $productos): void
    {
        if ($productos->isEmpty()) {
            return;
        }

        $productoIds = $productos->pluck('id')->all();
        $categoriaIds = $productos->pluck('categoria_id')->filter()->unique()->values()->all();

        $promociones = $this->promocionesActivasQuery()
            ->where(function ($query) use ($productoIds, $categoriaIds) {
                $query->whereIn('producto_id', $productoIds)
                    ->orWhereIn('categoria_id', $categoriaIds)
                    ->orWhere(function ($q) {
                        $q->whereNull('producto_id')->whereNull('categoria_id');
                    });
            })
            ->get();

        $promocionesPorProducto = $promociones
            ->whereNotNull('producto_id')
            ->groupBy('producto_id');

        $promocionesPorCategoria = $promociones
            ->whereNull('producto_id')
            ->whereNotNull('categoria_id')
            ->groupBy('categoria_id');

        $promocionesGlobales = $promociones
            ->whereNull('producto_id')
            ->whereNull('categoria_id')
            ->values();

        foreach ($productos as $producto) {
            $candidatas = collect()
                ->merge($promocionesPorProducto->get($producto->id, collect()))
                ->merge($promocionesPorCategoria->get($producto->categoria_id, collect()))
                ->merge($promocionesGlobales);

            $this->hidratarProductoConMejorPromocion($producto, $candidatas);
        }
    }

    public function aplicarAProducto(Producto $producto): Producto
    {
        $promociones = $this->promocionesActivasQuery()
            ->where(function ($query) use ($producto) {
                $query->where('producto_id', $producto->id)
                    ->orWhere(function ($q) use ($producto) {
                        $q->whereNull('producto_id')
                            ->where('categoria_id', $producto->categoria_id);
                    })
                    ->orWhere(function ($q) {
                        $q->whereNull('producto_id')->whereNull('categoria_id');
                    });
            })
            ->get();

        $this->hidratarProductoConMejorPromocion($producto, $promociones);

        return $producto;
    }

    public function obtenerPrecioPromocional(Producto $producto): array
    {
        $productoCalculado = clone $producto;
        $this->aplicarAProducto($productoCalculado);

        $precioFinal = isset($productoCalculado->precio_final) ? (float) $productoCalculado->precio_final : (float) $productoCalculado->precio;
        $descuento = isset($productoCalculado->descuento_promocion) ? (float) $productoCalculado->descuento_promocion : 0;

        return [
            'precio_unitario' => $precioFinal,
            'descuento_unitario' => $descuento,
        ];
    }

    private function promocionesActivasQuery()
    {
        return Promocion::query()
            ->where('activo', true)
            ->where(function ($query) {
                $query->whereNull('fecha_inicio')->orWhere('fecha_inicio', '<=', now());
            })
            ->where(function ($query) {
                $query->whereNull('fecha_fin')->orWhere('fecha_fin', '>=', now());
            });
    }

    private function hidratarProductoConMejorPromocion(Producto $producto, Collection $promociones): void
    {
        $precioBase = (float) $producto->precio;
        $mejor = null;
        $mejorDescuento = 0;

        foreach ($promociones as $promocion) {
            $descuento = $promocion->tipo === 'porcentaje'
                ? round($precioBase * ((float) $promocion->valor / 100), 2)
                : (float) $promocion->valor;

            $descuento = min(max(0, $descuento), $precioBase);

            if ($descuento > $mejorDescuento) {
                $mejorDescuento = $descuento;
                $mejor = $promocion;
            }
        }

        $producto->precio_original = $precioBase;
        $producto->descuento_promocion = $mejorDescuento;
        $producto->precio_final = max(0, round($precioBase - $mejorDescuento, 2));
        $producto->promocion_titulo = $mejor?->titulo;
    }
}
