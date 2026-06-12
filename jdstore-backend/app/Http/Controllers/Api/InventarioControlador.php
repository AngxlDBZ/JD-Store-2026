<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Producto;
use App\Models\ProductoVariante;
use App\Services\InventarioServicio;
use Illuminate\Http\Request;

class InventarioControlador extends Controller
{
    public function bajoStock(Request $request, InventarioServicio $servicio)
    {
        $umbral = (int) $request->query('umbral', 5);
        $umbral = max(0, $umbral);

        return response()->json([
            'umbral' => $umbral,
            'productos' => $servicio->productosBajoStock($umbral),
        ]);
    }

    public function porSku(string $sku)
    {
        $variante = ProductoVariante::query()
            ->with('producto')
            ->where('sku', $sku)
            ->first();

        if ($variante) {
            return response()->json([
                'producto_id' => $variante->producto_id,
                'variante_id' => $variante->id,
                'sku' => $variante->sku,
                'stock' => $variante->stock,
                'estado' => $variante->estado,
                'producto' => $variante->producto?->nombre,
                'talla' => $variante->talla,
            ]);
        }

        $producto = Producto::query()->where('sku', $sku)->first();

        if (! $producto) {
            return response()->json(['mensaje' => 'No encontrado'], 404);
        }

        return response()->json([
            'producto_id' => $producto->id,
            'variante_id' => null,
            'sku' => $producto->sku,
            'stock' => $producto->stock,
            'estado' => $producto->estado,
            'producto' => $producto->nombre,
        ]);
    }
}
