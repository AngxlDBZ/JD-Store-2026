<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Cupon;
use App\Services\CuponServicio;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class CuponControlador extends Controller
{
    public function listarAdmin(Request $request)
    {
        $buscar = trim((string) $request->string('buscar'));

        $cupones = Cupon::query()
            ->when($buscar !== '', function ($query) use ($buscar) {
                $query->where('codigo', 'like', '%' . $buscar . '%');
            })
            ->orderByDesc('id')
            ->paginate((int) $request->integer('per_page', 15));

        return response()->json([
            'cupones' => $cupones,
        ]);
    }

    public function guardar(Request $request)
    {
        $datos = $this->validarDatos($request);
        $cupon = Cupon::create($datos);

        return response()->json([
            'mensaje' => 'Cupón creado correctamente.',
            'cupon' => $cupon,
        ], 201);
    }

    public function actualizar(Request $request, Cupon $cupon)
    {
        $datos = $this->validarDatos($request, $cupon);
        $cupon->update($datos);

        return response()->json([
            'mensaje' => 'Cupón actualizado correctamente.',
            'cupon' => $cupon->fresh(),
        ]);
    }

    public function eliminar(Cupon $cupon)
    {
        $cupon->delete();

        return response()->json([
            'mensaje' => 'Cupón eliminado correctamente.',
        ]);
    }

    public function validar(Request $request, CuponServicio $cuponServicio)
    {
        $datos = $request->validate([
            'codigo' => ['required', 'string', 'max:50'],
            'subtotal' => ['required', 'numeric', 'min:0'],
        ]);

        $resultado = $cuponServicio->validarCodigo($datos['codigo'], (float) $datos['subtotal']);

        return response()->json([
            'cupon' => [
                'codigo' => $resultado['codigo'],
                'descuento' => $resultado['descuento'],
                'total' => $resultado['total'],
            ],
        ]);
    }

    private function validarDatos(Request $request, ?Cupon $cupon = null): array
    {
        return $request->validate([
            'codigo' => [
                'required',
                'string',
                'max:50',
                Rule::unique('cupones', 'codigo')->ignore($cupon?->id),
            ],
            'tipo' => ['required', Rule::in(['porcentaje', 'fijo'])],
            'valor' => ['required', 'numeric', 'min:0'],
            'monto_minimo' => ['nullable', 'numeric', 'min:0'],
            'uso_maximo' => ['nullable', 'integer', 'min:1'],
            'activo' => ['sometimes', 'boolean'],
            'fecha_inicio' => ['nullable', 'date'],
            'fecha_fin' => ['nullable', 'date', 'after_or_equal:fecha_inicio'],
        ]);
    }
}
