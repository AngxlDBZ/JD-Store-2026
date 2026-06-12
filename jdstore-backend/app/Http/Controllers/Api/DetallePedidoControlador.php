<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\DetallePedido;

class DetallePedidoControlador extends Controller
{
    public function mostrar(DetallePedido $detallePedido)
    {
        return response()->json(['detalle' => $detallePedido->load(['pedido', 'producto'])]);
    }
}
