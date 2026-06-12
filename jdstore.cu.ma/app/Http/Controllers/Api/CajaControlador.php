<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Caja;
use Illuminate\Http\Request;

class CajaControlador extends Controller
{
    public function abrir(Request $request)
    {
        $usuario = $request->user();

        $cajaAbierta = Caja::query()
            ->where('vendedor_id', $usuario->id)
            ->whereNull('fecha_cierre')
            ->latest('id')
            ->first();

        if ($cajaAbierta) {
            return response()->json(['caja' => $cajaAbierta], 200);
        }

        $caja = Caja::create([
            'vendedor_id' => $usuario->id,
            'fecha_apertura' => now(),
            'fecha_cierre' => null,
            'total_ventas' => 0,
        ]);

        return response()->json(['caja' => $caja], 201);
    }

    public function cerrar(Caja $caja)
    {
        if ($caja->fecha_cierre) {
            return response()->json(['caja' => $caja], 200);
        }

        $caja->fecha_cierre = now();
        $caja->save();

        return response()->json(['caja' => $caja]);
    }

    public function listar()
    {
        return response()->json([
            'cajas' => Caja::query()->orderByDesc('id')->paginate(15),
        ]);
    }
}
