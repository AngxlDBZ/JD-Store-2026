<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Devolucion;
use App\Models\Producto;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class DevolucionControlador extends Controller
{
    public function guardar(Request $request)
    {
        $datos = $request->validate([
            'pedido_id' => ['required', 'integer', 'exists:pedidos,id'],
            'producto_id' => ['required', 'integer', 'exists:productos,id'],
            'cantidad' => ['required', 'integer', 'min:1'],
            'motivo' => ['nullable', 'string', 'max:255'],
        ]);

        $devolucion = DB::transaction(function () use ($datos) {
            $producto = Producto::query()->lockForUpdate()->findOrFail($datos['producto_id']);
            $producto->stock = $producto->stock + (int) $datos['cantidad'];
            $producto->save();

            return Devolucion::create(array_merge($datos, ['fecha' => now()]));
        });

        return response()->json(['devolucion' => $devolucion], 201);
    }

    public function listar()
    {
        $devoluciones = Devolucion::query()
            ->with(['producto', 'pedido'])
            ->orderByDesc('id')
            ->paginate(20);

        return response()->json(['devoluciones' => $devoluciones]);
    }
}
