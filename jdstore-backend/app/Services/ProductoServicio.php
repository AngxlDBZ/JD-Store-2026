<?php

namespace App\Services;

use App\Models\Producto;
use App\Models\ProductoVariante;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class ProductoServicio
{
    public function crear(array $datos, ?UploadedFile $imagen): Producto
    {
        $variantes = $this->resolverVariantesEntrada($datos);

        if ($imagen) {
            $datos['imagen_url'] = $this->guardarImagen($imagen);
        }

        [$datos['tallas'], $datos['stock']] = $this->resolverResumenProducto($variantes, $datos);

        $producto = Producto::create($datos);

        $this->sincronizarVariantes($producto, $variantes);

        return $producto->load(['categoria', 'variantes']);
    }

    public function actualizar(Producto $producto, array $datos, ?UploadedFile $imagen): Producto
    {
        $variantes = $this->resolverVariantesEntrada($datos);

        if ($imagen) {
            $this->eliminarImagenActual($producto->imagen_url);
            $datos['imagen_url'] = $this->guardarImagen($imagen);
        }

        [$datos['tallas'], $datos['stock']] = $this->resolverResumenProducto($variantes, $datos);
        $producto->fill($datos);
        $producto->save();

        $this->sincronizarVariantes($producto, $variantes);

        return $producto->load(['categoria', 'variantes']);
    }

    public function eliminar(Producto $producto): void
    {
        $this->eliminarImagenActual($producto->imagen_url);
        $producto->delete();
    }

    private function guardarImagen(UploadedFile $imagen): string
    {
        $ruta = Storage::disk('public')->putFile('productos', $imagen);

        return '/storage/'.$ruta;
    }

    private function eliminarImagenActual(?string $url): void
    {
        if (! $url) {
            return;
        }

        $ruta = parse_url($url, PHP_URL_PATH);
        $rutaRelativa = $ruta ? ltrim(str_replace('/storage/', '', $ruta), '/') : null;

        if ($rutaRelativa && Storage::disk('public')->exists($rutaRelativa)) {
            Storage::disk('public')->delete($rutaRelativa);
        }
    }

    private function resolverVariantesEntrada(array &$datos): array
    {
        $variantesCrudas = $datos['variantes'] ?? null;
        unset($datos['variantes'], $datos['variantes_json']);

        if (is_array($variantesCrudas) && count($variantesCrudas) > 0) {
            return collect($variantesCrudas)
                ->map(function ($variante) {
                    $talla = trim((string) ($variante['talla'] ?? ''));

                    return [
                        'id' => $variante['id'] ?? null,
                        'talla' => $talla,
                        'stock' => max(0, (int) ($variante['stock'] ?? 0)),
                    ];
                })
                ->filter(fn ($variante) => $variante['talla'] !== '')
                ->values()
                ->all();
        }

        return [];
    }

    private function resolverResumenProducto(array $variantes, array $datos): array
    {
        $tallas = collect($variantes)
            ->map(fn ($variante) => $variante['talla'])
            ->filter()
            ->values()
            ->all();

        $stock = count($variantes) > 0
            ? collect($variantes)->sum(fn ($variante) => (int) ($variante['stock'] ?? 0))
            : max(0, (int) ($datos['stock'] ?? 0));

        if (empty($tallas)) {
            $tallas = collect($datos['tallas'] ?? [])
                ->map(fn ($talla) => trim((string) $talla))
                ->filter()
                ->values()
                ->all();
        }

        if (empty($tallas)) {
            $tallas = ['Unica'];
        }

        return [$tallas, max(0, (int) $stock)];
    }

    private function sincronizarVariantes(Producto $producto, array $variantes): void
    {
        $existentes = $producto->variantes()->get()->keyBy('id');
        $idsConservados = [];

        foreach (collect($variantes)->values() as $indice => $variante) {
            $payload = [
                'talla' => $variante['talla'],
                'stock' => max(0, (int) ($variante['stock'] ?? 0)),
                'orden' => $indice,
                'estado' => 'activo',
                'sku' => $this->generarSkuVariante($producto->sku, $variante['talla']),
            ];

            $modelo = null;
            $varianteId = $variante['id'] ?? null;

            if ($varianteId && $existentes->has((int) $varianteId)) {
                $modelo = $existentes->get((int) $varianteId);
                $modelo->fill($payload);
                $modelo->save();
            } else {
                $modelo = $producto->variantes()->create($payload);
            }

            $idsConservados[] = $modelo->id;
        }

        if (count($idsConservados) > 0) {
            $producto->variantes()->whereNotIn('id', $idsConservados)->delete();
        }
    }

    private function generarSkuVariante(string $skuProducto, string $talla): string
    {
        $sufijo = strtoupper(Str::of($talla)->ascii()->replaceMatches('/[^A-Za-z0-9]+/', '')->value());
        $sufijo = $sufijo !== '' ? $sufijo : 'VAR';

        return Str::limit($skuProducto.'-'.$sufijo, 100, '');
    }
}
