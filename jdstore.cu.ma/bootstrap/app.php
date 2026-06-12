<?php

use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;

$app = Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        api: __DIR__.'/../routes/api.php',
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware): void {
        $middleware->alias([
            'rol.admin' => \App\Http\Middleware\VerificarRolAdmin::class,
            'rol.vendedor' => \App\Http\Middleware\VerificarRolVendedor::class,
            'rol.cliente' => \App\Http\Middleware\VerificarRolCliente::class,
        ]);
    })
    ->withExceptions(function (Exceptions $exceptions): void {
        //
    })->create();

$publicHtmlPath = $app->basePath('public_html');

if (is_dir($publicHtmlPath)) {
    $app->usePublicPath($publicHtmlPath);
}

return $app;