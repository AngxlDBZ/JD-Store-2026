<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Mensaje extends Model
{
    use HasFactory;

    protected $table = 'mensajes';

    protected $fillable = [
        'cliente_id',
        'nombre_remitente',
        'correo_remitente',
        'mensaje',
        'respuesta',
        'leido',
        'leido_cliente',
        'fecha',
        'respondido_en',
        'respondido_por',
    ];

    protected function casts(): array
    {
        return [
            'leido' => 'boolean',
            'leido_cliente' => 'boolean',
            'fecha' => 'datetime',
            'respondido_en' => 'datetime',
        ];
    }
}
