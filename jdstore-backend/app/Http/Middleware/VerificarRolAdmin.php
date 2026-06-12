<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

class VerificarRolAdmin
{
    public function handle(Request $request, Closure $next)
    {
        $usuario = $request->user();

        if (! $usuario || $usuario->rol !== 'admin' || $usuario->estado !== 'activo') {
            return response()->json(['mensaje' => 'No autorizado'], 403);
        }

        return $next($request);
    }
}
