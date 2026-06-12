<?php

namespace App\Services;

use App\Models\DetallePedido;
use App\Models\Producto;
use App\Models\Resena;
use App\Models\Usuario;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

class ResenaServicio
{
    public function crearResena(Usuario $cliente, Producto $producto, int $calificacion, ?string $comentario): Resena
    {
        return DB::transaction(function () use ($cliente, $producto, $calificacion, $comentario) {
            $puede = DetallePedido::query()
                ->where('producto_id', $producto->id)
                ->whereHas('pedido', function ($pedidoQuery) use ($cliente) {
                    $pedidoQuery
                        ->where('cliente_id', $cliente->id)
                        ->where('estado', 'completado')
                        ->where(function ($q) {
                            $q->whereNull('estado_pago')->orWhere('estado_pago', 'aprobado');
                        });
                })
                ->exists();

            if (! $puede) {
                throw ValidationException::withMessages([
                    'resena' => 'Solo puedes reseñar productos que hayas comprado y recibido.',
                ]);
            }

            $resena = Resena::updateOrCreate(
                [
                    'producto_id' => $producto->id,
                    'cliente_id' => $cliente->id,
                ],
                [
                    'calificacion' => $calificacion,
                    'comentario' => $comentario ? trim($comentario) : null,
                    'estado' => 'pendiente',
                ]
            );

            return $resena->fresh()->load(['producto', 'cliente']);
        });
    }
}

