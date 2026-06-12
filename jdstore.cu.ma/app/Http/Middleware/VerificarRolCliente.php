<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

class VerificarRolCliente
{
    public function handle(Request $request, Closure $next)
    {
        $usuario = $request->user();

        if (! $usuario || ! in_array($usuario->rol, ['admin', 'cliente'], true) || $usuario->estado !== 'activo') {
            return response()->json(['mensaje' => 'No autorizado'], 403);
        }

        return $next($request);
    }
}
