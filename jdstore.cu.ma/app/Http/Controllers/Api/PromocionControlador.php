<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Promocion;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class PromocionControlador extends Controller
{
    public function listar()
    {
        $promociones = Promocion::query()
            ->orderByDesc('id')
            ->paginate(20);

        return response()->json(['promociones' => $promociones]);
    }

    public function guardar(Request $request)
    {
        $datos = $request->validate([
            'titulo' => ['nullable', 'string', 'max:120'],
            'tipo' => ['required', Rule::in(['porcentaje', 'fijo'])],
            'valor' => ['required', 'numeric', 'min:0'],
            'producto_id' => ['nullable', 'integer', 'exists:productos,id'],
            'categoria_id' => ['nullable', 'integer', 'exists:categorias,id'],
            'activo' => ['nullable', 'boolean'],
            'fecha_inicio' => ['nullable', 'date'],
            'fecha_fin' => ['nullable', 'date'],
        ]);

        $promocion = Promocion::create([
            'titulo' => $datos['titulo'] ?? null,
            'tipo' => $datos['tipo'],
            'valor' => $datos['valor'],
            'producto_id' => $datos['producto_id'] ?? null,
            'categoria_id' => $datos['categoria_id'] ?? null,
            'activo' => array_key_exists('activo', $datos) ? (bool) $datos['activo'] : true,
            'fecha_inicio' => $datos['fecha_inicio'] ?? null,
            'fecha_fin' => $datos['fecha_fin'] ?? null,
        ]);

        return response()->json(['promocion' => $promocion], 201);
    }

    public function actualizar(Request $request, Promocion $promocion)
    {
        $datos = $request->validate([
            'titulo' => ['nullable', 'string', 'max:120'],
            'tipo' => ['required', Rule::in(['porcentaje', 'fijo'])],
            'valor' => ['required', 'numeric', 'min:0'],
            'producto_id' => ['nullable', 'integer', 'exists:productos,id'],
            'categoria_id' => ['nullable', 'integer', 'exists:categorias,id'],
            'activo' => ['nullable', 'boolean'],
            'fecha_inicio' => ['nullable', 'date'],
            'fecha_fin' => ['nullable', 'date'],
        ]);

        $promocion->fill([
            'titulo' => $datos['titulo'] ?? null,
            'tipo' => $datos['tipo'],
            'valor' => $datos['valor'],
            'producto_id' => $datos['producto_id'] ?? null,
            'categoria_id' => $datos['categoria_id'] ?? null,
            'activo' => array_key_exists('activo', $datos) ? (bool) $datos['activo'] : $promocion->activo,
            'fecha_inicio' => $datos['fecha_inicio'] ?? null,
            'fecha_fin' => $datos['fecha_fin'] ?? null,
        ])->save();

        return response()->json(['promocion' => $promocion->fresh()]);
    }

    public function eliminar(Promocion $promocion)
    {
        $promocion->delete();

        return response()->json(['ok' => true]);
    }
}

