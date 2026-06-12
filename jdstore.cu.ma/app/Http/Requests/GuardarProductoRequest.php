<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class GuardarProductoRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    protected function prepareForValidation(): void
    {
        $variantesJson = $this->input('variantes_json');

        if (is_string($variantesJson) && trim($variantesJson) !== '') {
            $decodificado = json_decode($variantesJson, true);

            if (json_last_error() === JSON_ERROR_NONE && is_array($decodificado)) {
                $this->merge(['variantes' => $decodificado]);
            }
        }
    }

    public function rules(): array
    {
        return [
            'sku' => ['required', 'string', 'max:100', Rule::unique('productos', 'sku')->ignore($this->route('producto'))],
            'nombre' => ['required', 'string', 'max:255'],
            'descripcion' => ['nullable', 'string'],
            'tallas' => ['nullable', 'array'],
            'tallas.*' => ['string', 'max:20'],
            'precio' => ['required', 'numeric', 'min:0'],
            'stock' => ['required', 'integer', 'min:0'],
            'variantes_json' => ['nullable', 'string'],
            'variantes' => ['required', 'array', 'min:1'],
            'variantes.*.id' => ['nullable', 'integer', 'exists:producto_variantes,id'],
            'variantes.*.talla' => ['required_with:variantes', 'string', 'max:40'],
            'variantes.*.stock' => ['required_with:variantes', 'integer', 'min:0'],
            'categoria_id' => ['required', 'integer', 'exists:categorias,id'],
            'estado' => ['nullable', Rule::in(['activo', 'inactivo'])],
            'imagen' => ['nullable', 'file', 'mimes:avif,webp,jpg,jpeg,png', 'max:10240'],
        ];
    }
}
