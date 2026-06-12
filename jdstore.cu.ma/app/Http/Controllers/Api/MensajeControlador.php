<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Mensaje;
use Illuminate\Http\Request;

class MensajeControlador extends Controller
{
    public function guardar(Request $request)
    {
        $datos = $request->validate([
            'nombre_remitente' => ['required', 'string', 'min:3', 'max:255'],
            'correo_remitente' => ['required', 'email', 'max:255'],
            'mensaje' => ['required', 'string', 'min:10', 'max:2000'],
        ]);

        $mensaje = Mensaje::create(array_merge($datos, [
            'leido' => false,
            'leido_cliente' => false,
            'fecha' => now(),
        ]));

        return response()->json(['mensaje' => $mensaje], 201);
    }

    public function guardarCliente(Request $request)
    {
        $usuario = $request->user();

        $datos = $request->validate([
            'mensaje' => ['required', 'string', 'min:10', 'max:2000'],
        ]);

        $mensaje = Mensaje::create([
            'cliente_id' => $usuario->id,
            'nombre_remitente' => $usuario->nombre_completo ?? $usuario->email,
            'correo_remitente' => $usuario->email,
            'mensaje' => $datos['mensaje'],
            'leido' => false,
            'leido_cliente' => true,
            'fecha' => now(),
        ]);

        return response()->json(['mensaje' => $mensaje], 201);
    }

    public function listar()
    {
        $mensajes = Mensaje::query()
            ->orderByDesc('id')
            ->paginate(20);

        return response()->json(['mensajes' => $mensajes]);
    }

    public function listarCliente(Request $request)
    {
        $usuario = $request->user();

        $mensajes = Mensaje::query()
            ->where(function ($q) use ($usuario) {
                $q->where('cliente_id', $usuario->id)
                    ->orWhere(function ($q2) use ($usuario) {
                        $q2->whereNull('cliente_id')
                            ->where('correo_remitente', $usuario->email);
                    });
            })
            ->orderByDesc('id')
            ->paginate(20);

        return response()->json(['mensajes' => $mensajes]);
    }

    public function marcarLeido(Mensaje $mensaje)
    {
        $mensaje->leido = true;
        $mensaje->save();

        return response()->json(['mensaje' => $mensaje]);
    }

    public function marcarLeidoCliente(Request $request, Mensaje $mensaje)
    {
        $usuario = $request->user();

        $esDelUsuario = (int) $mensaje->cliente_id === (int) $usuario->id
            || ($mensaje->cliente_id === null && $mensaje->correo_remitente === $usuario->email);

        if (! $esDelUsuario) {
            return response()->json(['mensaje' => 'No autorizado'], 403);
        }

        $mensaje->leido_cliente = true;
        $mensaje->save();

        return response()->json(['mensaje' => $mensaje]);
    }

    public function responder(Request $request, Mensaje $mensaje)
    {
        $usuario = $request->user();

        $datos = $request->validate([
            'respuesta' => ['required', 'string'],
        ]);

        $mensaje->respuesta = $datos['respuesta'];
        $mensaje->respondido_en = now();
        $mensaje->respondido_por = $usuario?->id;
        $mensaje->leido = true;
        $mensaje->leido_cliente = false;
        $mensaje->save();

        return response()->json(['mensaje' => $mensaje]);
    }

    public function eliminar(Mensaje $mensaje)
    {
        $mensaje->delete();

        return response()->json(['ok' => true]);
    }
}
