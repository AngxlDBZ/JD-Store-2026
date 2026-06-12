<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Banner;
use Illuminate\Http\Request;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;

class BannerControlador extends Controller
{
    public function listarPublico()
    {
        $banners = Banner::query()
            ->where('activo', true)
            ->where(function ($query) {
                $query->whereNull('fecha_inicio')->orWhere('fecha_inicio', '<=', now());
            })
            ->where(function ($query) {
                $query->whereNull('fecha_fin')->orWhere('fecha_fin', '>=', now());
            })
            ->orderBy('orden')
            ->orderByDesc('id')
            ->get();

        return response()->json(['banners' => $banners]);
    }

    public function listarAdmin()
    {
        $banners = Banner::query()
            ->orderBy('orden')
            ->orderByDesc('id')
            ->paginate(20);

        return response()->json(['banners' => $banners]);
    }

    public function guardar(Request $request)
    {
        $datos = $request->validate([
            'titulo' => ['required', 'string', 'min:3', 'max:120'],
            'subtitulo' => ['nullable', 'string', 'max:180'],
            'enlace_url' => ['nullable', 'string', 'max:255'],
            'orden' => ['nullable', 'integer', 'min:0'],
            'activo' => ['nullable', 'boolean'],
            'fecha_inicio' => ['nullable', 'date'],
            'fecha_fin' => ['nullable', 'date'],
            'imagen' => ['nullable', 'image', 'max:4096'],
            'imagen_url' => ['nullable', 'string', 'max:255'],
        ]);

        $imagen = $request->file('imagen');

        if ($imagen instanceof UploadedFile) {
            $datos['imagen_url'] = $this->guardarImagen($imagen);
        }

        unset($datos['imagen']);

        $banner = Banner::create([
            'titulo' => $datos['titulo'],
            'subtitulo' => $datos['subtitulo'] ?? null,
            'enlace_url' => $datos['enlace_url'] ?? null,
            'orden' => (int) ($datos['orden'] ?? 0),
            'activo' => array_key_exists('activo', $datos) ? (bool) $datos['activo'] : true,
            'fecha_inicio' => $datos['fecha_inicio'] ?? null,
            'fecha_fin' => $datos['fecha_fin'] ?? null,
            'imagen_url' => $datos['imagen_url'] ?? null,
        ]);

        return response()->json(['banner' => $banner], 201);
    }

    public function actualizar(Request $request, Banner $banner)
    {
        $datos = $request->validate([
            'titulo' => ['required', 'string', 'min:3', 'max:120'],
            'subtitulo' => ['nullable', 'string', 'max:180'],
            'enlace_url' => ['nullable', 'string', 'max:255'],
            'orden' => ['nullable', 'integer', 'min:0'],
            'activo' => ['nullable', 'boolean'],
            'fecha_inicio' => ['nullable', 'date'],
            'fecha_fin' => ['nullable', 'date'],
            'imagen' => ['nullable', 'image', 'max:4096'],
            'imagen_url' => ['nullable', 'string', 'max:255'],
        ]);

        $imagen = $request->file('imagen');

        if ($imagen instanceof UploadedFile) {
            $this->eliminarImagenActual($banner->imagen_url);
            $datos['imagen_url'] = $this->guardarImagen($imagen);
        }

        unset($datos['imagen']);

        $banner->fill([
            'titulo' => $datos['titulo'],
            'subtitulo' => $datos['subtitulo'] ?? null,
            'enlace_url' => $datos['enlace_url'] ?? null,
            'orden' => (int) ($datos['orden'] ?? 0),
            'activo' => array_key_exists('activo', $datos) ? (bool) $datos['activo'] : $banner->activo,
            'fecha_inicio' => $datos['fecha_inicio'] ?? null,
            'fecha_fin' => $datos['fecha_fin'] ?? null,
            'imagen_url' => $datos['imagen_url'] ?? $banner->imagen_url,
        ]);
        $banner->save();

        return response()->json(['banner' => $banner->fresh()]);
    }

    public function eliminar(Banner $banner)
    {
        $this->eliminarImagenActual($banner->imagen_url);
        $banner->delete();

        return response()->json(['ok' => true]);
    }

    private function guardarImagen(UploadedFile $imagen): string
    {
        $ruta = Storage::disk('public')->putFile('banners', $imagen);

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
}
