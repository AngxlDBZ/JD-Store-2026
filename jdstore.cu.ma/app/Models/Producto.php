<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Producto extends Model
{
    use HasFactory;

    protected $table = 'productos';

    protected $fillable = [
        'sku',
        'nombre',
        'descripcion',
        'tallas',
        'precio',
        'stock',
        'categoria_id',
        'imagen_url',
        'estado',
    ];

    protected function casts(): array
    {
        return [
            'tallas' => 'array',
            'precio' => 'decimal:2',
        ];
    }

    public function categoria()
    {
        return $this->belongsTo(Categoria::class, 'categoria_id');
    }

    public function variantes()
    {
        return $this->hasMany(ProductoVariante::class, 'producto_id')->orderBy('orden')->orderBy('id');
    }

    public function detallesPedido()
    {
        return $this->hasMany(DetallePedido::class, 'producto_id');
    }

    public function destacado()
    {
        return $this->hasOne(Destacado::class, 'producto_id');
    }
}
