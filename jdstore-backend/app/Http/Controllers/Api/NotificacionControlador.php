<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Notificacion;
use Illuminate\Http\Request;

class NotificacionControlador extends Controller
{
    public function listarCliente(Request $request)
    {
        $usuario = $request->user();

        $notificaciones = Notificacion::query()
            ->where('usuario_id', $usuario->id)
            ->orderByDesc('id')
            ->paginate(15);

        return response()->json(['notificaciones' => $notificaciones]);
    }

    public function marcarLeida(Request $request, Notificacion $notificacion)
    {
        $usuario = $request->user();

        if ((int) $notificacion->usuario_id !== (int) $usuario->id) {
            return response()->json(['mensaje' => 'No autorizado'], 403);
        }

        if (! $notificacion->leido_en) {
            $notificacion->leido_en = now();
            $notificacion->save();
        }

        return response()->json(['notificacion' => $notificacion->fresh()]);
    }
}

