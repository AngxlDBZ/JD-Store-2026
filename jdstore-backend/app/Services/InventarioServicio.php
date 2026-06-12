<?php

namespace App\Services;

use App\Models\Producto;

class InventarioServicio
{
    public function productosBajoStock(int $umbral): array
    {
        return Producto::query()
            ->where('estado', 'activo')
            ->where('stock', '<=', $umbral)
            ->orderBy('stock')
            ->get()
            ->values()
            ->all();
    }
}
