<?php

namespace App\Services;

use App\Models\Notificacion;
use App\Models\Usuario;

class NotificacionServicio
{
    public function crear(Usuario $usuario, string $tipo, string $titulo, ?string $cuerpo = null, ?array $data = null): Notificacion
    {
        return Notificacion::create([
            'usuario_id' => $usuario->id,
            'tipo' => $tipo,
            'titulo' => $titulo,
            'cuerpo' => $cuerpo,
            'data' => $data,
        ]);
    }
}
