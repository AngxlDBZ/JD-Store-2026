<?php

namespace App\Services;

use App\Models\Cupon;
use Illuminate\Validation\ValidationException;

class CuponServicio
{
    public function validarCodigo(?string $codigo, float $subtotal): ?array
    {
        $codigoNormalizado = strtoupper(trim((string) $codigo));

        if ($codigoNormalizado === '') {
            return null;
        }

        $cupon = Cupon::query()
            ->whereRaw('UPPER(codigo) = ?', [$codigoNormalizado])
            ->first();

        if (! $cupon || ! $cupon->activo) {
            throw ValidationException::withMessages([
                'cupon_codigo' => 'El cupón no existe o no está activo.',
            ]);
        }

        if ($cupon->fecha_inicio && $cupon->fecha_inicio->isFuture()) {
            throw ValidationException::withMessages([
                'cupon_codigo' => 'Este cupón aún no está disponible.',
            ]);
        }

        if ($cupon->fecha_fin && $cupon->fecha_fin->isPast()) {
            throw ValidationException::withMessages([
                'cupon_codigo' => 'Este cupón ya expiró.',
            ]);
        }

        if ($cupon->uso_maximo !== null && (int) $cupon->uso_actual >= (int) $cupon->uso_maximo) {
            throw ValidationException::withMessages([
                'cupon_codigo' => 'Este cupón ya alcanzó su límite de uso.',
            ]);
        }

        if ($cupon->monto_minimo !== null && $subtotal < (float) $cupon->monto_minimo) {
            throw ValidationException::withMessages([
                'cupon_codigo' => 'Debes superar el monto mínimo para usar este cupón.',
            ]);
        }

        $descuento = $cupon->tipo === 'porcentaje'
            ? round($subtotal * ((float) $cupon->valor / 100), 2)
            : (float) $cupon->valor;

        $descuento = min($descuento, $subtotal);

        return [
            'cupon' => $cupon,
            'codigo' => $codigoNormalizado,
            'descuento' => $descuento,
            'total' => max(0, round($subtotal - $descuento, 2)),
        ];
    }

    public function registrarUso(Cupon $cupon): void
    {
        $cupon->increment('uso_actual');
    }
}
