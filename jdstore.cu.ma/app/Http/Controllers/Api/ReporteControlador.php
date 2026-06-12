<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Services\ReporteServicio;
use Illuminate\Http\Request;

class ReporteControlador extends Controller
{
    public function dashboard(ReporteServicio $servicio)
    {
        return response()->json(['resumen' => $servicio->resumenDashboard()]);
    }

    public function ventas(Request $request, ReporteServicio $servicio)
    {
        return response()->json($servicio->ventasPorPeriodo(
            $request->query('desde'),
            $request->query('hasta')
        ));
    }

    public function diario(Request $request, ReporteServicio $servicio)
    {
        return response()->json($servicio->reporteDiario(
            $request->query('fecha')
        ));
    }

    public function productosMasVendidos(Request $request, ReporteServicio $servicio)
    {
        return response()->json($servicio->productosMasVendidos(
            $request->query('desde'),
            $request->query('hasta'),
            (int) $request->query('limite', 10)
        ));
    }

    public function clientesFrecuentes(Request $request, ReporteServicio $servicio)
    {
        return response()->json($servicio->clientesFrecuentes(
            $request->query('desde'),
            $request->query('hasta'),
            (int) $request->query('limite', 10)
        ));
    }
}
