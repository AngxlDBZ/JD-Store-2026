<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Destacado;
use App\Models\Producto;
use Illuminate\Http\Request;

class DestacadoControlador extends Controller
{
    public function listarPublico()
    {
        $productos = Producto::query()
            ->where('estado', 'activo')
            ->whereHas('destacado', fn ($q) => $q->where('activo', true))
            ->with(['categoria', 'variantes', 'destacado'])
            ->orderByRaw('(select orden from destacados where destacados.producto_id = productos.id) asc')
            ->orderByDesc('id')
            ->take(30)
            ->get();

        return response()->json(['productos' => $productos]);
    }

    public function listarAdmin()
    {
        $destacados = Destacado::query()
            ->with(['producto.categoria'])
            ->orderBy('orden')
            ->orderByDesc('id')
            ->paginate(30);

        return response()->json(['destacados' => $destacados]);
    }

    public function guardar(Request $request)
    {
        $datos = $request->validate([
            'producto_id' => ['required', 'integer', 'exists:productos,id'],
            'orden' => ['nullable', 'integer', 'min:0'],
            'activo' => ['nullable', 'boolean'],
        ]);

        $destacado = Destacado::updateOrCreate(
            ['producto_id' => $datos['producto_id']],
            [
                'orden' => (int) ($datos['orden'] ?? 0),
                'activo' => array_key_exists('activo', $datos) ? (bool) $datos['activo'] : true,
            ]
        );

        return response()->json(['destacado' => $destacado->load(['producto.categoria'])], 201);
    }

    public function actualizar(Request $request, Destacado $destacado)
    {
        $datos = $request->validate([
            'orden' => ['nullable', 'integer', 'min:0'],
            'activo' => ['nullable', 'boolean'],
        ]);

        $destacado->fill([
            'orden' => (int) ($datos['orden'] ?? $destacado->orden),
            'activo' => array_key_exists('activo', $datos) ? (bool) $datos['activo'] : $destacado->activo,
        ])->save();

        return response()->json(['destacado' => $destacado->fresh()->load(['producto.categoria'])]);
    }

    public function eliminar(Destacado $destacado)
    {
        $destacado->delete();

        return response()->json(['ok' => true]);
    }
}

