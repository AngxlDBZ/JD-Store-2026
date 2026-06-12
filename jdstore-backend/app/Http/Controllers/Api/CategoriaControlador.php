<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Categoria;

class CategoriaControlador extends Controller
{
    public function index()
    {
        Categoria::query()->firstOrCreate(['nombre' => 'Pantalón']);

        return response()->json([
            'categorias' => Categoria::query()->orderBy('nombre')->get(),
        ]);
    }
}
