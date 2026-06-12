<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class GuardarPedidoRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'items' => ['required', 'array', 'min:1'],
            'items.*.producto_id' => ['required', 'integer', 'exists:productos,id'],
            'items.*.variante_id' => ['nullable', 'integer', 'exists:producto_variantes,id'],
            'items.*.cantidad' => ['required', 'integer', 'min:1'],
            'direccion_envio' => ['required', 'string', 'min:8', 'max:255'],
            'metodo_pago' => ['nullable', 'string', 'max:50'],
            'cupon_codigo' => ['nullable', 'string', 'max:50'],
        ];
    }
}
