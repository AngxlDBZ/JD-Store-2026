<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\GuardarProductoRequest;
use App\Models\Producto;
use App\Services\ProductoServicio;
use App\Services\PromocionServicio;
use Illuminate\Http\Request;

class ProductoControlador extends Controller
{
    public function index(Request $request, PromocionServicio $promocionServicio)
    {
        $buscar = trim((string) $request->query('buscar', ''));
        $categoriaId = $request->query('categoria_id');
        $precioMin = $request->query('precio_min');
        $precioMax = $request->query('precio_max');
        $talla = trim((string) $request->query('talla', ''));
        $soloDisponibles = filter_var($request->query('solo_disponibles', false), FILTER_VALIDATE_BOOLEAN);
        $orden = trim((string) $request->query('orden', 'recientes'));
        $porPagina = max(1, min(30, (int) $request->query('per_page', 15)));
        $soloActivos = filter_var($request->query('solo_activos', true), FILTER_VALIDATE_BOOLEAN);
        $aleatorio = filter_var($request->query('aleatorio', false), FILTER_VALIDATE_BOOLEAN);
        $semilla = trim((string) $request->query('semilla', ''));

        $query = Producto::query()
            ->with(['categoria', 'variantes'])
            ->withSum('detallesPedido as ventas_totales', 'cantidad');

        if ($soloActivos) {
            $query->where('estado', 'activo');
        }

        if ($buscar !== '') {
            $terminos = collect(preg_split('/\s+/', mb_strtolower($buscar), -1, PREG_SPLIT_NO_EMPTY))
                ->filter()
                ->values();

            $query->where(function ($queryBuscar) use ($terminos) {
                foreach ($terminos as $termino) {
                    $queryBuscar->where(function ($q) use ($termino) {
                        $q->whereRaw('LOWER(nombre) like ?', ['%'.$termino.'%'])
                            ->orWhereRaw('LOWER(sku) like ?', ['%'.$termino.'%'])
                            ->orWhereRaw('LOWER(descripcion) like ?', ['%'.$termino.'%'])
                            ->orWhereHas('categoria', function ($categoriaQuery) use ($termino) {
                                $categoriaQuery->whereRaw('LOWER(nombre) like ?', ['%'.$termino.'%']);
                            });
                    });
                }
            });
        }

        if ($categoriaId) {
            $query->where('categoria_id', $categoriaId);
        }

        if ($precioMin !== null) {
            $query->where('precio', '>=', (float) $precioMin);
        }

        if ($precioMax !== null) {
            $query->where('precio', '<=', (float) $precioMax);
        }

        if ($talla !== '') {
            $query->whereHas('variantes', function ($variantesQuery) use ($talla) {
                $variantesQuery
                    ->where('estado', 'activo')
                    ->whereRaw('LOWER(talla) = ?', [mb_strtolower($talla)]);
            });
        }

        if ($soloDisponibles) {
            $query->where('stock', '>', 0);
        }

        $sinFiltros = $buscar === ''
            && ! $categoriaId
            && $precioMin === null
            && $precioMax === null
            && $talla === ''
            && ! $soloDisponibles
            && $orden === 'recientes';

        if ($aleatorio && $soloActivos && $sinFiltros) {
            $query->orderByRaw('MD5(CONCAT(id, ?)) asc', [$semilla !== '' ? $semilla : 'jdstore']);
        } else {
            match ($orden) {
                'precio_asc' => $query->orderBy('precio'),
                'precio_desc' => $query->orderByDesc('precio'),
                'mas_vendidos' => $query->orderByDesc('ventas_totales')->orderByDesc('id'),
                default => $query->orderByDesc('id'),
            };
        }

        $paginacion = $query->paginate($porPagina)->withQueryString();
        $paginacion = $promocionServicio->aplicarAPaginacion($paginacion);

        return response()->json([
            'productos' => $paginacion,
        ]);
    }

    public function mostrar(Producto $producto, PromocionServicio $promocionServicio)
    {
        $producto = $producto->load(['categoria', 'variantes']);
        $promocionServicio->aplicarAProducto($producto);

        return response()->json(['producto' => $producto]);
    }

    public function guardar(GuardarProductoRequest $request, ProductoServicio $servicio)
    {
        $datos = $request->validated();
        $imagen = $request->file('imagen');

        unset($datos['imagen']);

        $producto = $servicio->crear($datos, $imagen);

        return response()->json(['producto' => $producto->load(['categoria', 'variantes'])], 201);
    }

    public function actualizar(GuardarProductoRequest $request, Producto $producto, ProductoServicio $servicio)
    {
        $datos = $request->validated();
        $imagen = $request->file('imagen');

        unset($datos['imagen']);

        $producto = $servicio->actualizar($producto, $datos, $imagen);

        return response()->json(['producto' => $producto->load(['categoria', 'variantes'])]);
    }

    public function eliminar(Producto $producto)
    {
        $producto->estado = 'inactivo';
        $producto->save();

        return response()->json(['ok' => true]);
    }

    public function eliminarPermanentemente(Producto $producto, ProductoServicio $servicio)
    {
        $servicio->eliminar($producto);

        return response()->json(['ok' => true]);
    }
}
