<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class RegistrarUsuarioRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'nombre_completo' => ['required', 'string', 'min:3', 'max:255', 'regex:/^[A-Za-zÁÉÍÓÚÜÑáéíóúüñ\s]+$/u'],
            'email' => ['required', 'email', 'max:255', 'unique:users,email'],
            'password' => ['required', 'string', 'min:8', 'confirmed'],
            'telefono' => ['nullable', 'digits:10'],
            'direccion' => ['nullable', 'string', 'min:8', 'max:255'],
            'direcciones_guardadas' => ['nullable', 'array', 'max:10'],
            'direcciones_guardadas.*' => ['string', 'min:8', 'max:255'],
        ];
    }
}
