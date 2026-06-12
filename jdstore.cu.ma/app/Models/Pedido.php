<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Pedido extends Model
{
    use HasFactory;

    protected $table = 'pedidos';

    protected $fillable = [
        'cliente_id',
        'subtotal',
        'total',
        'descuento_total',
        'cupon_codigo',
        'metodo_pago',
        'proveedor_pago',
        'estado_pago',
        'referencia_pago',
        'wompi_payment_link_id',
        'wompi_transaction_id',
        'wompi_checkout_url',
        'wompi_payload',
        'estado',
        'direccion_envio',
        'fecha',
    ];

    protected function casts(): array
    {
        return [
            'subtotal' => 'decimal:2',
            'total' => 'decimal:2',
            'descuento_total' => 'decimal:2',
            'fecha' => 'datetime',
            'wompi_payload' => 'array',
        ];
    }

    public function cliente()
    {
        return $this->belongsTo(Usuario::class, 'cliente_id');
    }

    public function detalles()
    {
        return $this->hasMany(DetallePedido::class, 'pedido_id');
    }
}
