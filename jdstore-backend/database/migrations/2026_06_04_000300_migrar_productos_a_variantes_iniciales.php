<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        $productos = DB::table('productos')->select(['id', 'sku', 'tallas', 'stock'])->orderBy('id')->get();

        foreach ($productos as $producto) {
            $tallas = [];

            if (is_string($producto->tallas) && $producto->tallas !== '') {
                $decodificado = json_decode($producto->tallas, true);
                $tallas = is_array($decodificado) ? $decodificado : explode(',', $producto->tallas);
            } elseif (is_array($producto->tallas)) {
                $tallas = $producto->tallas;
            }

            $tallas = collect($tallas)
                ->map(fn ($talla) => trim((string) $talla))
                ->filter()
                ->values();

            if ($tallas->isEmpty()) {
                $tallas = collect(['Unica']);
            }

            $stockTotal = max(0, (int) $producto->stock);
            $variantes = [];

            foreach ($tallas as $indice => $talla) {
                $variantes[] = [
                    'producto_id' => $producto->id,
                    'sku' => $producto->sku.'-'.strtoupper(preg_replace('/[^A-Z0-9]+/i', '', $talla) ?: ('T'.$indice + 1)),
                    'talla' => $talla,
                    'stock' => $indice === 0 ? $stockTotal : 0,
                    'orden' => $indice,
                    'estado' => 'activo',
                    'created_at' => now(),
                    'updated_at' => now(),
                ];
            }

            DB::table('producto_variantes')->insert($variantes);
        }
    }

    public function down(): void
    {
        DB::table('producto_variantes')->truncate();
    }
};
