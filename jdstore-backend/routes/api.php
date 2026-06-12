<?php

use App\Http\Controllers\Api\AutenticacionControlador;
use App\Http\Controllers\Api\BannerControlador;
use App\Http\Controllers\Api\CajaControlador;
use App\Http\Controllers\Api\CategoriaControlador;
use App\Http\Controllers\Api\ClienteControlador;
use App\Http\Controllers\Api\CuponControlador;
use App\Http\Controllers\Api\DestacadoControlador;
use App\Http\Controllers\Api\DevolucionControlador;
use App\Http\Controllers\Api\InventarioControlador;
use App\Http\Controllers\Api\MensajeControlador;
use App\Http\Controllers\Api\NotificacionControlador;
use App\Http\Controllers\Api\PedidoControlador;
use App\Http\Controllers\Api\ProductoControlador;
use App\Http\Controllers\Api\PromocionControlador;
use App\Http\Controllers\Api\ReporteControlador;
use App\Http\Controllers\Api\ResenaControlador;
use App\Http\Controllers\Api\WompiControlador;
use Illuminate\Support\Facades\Route;

Route::get('/estado', fn () => response()->json(['ok' => true, 'app' => config('app.name')]));

Route::post('/auth/registro', [AutenticacionControlador::class, 'registrar']);
Route::post('/auth/login', [AutenticacionControlador::class, 'iniciarSesion']);
Route::post('/auth/recuperar', [AutenticacionControlador::class, 'enviarRecuperacionPassword']);
Route::post('/wompi/webhook', [WompiControlador::class, 'webhook']);

Route::get('/categorias', [CategoriaControlador::class, 'index']);
Route::get('/banners', [BannerControlador::class, 'listarPublico']);
Route::get('/destacados', [DestacadoControlador::class, 'listarPublico']);
Route::get('/productos', [ProductoControlador::class, 'index']);
Route::get('/productos/{producto}', [ProductoControlador::class, 'mostrar']);
Route::get('/productos/{producto}/resenas', [ResenaControlador::class, 'listarPublico']);
Route::get('/inventario/sku/{sku}', [InventarioControlador::class, 'porSku']);
Route::post('/mensajes', [MensajeControlador::class, 'guardar']);

Route::middleware('auth:sanctum')->group(function () {
    Route::get('/auth/yo', [AutenticacionControlador::class, 'yo']);
    Route::post('/auth/logout', [AutenticacionControlador::class, 'cerrarSesion']);
    Route::post('/auth/cambiar-password', [AutenticacionControlador::class, 'cambiarPassword']);
    Route::patch('/auth/perfil', [AutenticacionControlador::class, 'actualizarPerfil']);

    Route::middleware('rol.cliente')->group(function () {
        Route::get('/cliente/pedidos', [PedidoControlador::class, 'misPedidos']);
        Route::post('/cliente/pedidos', [PedidoControlador::class, 'crear']);
        Route::get('/cliente/pedidos/{pedido}', [PedidoControlador::class, 'mostrar']);
        Route::post('/cliente/cupones/validar', [CuponControlador::class, 'validar']);
        Route::post('/cliente/pagos/wompi/checkout', [WompiControlador::class, 'crearCheckout']);
        Route::get('/cliente/pagos/wompi/pedidos/{pedido}', [WompiControlador::class, 'sincronizarPedido']);

        Route::get('/cliente/notificaciones', [NotificacionControlador::class, 'listarCliente']);
        Route::patch('/cliente/notificaciones/{notificacion}/leida', [NotificacionControlador::class, 'marcarLeida']);

        Route::post('/cliente/productos/{producto}/resenas', [ResenaControlador::class, 'crear']);

        Route::get('/cliente/mensajes', [MensajeControlador::class, 'listarCliente']);
        Route::post('/cliente/mensajes', [MensajeControlador::class, 'guardarCliente']);
        Route::patch('/cliente/mensajes/{mensaje}/leido', [MensajeControlador::class, 'marcarLeidoCliente']);
    });

    Route::middleware('rol.vendedor')->group(function () {
        Route::post('/caja/abrir', [CajaControlador::class, 'abrir']);
        Route::patch('/caja/{caja}/cerrar', [CajaControlador::class, 'cerrar']);
        Route::get('/caja', [CajaControlador::class, 'listar']);

        Route::get('/devoluciones', [DevolucionControlador::class, 'listar']);
        Route::post('/devoluciones', [DevolucionControlador::class, 'guardar']);
    });

    Route::middleware('rol.admin')->group(function () {
        Route::post('/productos', [ProductoControlador::class, 'guardar']);
        Route::put('/productos/{producto}', [ProductoControlador::class, 'actualizar']);
        Route::delete('/productos/{producto}', [ProductoControlador::class, 'eliminar']);
        Route::delete('/productos/{producto}/permanente', [ProductoControlador::class, 'eliminarPermanentemente']);

        Route::get('/admin/pedidos', [PedidoControlador::class, 'listar']);
        Route::get('/admin/pedidos/{pedido}', [PedidoControlador::class, 'mostrar']);
        Route::patch('/admin/pedidos/{pedido}/estado', [PedidoControlador::class, 'actualizarEstado']);

        Route::get('/admin/mensajes', [MensajeControlador::class, 'listar']);
        Route::patch('/admin/mensajes/{mensaje}/leido', [MensajeControlador::class, 'marcarLeido']);
        Route::patch('/admin/mensajes/{mensaje}/respuesta', [MensajeControlador::class, 'responder']);
        Route::delete('/admin/mensajes/{mensaje}', [MensajeControlador::class, 'eliminar']);

        Route::get('/admin/reportes/dashboard', [ReporteControlador::class, 'dashboard']);
        Route::get('/admin/reportes/ventas', [ReporteControlador::class, 'ventas']);
        Route::get('/admin/reportes/diario', [ReporteControlador::class, 'diario']);
        Route::get('/admin/reportes/productos-mas-vendidos', [ReporteControlador::class, 'productosMasVendidos']);
        Route::get('/admin/reportes/clientes-frecuentes', [ReporteControlador::class, 'clientesFrecuentes']);

        Route::get('/admin/inventario/bajo-stock', [InventarioControlador::class, 'bajoStock']);

        Route::get('/admin/clientes', [ClienteControlador::class, 'index']);
        Route::get('/admin/clientes/{cliente}', [ClienteControlador::class, 'mostrar']);
        Route::get('/admin/usuarios', [ClienteControlador::class, 'usuarios']);

        Route::get('/admin/banners', [BannerControlador::class, 'listarAdmin']);
        Route::post('/admin/banners', [BannerControlador::class, 'guardar']);
        Route::post('/admin/banners/{banner}', [BannerControlador::class, 'actualizar']);
        Route::delete('/admin/banners/{banner}', [BannerControlador::class, 'eliminar']);

        Route::get('/admin/destacados', [DestacadoControlador::class, 'listarAdmin']);
        Route::post('/admin/destacados', [DestacadoControlador::class, 'guardar']);
        Route::patch('/admin/destacados/{destacado}', [DestacadoControlador::class, 'actualizar']);
        Route::delete('/admin/destacados/{destacado}', [DestacadoControlador::class, 'eliminar']);

        Route::get('/admin/promociones', [PromocionControlador::class, 'listar']);
        Route::post('/admin/promociones', [PromocionControlador::class, 'guardar']);
        Route::patch('/admin/promociones/{promocion}', [PromocionControlador::class, 'actualizar']);
        Route::delete('/admin/promociones/{promocion}', [PromocionControlador::class, 'eliminar']);

        Route::get('/admin/cupones', [CuponControlador::class, 'listarAdmin']);
        Route::post('/admin/cupones', [CuponControlador::class, 'guardar']);
        Route::patch('/admin/cupones/{cupon}', [CuponControlador::class, 'actualizar']);
        Route::delete('/admin/cupones/{cupon}', [CuponControlador::class, 'eliminar']);

        Route::get('/admin/resenas', [ResenaControlador::class, 'listarAdmin']);
        Route::patch('/admin/resenas/{resena}/estado', [ResenaControlador::class, 'actualizarEstado']);
    });
});
