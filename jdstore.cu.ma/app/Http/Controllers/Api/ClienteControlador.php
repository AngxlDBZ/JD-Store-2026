<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Usuario;
use Illuminate\Http\Request;

class ClienteControlador extends Controller
{
    public function index()
    {
        $clientes = Usuario::query()
            ->where('rol', 'cliente')
            ->orderByDesc('id')
            ->paginate(15);

        return response()->json(['clientes' => $clientes]);
    }

    public function mostrar(Usuario $cliente)
    {
        if ($cliente->rol !== 'cliente') {
            return response()->json(['mensaje' => 'No es un cliente'], 422);
        }

        $cliente->load(['pedidos.detalles.producto']);

        return response()->json([
            'cliente' => $cliente,
        ]);
    }

    public function usuarios(Request $request)
    {
        $buscar = trim((string) $request->query('buscar', ''));

        $usuarios = Usuario::query()
            ->when($buscar !== '', function ($query) use ($buscar) {
                $query->where(function ($q) use ($buscar) {
                    $q->where('nombre_completo', 'like', '%'.$buscar.'%')
                        ->orWhere('email', 'like', '%'.$buscar.'%')
                        ->orWhere('telefono', 'like', '%'.$buscar.'%');
                });
            })
            ->orderByDesc('id')
            ->paginate(20);

        return response()->json(['usuarios' => $usuarios]);
    }
}
