<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Producto;
use App\Models\Resena;
use App\Services\ResenaServicio;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class ResenaControlador extends Controller
{
    public function listarPublico(Producto $producto)
    {
        $resenas = Resena::query()
            ->where('producto_id', $producto->id)
            ->where('estado', 'aprobada')
            ->with(['cliente'])
            ->orderByDesc('id')
            ->paginate(10);

        $promedio = (float) Resena::query()
            ->where('producto_id', $producto->id)
            ->where('estado', 'aprobada')
            ->avg('calificacion');

        $total = (int) Resena::query()
            ->where('producto_id', $producto->id)
            ->where('estado', 'aprobada')
            ->count();

        return response()->json([
            'resenas' => $resenas,
            'resumen' => [
                'promedio' => round($promedio, 2),
                'total' => $total,
            ],
        ]);
    }

    public function crear(Request $request, Producto $producto, ResenaServicio $servicio)
    {
        $usuario = $request->user();

        $datos = $request->validate([
            'calificacion' => ['required', 'integer', 'min:1', 'max:5'],
            'comentario' => ['nullable', 'string', 'max:2000'],
        ]);

        $resena = $servicio->crearResena($usuario, $producto, (int) $datos['calificacion'], $datos['comentario'] ?? null);

        return response()->json(['resena' => $resena], 201);
    }

    public function listarAdmin(Request $request)
    {
        $estado = $request->query('estado');

        $resenas = Resena::query()
            ->when($estado, fn ($q) => $q->where('estado', $estado))
            ->with(['producto', 'cliente'])
            ->orderByDesc('id')
            ->paginate(20);

        return response()->json(['resenas' => $resenas]);
    }

    public function actualizarEstado(Request $request, Resena $resena)
    {
        $datos = $request->validate([
            'estado' => ['required', Rule::in(['pendiente', 'aprobada', 'rechazada'])],
        ]);

        $resena->estado = $datos['estado'];
        $resena->save();

        return response()->json(['resena' => $resena->fresh()->load(['producto', 'cliente'])]);
    }
}

