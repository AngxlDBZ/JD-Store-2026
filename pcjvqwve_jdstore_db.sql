-- phpMyAdmin SQL Dump
-- version 5.2.3
-- https://www.phpmyadmin.net/
--
-- Servidor: localhost:3306
-- Tiempo de generación: 05-06-2026 a las 09:12:46
-- Versión del servidor: 10.11.16-MariaDB-cll-lve
-- Versión de PHP: 8.3.31

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `pcjvqwve_jdstore_db`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `banners`
--

CREATE TABLE `banners` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `titulo` varchar(120) NOT NULL,
  `subtitulo` varchar(180) DEFAULT NULL,
  `imagen_url` varchar(255) DEFAULT NULL,
  `enlace_url` varchar(255) DEFAULT NULL,
  `orden` int(10) UNSIGNED NOT NULL DEFAULT 0,
  `activo` tinyint(1) NOT NULL DEFAULT 1,
  `fecha_inicio` timestamp NULL DEFAULT NULL,
  `fecha_fin` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `cache`
--

CREATE TABLE `cache` (
  `key` varchar(255) NOT NULL,
  `value` mediumtext NOT NULL,
  `expiration` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `cache_locks`
--

CREATE TABLE `cache_locks` (
  `key` varchar(255) NOT NULL,
  `owner` varchar(255) NOT NULL,
  `expiration` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `caja`
--

CREATE TABLE `caja` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `vendedor_id` bigint(20) UNSIGNED NOT NULL,
  `fecha_apertura` timestamp NOT NULL DEFAULT current_timestamp(),
  `fecha_cierre` timestamp NULL DEFAULT NULL,
  `total_ventas` decimal(12,2) NOT NULL DEFAULT 0.00,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `categorias`
--

CREATE TABLE `categorias` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `nombre` varchar(255) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `categorias`
--

INSERT INTO `categorias` (`id`, `nombre`, `created_at`, `updated_at`) VALUES
(1, 'Camisas', '2026-05-18 02:02:27', '2026-05-18 02:02:27'),
(2, 'Camisetas', '2026-05-18 02:02:28', '2026-05-18 02:02:28'),
(3, 'Sacos', '2026-05-18 02:02:28', '2026-05-18 02:02:28'),
(4, 'Jeans', '2026-05-18 02:02:28', '2026-05-18 02:02:28'),
(5, 'Pantalonetas', '2026-05-18 02:02:28', '2026-05-18 02:02:28'),
(6, 'Polos', '2026-05-18 02:02:28', '2026-05-18 02:02:28'),
(7, 'Chaquetas', '2026-05-18 02:02:28', '2026-05-18 02:02:28'),
(8, 'Pantalón', '2026-05-25 16:43:36', '2026-05-25 16:43:36');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `cupones`
--

CREATE TABLE `cupones` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `codigo` varchar(50) NOT NULL,
  `tipo` enum('porcentaje','fijo') NOT NULL,
  `valor` decimal(10,2) NOT NULL,
  `monto_minimo` decimal(10,2) DEFAULT NULL,
  `uso_maximo` int(10) UNSIGNED DEFAULT NULL,
  `uso_actual` int(10) UNSIGNED NOT NULL DEFAULT 0,
  `activo` tinyint(1) NOT NULL DEFAULT 1,
  `fecha_inicio` timestamp NULL DEFAULT NULL,
  `fecha_fin` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `destacados`
--

CREATE TABLE `destacados` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `producto_id` bigint(20) UNSIGNED NOT NULL,
  `orden` int(10) UNSIGNED NOT NULL DEFAULT 0,
  `activo` tinyint(1) NOT NULL DEFAULT 1,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `detalle_pedidos`
--

CREATE TABLE `detalle_pedidos` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `pedido_id` bigint(20) UNSIGNED NOT NULL,
  `producto_id` bigint(20) UNSIGNED NOT NULL,
  `cantidad` int(10) UNSIGNED NOT NULL,
  `precio_unitario` decimal(12,2) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `detalle_pedidos`
--

INSERT INTO `detalle_pedidos` (`id`, `pedido_id`, `producto_id`, `cantidad`, `precio_unitario`, `created_at`, `updated_at`) VALUES
(10, 10, 33, 1, 60000.00, '2026-05-26 16:18:11', '2026-05-26 16:18:11'),
(11, 11, 38, 1, 60000.00, '2026-05-26 17:47:53', '2026-05-26 17:47:53'),
(12, 12, 75, 1, 120000.00, '2026-05-28 03:18:40', '2026-05-28 03:18:40'),
(13, 13, 44, 1, 60000.00, '2026-05-28 03:20:16', '2026-05-28 03:20:16'),
(14, 14, 71, 1, 85000.00, '2026-05-29 19:43:45', '2026-05-29 19:43:45'),
(15, 15, 88, 10, 10000.00, '2026-05-29 19:57:51', '2026-05-29 19:57:51'),
(16, 16, 43, 1, 60000.00, '2026-06-03 17:13:23', '2026-06-03 17:13:23'),
(17, 17, 71, 1, 85000.00, '2026-06-04 17:39:55', '2026-06-04 17:39:55'),
(18, 18, 34, 1, 60000.00, '2026-06-04 17:44:22', '2026-06-04 17:44:22'),
(19, 19, 34, 1, 60000.00, '2026-06-04 17:45:02', '2026-06-04 17:45:02'),
(20, 20, 88, 1, 10000.00, '2026-06-04 17:46:56', '2026-06-04 17:46:56'),
(21, 21, 88, 1, 10000.00, '2026-06-04 17:47:09', '2026-06-04 17:47:09'),
(22, 22, 88, 1, 10000.00, '2026-06-04 17:47:13', '2026-06-04 17:47:13'),
(23, 23, 88, 1, 10000.00, '2026-06-04 17:47:15', '2026-06-04 17:47:15'),
(24, 24, 88, 1, 10000.00, '2026-06-04 17:47:16', '2026-06-04 17:47:16'),
(25, 25, 88, 1, 10000.00, '2026-06-04 17:47:17', '2026-06-04 17:47:17'),
(26, 26, 88, 1, 10000.00, '2026-06-04 18:38:30', '2026-06-04 18:38:30'),
(27, 27, 88, 1, 10000.00, '2026-06-04 18:39:06', '2026-06-04 18:39:06'),
(28, 28, 63, 1, 85000.00, '2026-06-05 15:37:46', '2026-06-05 15:37:46');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `devoluciones`
--

CREATE TABLE `devoluciones` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `pedido_id` bigint(20) UNSIGNED NOT NULL,
  `producto_id` bigint(20) UNSIGNED NOT NULL,
  `cantidad` int(10) UNSIGNED NOT NULL,
  `motivo` varchar(255) DEFAULT NULL,
  `fecha` timestamp NOT NULL DEFAULT current_timestamp(),
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `failed_jobs`
--

CREATE TABLE `failed_jobs` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `uuid` varchar(255) NOT NULL,
  `connection` text NOT NULL,
  `queue` text NOT NULL,
  `payload` longtext NOT NULL,
  `exception` longtext NOT NULL,
  `failed_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `jobs`
--

CREATE TABLE `jobs` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `queue` varchar(255) NOT NULL,
  `payload` longtext NOT NULL,
  `attempts` tinyint(3) UNSIGNED NOT NULL,
  `reserved_at` int(10) UNSIGNED DEFAULT NULL,
  `available_at` int(10) UNSIGNED NOT NULL,
  `created_at` int(10) UNSIGNED NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `job_batches`
--

CREATE TABLE `job_batches` (
  `id` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `total_jobs` int(11) NOT NULL,
  `pending_jobs` int(11) NOT NULL,
  `failed_jobs` int(11) NOT NULL,
  `failed_job_ids` longtext NOT NULL,
  `options` mediumtext DEFAULT NULL,
  `cancelled_at` int(11) DEFAULT NULL,
  `created_at` int(11) NOT NULL,
  `finished_at` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `logs_actividad`
--

CREATE TABLE `logs_actividad` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `usuario_id` bigint(20) UNSIGNED NOT NULL,
  `accion` varchar(255) NOT NULL,
  `descripcion` text DEFAULT NULL,
  `ip` varchar(45) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `mensajes`
--

CREATE TABLE `mensajes` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `cliente_id` bigint(20) UNSIGNED DEFAULT NULL,
  `nombre_remitente` varchar(255) NOT NULL,
  `correo_remitente` varchar(255) NOT NULL,
  `mensaje` text NOT NULL,
  `respuesta` text DEFAULT NULL,
  `leido` tinyint(1) NOT NULL DEFAULT 0,
  `leido_cliente` tinyint(1) NOT NULL DEFAULT 0,
  `fecha` timestamp NOT NULL DEFAULT current_timestamp(),
  `respondido_en` timestamp NULL DEFAULT NULL,
  `respondido_por` bigint(20) UNSIGNED DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `mensajes`
--

INSERT INTO `mensajes` (`id`, `cliente_id`, `nombre_remitente`, `correo_remitente`, `mensaje`, `respuesta`, `leido`, `leido_cliente`, `fecha`, `respondido_en`, `respondido_por`, `created_at`, `updated_at`) VALUES
(6, 2, 'Juan Rojas', 'juandapro2000@gmail.com', 'hola para pedir un polo', 'HOLA', 1, 0, '2026-05-26 17:48:52', '2026-05-26 17:51:17', 1, '2026-05-26 17:48:52', '2026-05-26 17:51:17');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `migrations`
--

CREATE TABLE `migrations` (
  `id` int(10) UNSIGNED NOT NULL,
  `migration` varchar(255) NOT NULL,
  `batch` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `migrations`
--

INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES
(1, '0001_01_01_000000_create_users_table', 1),
(2, '0001_01_01_000001_create_cache_table', 1),
(3, '0001_01_01_000002_create_jobs_table', 1),
(4, '2026_05_17_200449_create_personal_access_tokens_table', 1),
(5, '2026_05_17_200754_crear_tabla_categorias', 1),
(6, '2026_05_17_200755_crear_tabla_productos', 1),
(7, '2026_05_17_200756_crear_tabla_pedidos', 1),
(8, '2026_05_17_200757_crear_tabla_detalle_pedidos', 1),
(9, '2026_05_17_200757_crear_tabla_recibos', 1),
(10, '2026_05_17_200758_crear_tabla_caja', 1),
(11, '2026_05_17_200759_crear_tabla_devoluciones', 1),
(12, '2026_05_17_200800_crear_tabla_mensajes', 1),
(13, '2026_05_17_200801_crear_tabla_logs_actividad', 1),
(14, '2026_05_18_000001_agregar_respuesta_y_cliente_a_mensajes', 2),
(15, '2026_05_19_000001_agregar_password_temporal_a_users', 3);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `notificaciones`
--

CREATE TABLE `notificaciones` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `usuario_id` bigint(20) UNSIGNED NOT NULL,
  `tipo` varchar(50) NOT NULL DEFAULT 'general',
  `titulo` varchar(140) NOT NULL,
  `cuerpo` text DEFAULT NULL,
  `data` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`data`)),
  `leido_en` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `password_reset_tokens`
--

CREATE TABLE `password_reset_tokens` (
  `email` varchar(255) NOT NULL,
  `token` varchar(255) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `password_reset_tokens`
--

INSERT INTO `password_reset_tokens` (`email`, `token`, `created_at`) VALUES
('juandapro2000@gmail.com', '$2y$12$h3vXio0XyaIERAjCD856zuwkCw043f5jSNWeTs7X7fajm5AHQYWvy', '2026-05-19 05:15:40');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `pedidos`
--

CREATE TABLE `pedidos` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `cliente_id` bigint(20) UNSIGNED NOT NULL,
  `subtotal` decimal(10,2) NOT NULL DEFAULT 0.00,
  `total` decimal(12,2) NOT NULL,
  `descuento_total` decimal(10,2) NOT NULL DEFAULT 0.00,
  `cupon_codigo` varchar(50) DEFAULT NULL,
  `metodo_pago` varchar(255) DEFAULT NULL,
  `proveedor_pago` varchar(40) DEFAULT NULL,
  `estado_pago` varchar(40) DEFAULT NULL,
  `referencia_pago` varchar(120) DEFAULT NULL,
  `wompi_payment_link_id` varchar(120) DEFAULT NULL,
  `wompi_transaction_id` varchar(120) DEFAULT NULL,
  `wompi_checkout_url` varchar(255) DEFAULT NULL,
  `wompi_payload` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`wompi_payload`)),
  `estado` enum('pendiente','en_preparacion','enviado','completado','cancelado') NOT NULL DEFAULT 'pendiente',
  `direccion_envio` varchar(255) DEFAULT NULL,
  `fecha` timestamp NOT NULL DEFAULT current_timestamp(),
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `pedidos`
--

INSERT INTO `pedidos` (`id`, `cliente_id`, `subtotal`, `total`, `descuento_total`, `cupon_codigo`, `metodo_pago`, `proveedor_pago`, `estado_pago`, `referencia_pago`, `wompi_payment_link_id`, `wompi_transaction_id`, `wompi_checkout_url`, `wompi_payload`, `estado`, `direccion_envio`, `fecha`, `created_at`, `updated_at`) VALUES
(10, 2, 0.00, 60000.00, 0.00, NULL, 'Efectivo', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'completado', 'Simón Bolívar', '2026-05-26 16:18:11', '2026-05-26 16:18:11', '2026-05-26 16:18:39'),
(11, 2, 0.00, 60000.00, 0.00, NULL, 'Efectivo', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'completado', 'Simón Bolivar', '2026-05-26 17:47:53', '2026-05-26 17:47:53', '2026-05-28 03:15:11'),
(12, 2, 0.00, 120000.00, 0.00, NULL, 'Efectivo', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'completado', 'Simón Bolivar', '2026-05-28 03:18:40', '2026-05-28 03:18:40', '2026-05-28 03:19:44'),
(13, 2, 0.00, 60000.00, 0.00, NULL, 'Efectivo', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'completado', 'Simón Bolivar', '2026-05-28 03:20:16', '2026-05-28 03:20:16', '2026-05-28 03:20:27'),
(14, 11, 0.00, 85000.00, 0.00, NULL, 'Efectivo', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'pendiente', 'Mz31 Cs13 Ciudadela', '2026-05-29 19:43:45', '2026-05-29 19:43:45', '2026-05-29 19:43:45'),
(15, 2, 0.00, 100000.00, 0.00, NULL, 'Efectivo', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'pendiente', 'Simón Bolivar', '2026-05-29 19:57:51', '2026-05-29 19:57:51', '2026-05-29 19:57:51'),
(16, 2, 0.00, 60000.00, 0.00, NULL, 'Efectivo', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'pendiente', 'Simón Bolivar', '2026-06-03 17:13:23', '2026-06-03 17:13:23', '2026-06-03 17:13:23'),
(17, 2, 0.00, 85000.00, 0.00, NULL, 'Tarjeta', NULL, 'aprobado', 'JDW-20260604133955-HSG8V5', NULL, NULL, NULL, NULL, 'pendiente', 'Simón Bolivar', '2026-06-04 17:39:55', '2026-06-04 17:39:55', '2026-06-04 17:39:55'),
(18, 2, 0.00, 60000.00, 0.00, NULL, 'Wompi', 'wompi', 'pendiente', 'JDW-20260604134422-XYKDDT', 'test_a3pipB', NULL, NULL, '{\"payment_link\":{\"id\":\"test_a3pipB\",\"name\":\"JD Store - Pedido #18\",\"amount_in_cents\":6000000,\"currency\":\"COP\",\"single_use\":true,\"description\":\"Pago del pedido JDW-20260604134422-XYKDDT\",\"sku\":\"JDW-20260604134422-XYKDDT\",\"expires_at\":\"2026-06-04T14:14:22.000Z\",\"collect_shipping\":false,\"collect_customer_legal_id\":false,\"redirect_url\":\"https:\\/\\/jdstore.cu.ma\\/checkout\\/resultado?pedido_id=18\",\"image_url\":null,\"active\":true,\"customer_data\":null,\"created_at\":\"2026-06-04T13:44:23.385Z\",\"updated_at\":\"2026-06-04T13:44:23.385Z\",\"taxes\":[],\"default_language\":\"es\",\"merchant_public_key\":\"pub_test_QYTfeS0cF4ewn0o2M7hEwwJdGTxBRPbW\"}}', 'pendiente', 'Simón Bolivar', '2026-06-04 17:44:22', '2026-06-04 17:44:22', '2026-06-04 17:44:23'),
(19, 2, 0.00, 60000.00, 0.00, NULL, 'Wompi', 'wompi', 'pendiente', 'JDW-20260604134502-TSJVZ1', 'test_PNWBhc', NULL, NULL, '{\"payment_link\":{\"id\":\"test_PNWBhc\",\"name\":\"JD Store - Pedido #19\",\"amount_in_cents\":6000000,\"currency\":\"COP\",\"single_use\":true,\"description\":\"Pago del pedido JDW-20260604134502-TSJVZ1\",\"sku\":\"JDW-20260604134502-TSJVZ1\",\"expires_at\":\"2026-06-04T14:15:02.000Z\",\"collect_shipping\":false,\"collect_customer_legal_id\":false,\"redirect_url\":\"https:\\/\\/jdstore.cu.ma\\/checkout\\/resultado?pedido_id=19\",\"image_url\":null,\"active\":true,\"customer_data\":null,\"created_at\":\"2026-06-04T13:45:02.810Z\",\"updated_at\":\"2026-06-04T13:45:02.810Z\",\"taxes\":[],\"default_language\":\"es\",\"merchant_public_key\":\"pub_test_QYTfeS0cF4ewn0o2M7hEwwJdGTxBRPbW\"}}', 'pendiente', 'Simón Bolivar', '2026-06-04 17:45:02', '2026-06-04 17:45:02', '2026-06-04 17:45:02'),
(20, 2, 0.00, 10000.00, 0.00, NULL, 'Wompi', 'wompi', 'pendiente', 'JDW-20260604134656-FCJC7S', 'test_4b6iAJ', NULL, NULL, '{\"payment_link\":{\"id\":\"test_4b6iAJ\",\"name\":\"JD Store - Pedido #20\",\"amount_in_cents\":1000000,\"currency\":\"COP\",\"single_use\":true,\"description\":\"Pago del pedido JDW-20260604134656-FCJC7S\",\"sku\":\"JDW-20260604134656-FCJC7S\",\"expires_at\":\"2026-06-04T14:16:56.000Z\",\"collect_shipping\":false,\"collect_customer_legal_id\":false,\"redirect_url\":\"https:\\/\\/jdstore.cu.ma\\/checkout\\/resultado?pedido_id=20\",\"image_url\":null,\"active\":true,\"customer_data\":null,\"created_at\":\"2026-06-04T13:46:56.320Z\",\"updated_at\":\"2026-06-04T13:46:56.320Z\",\"taxes\":[],\"default_language\":\"es\",\"merchant_public_key\":\"pub_test_QYTfeS0cF4ewn0o2M7hEwwJdGTxBRPbW\"}}', 'pendiente', 'Simón Bolivar', '2026-06-04 17:46:56', '2026-06-04 17:46:56', '2026-06-04 17:46:56'),
(21, 2, 0.00, 10000.00, 0.00, NULL, 'Wompi', 'wompi', 'pendiente', 'JDW-20260604134709-H8EIUH', 'test_ZyhIdh', NULL, NULL, '{\"payment_link\":{\"id\":\"test_ZyhIdh\",\"name\":\"JD Store - Pedido #21\",\"amount_in_cents\":1000000,\"currency\":\"COP\",\"single_use\":true,\"description\":\"Pago del pedido JDW-20260604134709-H8EIUH\",\"sku\":\"JDW-20260604134709-H8EIUH\",\"expires_at\":\"2026-06-04T14:17:09.000Z\",\"collect_shipping\":false,\"collect_customer_legal_id\":false,\"redirect_url\":\"https:\\/\\/jdstore.cu.ma\\/checkout\\/resultado?pedido_id=21\",\"image_url\":null,\"active\":true,\"customer_data\":null,\"created_at\":\"2026-06-04T13:47:09.770Z\",\"updated_at\":\"2026-06-04T13:47:09.770Z\",\"taxes\":[],\"default_language\":\"es\",\"merchant_public_key\":\"pub_test_QYTfeS0cF4ewn0o2M7hEwwJdGTxBRPbW\"}}', 'pendiente', 'Simón Bolivar', '2026-06-04 17:47:09', '2026-06-04 17:47:09', '2026-06-04 17:47:09'),
(22, 2, 0.00, 10000.00, 0.00, NULL, 'Wompi', 'wompi', 'pendiente', 'JDW-20260604134713-Y2HEMB', 'test_Egwpr9', NULL, NULL, '{\"payment_link\":{\"id\":\"test_Egwpr9\",\"name\":\"JD Store - Pedido #22\",\"amount_in_cents\":1000000,\"currency\":\"COP\",\"single_use\":true,\"description\":\"Pago del pedido JDW-20260604134713-Y2HEMB\",\"sku\":\"JDW-20260604134713-Y2HEMB\",\"expires_at\":\"2026-06-04T14:17:13.000Z\",\"collect_shipping\":false,\"collect_customer_legal_id\":false,\"redirect_url\":\"https:\\/\\/jdstore.cu.ma\\/checkout\\/resultado?pedido_id=22\",\"image_url\":null,\"active\":true,\"customer_data\":null,\"created_at\":\"2026-06-04T13:47:13.635Z\",\"updated_at\":\"2026-06-04T13:47:13.635Z\",\"taxes\":[],\"default_language\":\"es\",\"merchant_public_key\":\"pub_test_QYTfeS0cF4ewn0o2M7hEwwJdGTxBRPbW\"}}', 'pendiente', 'Simón Bolivar', '2026-06-04 17:47:13', '2026-06-04 17:47:13', '2026-06-04 17:47:13'),
(23, 2, 0.00, 10000.00, 0.00, NULL, 'Wompi', 'wompi', 'pendiente', 'JDW-20260604134715-K0PMGJ', 'test_LX91y2', NULL, NULL, '{\"payment_link\":{\"id\":\"test_LX91y2\",\"name\":\"JD Store - Pedido #23\",\"amount_in_cents\":1000000,\"currency\":\"COP\",\"single_use\":true,\"description\":\"Pago del pedido JDW-20260604134715-K0PMGJ\",\"sku\":\"JDW-20260604134715-K0PMGJ\",\"expires_at\":\"2026-06-04T14:17:15.000Z\",\"collect_shipping\":false,\"collect_customer_legal_id\":false,\"redirect_url\":\"https:\\/\\/jdstore.cu.ma\\/checkout\\/resultado?pedido_id=23\",\"image_url\":null,\"active\":true,\"customer_data\":null,\"created_at\":\"2026-06-04T13:47:15.491Z\",\"updated_at\":\"2026-06-04T13:47:15.491Z\",\"taxes\":[],\"default_language\":\"es\",\"merchant_public_key\":\"pub_test_QYTfeS0cF4ewn0o2M7hEwwJdGTxBRPbW\"}}', 'pendiente', 'Simón Bolivar', '2026-06-04 17:47:15', '2026-06-04 17:47:15', '2026-06-04 17:47:15'),
(24, 2, 0.00, 10000.00, 0.00, NULL, 'Wompi', 'wompi', 'pendiente', 'JDW-20260604134716-UELIAL', 'test_iGJh22', NULL, NULL, '{\"payment_link\":{\"id\":\"test_iGJh22\",\"name\":\"JD Store - Pedido #24\",\"amount_in_cents\":1000000,\"currency\":\"COP\",\"single_use\":true,\"description\":\"Pago del pedido JDW-20260604134716-UELIAL\",\"sku\":\"JDW-20260604134716-UELIAL\",\"expires_at\":\"2026-06-04T14:17:16.000Z\",\"collect_shipping\":false,\"collect_customer_legal_id\":false,\"redirect_url\":\"https:\\/\\/jdstore.cu.ma\\/checkout\\/resultado?pedido_id=24\",\"image_url\":null,\"active\":true,\"customer_data\":null,\"created_at\":\"2026-06-04T13:47:16.842Z\",\"updated_at\":\"2026-06-04T13:47:16.842Z\",\"taxes\":[],\"default_language\":\"es\",\"merchant_public_key\":\"pub_test_QYTfeS0cF4ewn0o2M7hEwwJdGTxBRPbW\"}}', 'pendiente', 'Simón Bolivar', '2026-06-04 17:47:16', '2026-06-04 17:47:16', '2026-06-04 17:47:16'),
(25, 2, 0.00, 10000.00, 0.00, NULL, 'Wompi', 'wompi', 'pendiente', 'JDW-20260604134717-I0HVEW', 'test_TjU2St', NULL, NULL, '{\"payment_link\":{\"id\":\"test_TjU2St\",\"name\":\"JD Store - Pedido #25\",\"amount_in_cents\":1000000,\"currency\":\"COP\",\"single_use\":true,\"description\":\"Pago del pedido JDW-20260604134717-I0HVEW\",\"sku\":\"JDW-20260604134717-I0HVEW\",\"expires_at\":\"2026-06-04T14:17:17.000Z\",\"collect_shipping\":false,\"collect_customer_legal_id\":false,\"redirect_url\":\"https:\\/\\/jdstore.cu.ma\\/checkout\\/resultado?pedido_id=25\",\"image_url\":null,\"active\":true,\"customer_data\":null,\"created_at\":\"2026-06-04T13:47:18.061Z\",\"updated_at\":\"2026-06-04T13:47:18.061Z\",\"taxes\":[],\"default_language\":\"es\",\"merchant_public_key\":\"pub_test_QYTfeS0cF4ewn0o2M7hEwwJdGTxBRPbW\"}}', 'pendiente', 'Simón Bolivar', '2026-06-04 17:47:17', '2026-06-04 17:47:17', '2026-06-04 17:47:18'),
(26, 2, 0.00, 10000.00, 0.00, NULL, 'Wompi', 'wompi', 'pendiente', 'JDW-20260604143830-Z6P31D', 'test_oWEp1L', NULL, 'https://checkout.wompi.co/l/test_oWEp1L', '{\"payment_link\":{\"id\":\"test_oWEp1L\",\"name\":\"JD Store - Pedido #26\",\"amount_in_cents\":1000000,\"currency\":\"COP\",\"single_use\":true,\"description\":\"Pago del pedido JDW-20260604143830-Z6P31D\",\"sku\":\"JDW-20260604143830-Z6P31D\",\"expires_at\":\"2026-06-04T15:08:30.000Z\",\"collect_shipping\":false,\"collect_customer_legal_id\":false,\"redirect_url\":\"https:\\/\\/jdstore.cu.ma\\/checkout\\/resultado?pedido_id=26\",\"image_url\":null,\"active\":true,\"customer_data\":null,\"created_at\":\"2026-06-04T14:38:30.896Z\",\"updated_at\":\"2026-06-04T14:38:30.896Z\",\"taxes\":[],\"default_language\":\"es\",\"merchant_public_key\":\"pub_test_QYTfeS0cF4ewn0o2M7hEwwJdGTxBRPbW\",\"_checkout_url\":\"https:\\/\\/checkout.wompi.co\\/l\\/test_oWEp1L\"}}', 'pendiente', 'Simón Bolivar', '2026-06-04 18:38:30', '2026-06-04 18:38:30', '2026-06-04 18:38:30'),
(27, 2, 0.00, 10000.00, 0.00, NULL, 'Wompi', 'wompi', 'error', 'JDW-20260604143906-RFQIMG', 'test_TKgWRN', '12109284-1780584003-30668', 'https://checkout.wompi.co/l/test_TKgWRN', '{\"payment_link\":{\"id\":\"test_TKgWRN\",\"name\":\"JD Store - Pedido #27\",\"amount_in_cents\":1000000,\"currency\":\"COP\",\"single_use\":true,\"description\":\"Pago del pedido JDW-20260604143906-RFQIMG\",\"sku\":\"JDW-20260604143906-RFQIMG\",\"expires_at\":\"2026-06-04T15:09:06.000Z\",\"collect_shipping\":false,\"collect_customer_legal_id\":false,\"redirect_url\":\"https:\\/\\/jdstore.cu.ma\\/checkout\\/resultado?pedido_id=27\",\"image_url\":null,\"active\":true,\"customer_data\":null,\"created_at\":\"2026-06-04T14:39:06.966Z\",\"updated_at\":\"2026-06-04T14:39:06.966Z\",\"taxes\":[],\"default_language\":\"es\",\"merchant_public_key\":\"pub_test_QYTfeS0cF4ewn0o2M7hEwwJdGTxBRPbW\",\"_checkout_url\":\"https:\\/\\/checkout.wompi.co\\/l\\/test_TKgWRN\"},\"transaction\":{\"id\":\"12109284-1780584003-30668\",\"created_at\":\"2026-06-04T14:40:03.345Z\",\"finalized_at\":\"2026-06-04T14:40:08.581Z\",\"amount_in_cents\":1000000,\"reference\":\"test_TKgWRN_1780583948_rQnOrUrTR\",\"customer_email\":\"cardenascortessantiago@gmail.com\",\"currency\":\"COP\",\"payment_method_type\":\"NEQUI\",\"payment_method\":{\"type\":\"NEQUI\",\"extra\":{\"is_three_ds\":false,\"transaction_id\":\"SANDBOX-1780584008qvJRq5\",\"three_ds_auth_type\":null,\"external_identifier\":\"17805840082Vr0PF\"},\"phone_number\":\"3103970638\"},\"status\":\"ERROR\",\"status_message\":\"N\\u00famero no v\\u00e1lido en Sandbox\",\"billing_data\":null,\"shipping_address\":null,\"redirect_url\":\"https:\\/\\/jdstore.cu.ma\\/checkout\\/resultado?pedido_id=27\",\"payment_source_id\":null,\"payment_link_id\":\"test_TKgWRN\",\"customer_data\":{\"device_id\":\"7a4fba4053712cd4f88692d8e3124ebd\",\"full_name\":\"Botija\",\"browser_info\":{\"browser_tz\":\"300\",\"browser_language\":\"es-CO\",\"browser_user_agent\":\"Mozilla\\/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit\\/537.36 (KHTML, like Gecko) Chrome\\/148.0.0.0 Safari\\/537.36\",\"browser_color_depth\":\"32\",\"browser_screen_width\":\"1536\",\"browser_screen_height\":\"864\"},\"phone_number\":\"+573103970638\",\"device_data_token\":\"eyJhbGciOiJIUzI1NiJ9.eyJjb21wcmVzc2VkIjoiZUp6VlZsMXY0am9RL1N1V240cVVMWUdFTE8wK1VkSlN0TkJiRmJwOXVGcFZqajBKRm9tZDZ6aDhiTlgvZnNjSnBlekhmZThGS2NGbnhwN2pPVE0yTDNSbGJmbFlnUmxsb0N5OXBIUDlRK1k1Nnc3T2ZYTDJKSlhRMjRyY0xVblBQL2UvRUFTaThBdlpSV0dIak1veWh5ZEl2a3JiSFFTZno0T0luSDI5WGM1bkhzbmxHc2dFK0ZwM3lIaGxkQUhkWGpna0M1WXlJdy9PMVBzNWRzd3NvNWN2TkRFWUVReFNhV2VpM3dGNjNvQ3BwRlpvd3RYT2ZmZEZxNjRRT0RCdGhxZCtyWXVBamVTQTQvc3hqcGpoSzJtQjI5bzRERGVESUtoTUtqZHNkNFJJemxSV3M4eGhVSDBhLzRXUXJPWTZrVGxDS2NzcmNNQ1NKVG5ZRXlDR2FtMTFTUyt0cWVIVm8yWE9iS3BOMFpJTStvZDlqemlIMHM1K2o2SFlSbWJNYW5OdmRBbkdTcWpHdW5iYVhJUWUzVUl5bVgwRDNLdzU1ZHJBRHdpRGdYY0RlWEx3bTlrbCtEaHpvbldXQTVrcWZrN09wc3BDM2puMU8xbHFkRGVaWFI5OFBOSzh6aDQ2NURZbUU4UEtsZVFWaWZwWUsvN094OC9nb2hkMVNDd05wamVJZXoyeXFaNEh6ejRwbTVkSFlnZitGR3F4WWhqcUhpZklWclIrNE5IVXdEODFLTDRmS1pidm0zSUloN2k4UjYwczRJZHVsQm9WWUNSbjNTdWRhYXdkajFiY0FLZ25LZXlLWHZZR1FmUUczWUxNVnBqQllSUytRVEZtSDcyQ3ZrZTUxbXZNOHJWeVVvcFdPSlJmYzVZdlVBZVU1eGRUQlpXaittY2pGaUxzUU1SWHYrQXJac1NXR1JocnhXdGozT1p3VTIrMU9ZZENteFpBMFF2WkJLakdETGVJWFVGTDdJVFNDWDFpbkV1T0ZiSnFjeUZBU1l5Rm1kUEtZa1A4VGNjc2w0bVJDSTJ4dTJwYy9QaUxUTFJGNFJDNE1VeXRjNm5la1JsQXpyWW9pV3U4K1lJOFFBcU9MSkJGaVJLeDNPNWJ3K1AwZmRKOFNhNTMxamdONXN4Z1B6aXFEYjlLcDVZOFl2WnI0eUN0dE4yWFFNWWFPM1RqL0JlUWFYQ0x6UnFKdm51MHJtQWtyakQ5NjJOWENYMm43ZEl3QjlGYXJaWGVLcGVNdk1hbWRidDl3YllwbWdhUGI4ZzNDVnN3VGR1ajFySzA3Vmx3cjQxMWlwQlk4N3JBVEpBYmJFdm1xQlpZVkV2azFTN2xHS0kvdy9NTnk4dk43cFlpZGZWVnA2bmNPUy9xZ0ZmdjZHdGhaLy9ENmJ0ek83QnJUelR5UHlBcDYrS0QwM3d2cjJ1UmZmU2NIczdqcEphNS9ZVHRobXcvRGszc3VZMFVvTnR3bGJ1RWl6SkVlOEgyQ2JSbmRYRXkxRmwySE9FRlo5cTdRa3dMUEF4dldZV25LaDJ5WWVxTGZwSU1reWp3QXhINWtjK0drRjc0UFJGd3dRZSszMCtDVUtSaEJHRTB3S2Q3OEtqWEQzekJRM2E4czZjeHJ2YVpoV25DUWgvL09QVDZYSVRwY0JoZDlNVVFnbDQvaEVUUTEzOEJWRFBxUmc9PSJ9._xCVZaqzCI-w6NYpnulr5K0x6-mdtHRCOkbI8M-9zhk\"},\"bill_id\":null,\"taxes\":[],\"tip_in_cents\":null,\"merchant\":{\"id\":2109284,\"name\":\"JD Store 12\",\"legal_name\":\"Juan Diego Mora Perea\",\"contact_name\":\"Juan Mora\",\"phone_number\":\"3103970638\",\"logo_url\":null,\"legal_id_type\":\"CC\",\"email\":\"cardenascortessantiago@gmail.com\",\"legal_id\":\"1005716789\",\"public_key\":\"pub_test_QYTfeS0cF4ewn0o2M7hEwwJdGTxBRPbW\"},\"entries\":[],\"disbursement\":null,\"refunds\":[]}}', 'cancelado', 'Simón Bolivar', '2026-06-04 18:39:06', '2026-06-04 18:39:06', '2026-06-04 18:41:03'),
(28, 2, 0.00, 85000.00, 0.00, NULL, 'Wompi', 'wompi', 'error', 'JDW-20260605113746-PCJ0OV', 'test_VXmBnr', '12109284-1780659505-75750', 'https://checkout.wompi.co/l/test_VXmBnr', '{\"payment_link\":{\"id\":\"test_VXmBnr\",\"name\":\"JD Store - Pedido #28\",\"amount_in_cents\":8500000,\"currency\":\"COP\",\"single_use\":true,\"description\":\"Pago del pedido JDW-20260605113746-PCJ0OV\",\"sku\":\"JDW-20260605113746-PCJ0OV\",\"expires_at\":\"2026-06-05T12:07:47.000Z\",\"collect_shipping\":false,\"collect_customer_legal_id\":false,\"redirect_url\":\"https:\\/\\/jdstore.cu.ma\\/checkout\\/resultado?pedido_id=28\",\"image_url\":null,\"active\":true,\"customer_data\":null,\"created_at\":\"2026-06-05T11:37:47.707Z\",\"updated_at\":\"2026-06-05T11:37:47.707Z\",\"taxes\":[],\"default_language\":\"es\",\"merchant_public_key\":\"pub_test_QYTfeS0cF4ewn0o2M7hEwwJdGTxBRPbW\",\"_checkout_url\":\"https:\\/\\/checkout.wompi.co\\/l\\/test_VXmBnr\"},\"transaction\":{\"id\":\"12109284-1780659505-75750\",\"created_at\":\"2026-06-05T11:38:25.446Z\",\"finalized_at\":\"2026-06-05T11:38:27.139Z\",\"amount_in_cents\":8500000,\"reference\":\"test_VXmBnr_1780659473_eC71QWNoH\",\"customer_email\":\"cardenascortessantiago@gmail.com\",\"currency\":\"COP\",\"payment_method_type\":\"NEQUI\",\"payment_method\":{\"type\":\"NEQUI\",\"extra\":{\"is_three_ds\":false,\"transaction_id\":\"SANDBOX-1780659507wScrHg\",\"three_ds_auth_type\":null,\"external_identifier\":\"1780659507CmNgZ1\"},\"phone_number\":\"3103970638\"},\"status\":\"ERROR\",\"status_message\":\"N\\u00famero no v\\u00e1lido en Sandbox\",\"billing_data\":null,\"shipping_address\":null,\"redirect_url\":\"https:\\/\\/jdstore.cu.ma\\/checkout\\/resultado?pedido_id=28\",\"payment_source_id\":null,\"payment_link_id\":\"test_VXmBnr\",\"customer_data\":{\"device_id\":\"7a4fba4053712cd4f88692d8e3124ebd\",\"full_name\":\"qweqweqw\",\"browser_info\":{\"browser_tz\":\"300\",\"browser_language\":\"es-CO\",\"browser_user_agent\":\"Mozilla\\/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit\\/537.36 (KHTML, like Gecko) Chrome\\/148.0.0.0 Safari\\/537.36\",\"browser_color_depth\":\"32\",\"browser_screen_width\":\"1536\",\"browser_screen_height\":\"864\"},\"phone_number\":\"+573103970638\",\"device_data_token\":\"eyJhbGciOiJIUzI1NiJ9.eyJjb21wcmVzc2VkIjoiZUp6VlZsMXY0am9RL1N1V240cVVMWUdFTE8wK1VkSlN0TkJiRmJwOXVGcFZqajBKRm9tZDZ6aDhiTlgvZnNjSnBlekhmZThGS2NGbnhwN2pPVE0yTDNSbGJmbFlnUmxsb0N5OXBIUDlRK1k1Nnc3T2ZYTDJKSlhRMjRyY0xVblBQL2UvRUFTaThBdlpSV0dIak1veWh5ZEl2a3JiSFFTZno0T0luSDI5WGM1bkhzbmxHc2dFK0ZwM3lIaGxkQUhkWGpna0M1WXlJdy9PMVBzNWRzd3NvNWN2TkRFWUVReFNhV2VpM3dGNjNvQ3BwRlpvd3RYT2ZmZEZxNjRRT0RCdGhxZCtyWXVBamVTQTQvc3hqcGpoSzJtQjI5bzRERGVESUtoTUtqZHNkNFJJemxSV3M4eGhVSDBhLzRXUXJPWTZrVGxDS2NzcmNNQ1NKVG5ZRXlDR2FtMTFTUyt0cWVIVm8yWE9iS3BOMFpJTStvZDlqemlIMHM1K2o2SFlSbWJNYW5OdmRBbkdTcWpHdW5iYVhJUWUzVUl5bVgwRDNLdzU1ZHJBRHdpRGdYY0RlWEx3bTlrbCtEaHpvbldXQTVrcWZrN09wc3BDM2puMU8xbHFkRGVaWFI5OFBOSzh6aDQ2NURZbUU4UEtsZVFWaWZwWUsvN094OC9nb2hkMVNDd05wamVJZXoyeXFaNEh6ejRwbTVkSFlnZitGR3F4WWhqcUhpZklWclIrNE5IVXdEODFLTDRmS1pidm0zSUloN2k4UjYwczRJZHVsQm9WWUNSbjNTdWRhYXdkajFiY0FLZ25LZXlLWHZZR1FmUUczWUxNVnBqQllSUytRVEZtSDcyQ3ZrZTUxbXZNOHJWeVVvcFdPSlJmYzVZdlVBZVU1eGRUQlpXaittY2pGaUxzUU1SWHYrQXJac1NXR1JocnhXdGozT1p3VTIrMU9ZZENteFpBMFF2WkJLakdETGVJWFVGTDdJVFNDWDFpbkV1T0ZiSnFjeUZBU1l5Rm1kUEtZa1A4VGNjc2w0bVJDSTJ4dTJwYy9QaUxUTFJGNFJDNE1VeXRjNm5la1JsQXpyWW9pV3U4K1lJOFFBcU9MSkJGaVJLeDNPNWJ3K1AwZmRKOFNhNTMxamdONXN4Z1B6aXFEYjlLcDVZOFl2WnI0eUN0dE4yWFFNWWFPM1RqL0JlUWFYQ0x6UnFKdm51MHJtQWtyakQ5NjJOWENYMm43ZEl3QjlGYXJaWGVLcGVNdk1hbWRidDl3YllwbWdhUGI4ZzNDVnN3VGR1ajFySzA3Vmx3cjQxMWlwQlk4N3JBVEpBYmJFdm1xQlpZVkV2azFTN2xHS0kvdy9NTnk4dk43cFlpZGZWVnA2bmNPUy9xZ0ZmdjZHdGhaLy9ENmJ0ek83QnJUelR5UHlBcDYrS0QwM3d2cjJ1UmZmU2NIczdqcEphNS9ZVHRobXcvRGszc3VZMFVvTnR3bGJ1RWl6SkVlOEgyQ2JSbmRYRXkxRmwySE9FRlo5cTdRa3dMUEF4dldZV25LaDJ5WWVxTGZwSU1reWp3QXhINWtjK0drRjc0UFJGd3dRZSszMCtDVUtSaEJHRTB3S2Q3OEtqWEQzekJRM2E4czZjeHJ2YVpoV25DUWgvL09QVDZYSVRwY0JoZDlNVVFnbDQvaEVUUTEzOEJWRFBxUmc9PSJ9._xCVZaqzCI-w6NYpnulr5K0x6-mdtHRCOkbI8M-9zhk\"},\"bill_id\":null,\"taxes\":[],\"tip_in_cents\":null,\"merchant\":{\"id\":2109284,\"name\":\"JD Store 12\",\"legal_name\":\"Juan Diego Mora Perea\",\"contact_name\":\"Juan Mora\",\"phone_number\":\"3103970638\",\"logo_url\":null,\"legal_id_type\":\"CC\",\"email\":\"cardenascortessantiago@gmail.com\",\"legal_id\":\"1005716789\",\"public_key\":\"pub_test_QYTfeS0cF4ewn0o2M7hEwwJdGTxBRPbW\"},\"entries\":[],\"disbursement\":null,\"refunds\":[]}}', 'cancelado', 'Simón Bolivar', '2026-06-05 15:37:46', '2026-06-05 15:37:46', '2026-06-05 15:38:49');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `personal_access_tokens`
--

CREATE TABLE `personal_access_tokens` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `tokenable_type` varchar(255) NOT NULL,
  `tokenable_id` bigint(20) UNSIGNED NOT NULL,
  `name` text NOT NULL,
  `token` varchar(64) NOT NULL,
  `abilities` text DEFAULT NULL,
  `last_used_at` timestamp NULL DEFAULT NULL,
  `expires_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `personal_access_tokens`
--

INSERT INTO `personal_access_tokens` (`id`, `tokenable_type`, `tokenable_id`, `name`, `token`, `abilities`, `last_used_at`, `expires_at`, `created_at`, `updated_at`) VALUES
(39, 'App\\Models\\Usuario', 4, 'spa', 'fd7c001c7bbb779fdf10589f165f3a2aee50b34572c68062f2bafb4a2fb11602', '[\"*\"]', '2026-05-19 07:20:15', NULL, '2026-05-19 07:05:15', '2026-05-19 07:20:15'),
(100, 'App\\Models\\Usuario', 9, 'spa', '84c96cb048e78b78054a02e49d88ef996a7527c0e826f0040a3d12d4e2555c7b', '[\"*\"]', '2026-05-27 03:42:53', NULL, '2026-05-24 07:04:07', '2026-05-27 03:42:53'),
(143, 'App\\Models\\Usuario', 12, 'spa', '71e8597326a3d1011ed7748c7879f12caf6510b54eb7210792e0608e4eeb6c14', '[\"*\"]', '2026-05-26 14:32:41', NULL, '2026-05-26 14:32:25', '2026-05-26 14:32:41'),
(179, 'App\\Models\\Usuario', 14, 'spa', '537bc35a16a7296dd24782b46142c65e4c8ad62aecd7e18a3cbd3f509e5ab1eb', '[\"*\"]', '2026-06-02 19:24:22', NULL, '2026-05-28 03:27:51', '2026-06-02 19:24:22'),
(181, 'App\\Models\\Usuario', 11, 'spa', '6790a01a787e9e89fb403857014f9c948e169317a927b026e6899b1869a7332a', '[\"*\"]', '2026-05-31 11:23:47', NULL, '2026-05-29 19:43:16', '2026-05-31 11:23:47'),
(214, 'App\\Models\\Usuario', 2, 'spa', 'c932573aea621a30facda47265bb469de8c6efa7c36830e22b90afc489572b78', '[\"*\"]', '2026-06-05 17:11:56', NULL, '2026-06-05 17:11:54', '2026-06-05 17:11:56');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `productos`
--

CREATE TABLE `productos` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `sku` varchar(255) NOT NULL,
  `nombre` varchar(255) NOT NULL,
  `descripcion` text DEFAULT NULL,
  `tallas` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`tallas`)),
  `precio` decimal(12,2) NOT NULL,
  `stock` int(10) UNSIGNED NOT NULL DEFAULT 0,
  `categoria_id` bigint(20) UNSIGNED NOT NULL,
  `imagen_url` varchar(255) DEFAULT NULL,
  `estado` enum('activo','inactivo') NOT NULL DEFAULT 'activo',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `productos`
--

INSERT INTO `productos` (`id`, `sku`, `nombre`, `descripcion`, `tallas`, `precio`, `stock`, `categoria_id`, `imagen_url`, `estado`, `created_at`, `updated_at`) VALUES
(18, 'C0001', 'CAMISA BASSER & FITCH', 'CAMISA DE BOTÓN MARCA BASSER & FITCH COLOR ARENA', '[\"L\",\"XL\",\"XXL\"]', 60000.00, 10, 1, 'https://jdstore.cu.ma/storage/productos/kF4oOrAIGlRsCxZGrfp0VKlfSkd6X1e361cWa8P3.avif', 'activo', '2026-05-25 16:46:12', '2026-05-25 17:14:34'),
(19, 'C0002', 'CAMISA BASSER & FITCH', 'CAMISA DE BOTÓN BASSER & FITCH DE COLOR NEGRO CON DISEÑO DE LINEAS ROJAS', '[\"L\",\"XL\"]', 60000.00, 10, 1, 'https://jdstore.cu.ma/storage/productos/HKK90F928a3tP959T0TswBN4AOdJXJ7rD3F1f25d.avif', 'activo', '2026-05-25 19:54:49', '2026-05-25 19:54:49'),
(20, 'C0003', 'CAMISA BASSER FASHION', 'CAMISA DE BOTÓN MARCA BASSER FASHION DE COLOR BLANCO CON DISEÑO DE HOJAS Y DETALLES EN ROSADO', '[\"S\",\"M\",\"L\",\"XL\"]', 60000.00, 10, 1, 'https://jdstore.cu.ma/storage/productos/W2ZiFe1qXTLtimpU4t6sqWB98yqX1LvjzCHJrYrC.avif', 'activo', '2026-05-25 20:05:38', '2026-05-25 20:05:38'),
(21, 'CS0001', 'CAMISETA HUGO BOSS', 'CAMISETA HUGO BOSS, COLOR BEIGE', '[\"S\",\"M\",\"L\",\"XL\"]', 60000.00, 10, 2, 'https://jdstore.cu.ma/storage/productos/PsmMK79uG6WDyajsjFXNJhWzBBhK1JiM5w7tgXVw.avif', 'activo', '2026-05-25 20:11:17', '2026-05-25 20:15:14'),
(22, 'CS0002', 'CAMISETA ARMANI EXCHANGE', 'CAMISETA ARMANI EXCHANGE, COLOR GRIS CON ESTAMPADO EN LA PARTE FRONTAL', '[\"S\",\"M\",\"L\"]', 60000.00, 10, 2, 'https://jdstore.cu.ma/storage/productos/Ewk7lF5JH2hoxCwB51pvMSMPPD8RQJYZD73xufL5.avif', 'activo', '2026-05-25 20:12:39', '2026-05-25 20:12:39'),
(23, 'CS0003', 'CAMISETA HUGO BOSS', 'CAMISETA HUGO BOSS, COLOR AZUL OSCURO CON DISEÑO FRONTAL', '[\"S\",\"M\",\"L\"]', 60000.00, 10, 2, 'https://jdstore.cu.ma/storage/productos/aUcaUISgazlo1mzvPAJkk04CV16I72RZRB7e7zdC.avif', 'activo', '2026-05-25 20:13:51', '2026-05-25 20:13:51'),
(24, 'CS0004', 'CAMISETA HUGO BOSS', 'CAMISETA HUGO BOSS, COLOR ROJO CON DISEÑO FRONTAL.', '[\"S\",\"M\",\"L\",\"XL\"]', 60000.00, 10, 2, 'https://jdstore.cu.ma/storage/productos/n2W6eCQne3XgoWTJY6364vDZaNNpwZJQWuHFyHsr.avif', 'activo', '2026-05-25 20:14:43', '2026-05-25 20:14:43'),
(25, 'CS0005', 'CAMISETA DOLCE & GABBANA', 'CAMISETA DOLCE & GABBANA, COLOR AZUL REY CON DISEÑO FRONTAL', '[\"M\",\"L\",\"XL\"]', 60000.00, 10, 2, 'https://jdstore.cu.ma/storage/productos/pmrnsyydBp8vhqaPl2cdKVpizmfDj3868Ps7l2oI.avif', 'activo', '2026-05-25 20:16:42', '2026-05-25 20:16:42'),
(26, 'CS0006', 'CAMISETA HELLSTAR', 'CAMISETA HELLSTAR, COLOR BLANCO CON ESTAMPADO EN LA PARTE DE ATRAS', '[\"S\",\"M\",\"L\",\"XL\"]', 60000.00, 10, 2, 'https://jdstore.cu.ma/storage/productos/9esaKHD9dEGVbDL0XJDmH4jy9ONjfZzblOYCLnTv.avif', 'activo', '2026-05-25 20:18:01', '2026-05-25 20:19:40'),
(27, 'CS0007', 'CAMISETA HELLSTAR', 'CAMISETA HELLSTAR, COLOR NEGRO CON ESTAMPADO EN LA PARTE DE ATRAS', '[\"L\",\"XL\"]', 60000.00, 10, 2, 'https://jdstore.cu.ma/storage/productos/Z0c57mT3OdLdOXl46QUSgTSqXo89mVX1aBKA4Uo3.avif', 'activo', '2026-05-25 20:19:32', '2026-05-25 20:19:32'),
(28, 'CS0008', 'CAMISETA HUGO BOSS', 'CAMISETA HUGO BOSS, COLOR BLANCO CON ESTAMPADO FRONTAL', '[\"S\",\"M\",\"L\"]', 60000.00, 10, 2, 'https://jdstore.cu.ma/storage/productos/kMfEvvLfRLBQ4bbO8WcNoFZ1Yek2lTcVjMAVegQm.avif', 'activo', '2026-05-25 20:20:28', '2026-05-25 20:20:28'),
(29, 'CS0009', 'CAMISETA HUGO BOSS', 'CAMISETA HUGO BOSS, COLOR CREMA', '[\"S\",\"M\",\"L\"]', 60000.00, 10, 2, 'https://jdstore.cu.ma/storage/productos/VI9n5xzWEZm8n4yzHHSmBK2B0YMJNR3dy2IiuVX6.avif', 'activo', '2026-05-25 20:21:33', '2026-05-25 20:21:33'),
(30, 'CS0010', 'CAMISETA HUGO BOSS', 'CAMISETA HUGO BOSS, COLOR BLANCO CON DISEÑO EN UN LATERAL', '[\"M\",\"L\"]', 60000.00, 10, 2, 'https://jdstore.cu.ma/storage/productos/7NTQZip1OULzyUwRpHHqUlobAnZPOIltHtiQFsJx.avif', 'activo', '2026-05-25 20:22:31', '2026-05-25 20:22:31'),
(31, 'C0004', 'CAMISA STRONG', 'CAMISA DE BOTÓN MARCEA STRONG CON DISEÑO DE FRANJAS AMARILLAS Y NEGRAS', '[\"M\",\"L\",\"XL\"]', 60000.00, 10, 1, 'https://jdstore.cu.ma/storage/productos/kVQgEfYaWWF3QmmGGjlirXXs6hgnxrCuZlSaexFt.avif', 'activo', '2026-05-26 02:59:51', '2026-05-26 02:59:51'),
(32, 'C0005', 'CAMISA BASSER & FITCH', 'CAMISA DE BOTÓN MARCA BASSER & FITCH DE COLOR BLANCO CON LINEAS COLOR SALMÓN', '[\"L\",\"XL\"]', 60000.00, 10, 1, 'https://jdstore.cu.ma/storage/productos/Y0YwPk7beHubvvZcBNpwXfWGi1OPb0GNJj8QmCOv.avif', 'activo', '2026-05-26 03:06:28', '2026-05-26 03:06:28'),
(33, 'CS0011', 'CAMISETA YANKEES', 'CAMISETA YANKEES, COLOR NEGRO CON ESTAMPADO HARLEY DAVIDSON FRONTAL', '[\"S\",\"M\",\"L\"]', 60000.00, 9, 2, 'http://jdstore.cu.ma/storage/productos/fStr3zfpmMz15zrFNtusswC6WURSrnWmvJwslPZk.avif', 'activo', '2026-05-26 05:37:53', '2026-05-26 16:18:11'),
(34, 'CS0012', 'CAMISETA TOMMY HILFIGER', 'CAMISETA TOMMY HILFIGER, COLOR NEGRO CON ESTAMPADO FRONTAL', '[\"S\",\"M\",\"L\",\"XL\"]', 60000.00, 8, 2, 'http://jdstore.cu.ma/storage/productos/yodVCZxvNcTCaI4CZVkTVBpLNRwRD5sauDjFOcC9.avif', 'activo', '2026-05-26 05:39:21', '2026-06-04 17:45:02'),
(35, 'CS0013', 'CAMISETA DOLCE & GABBANA', 'CAMISETA DOLCE & GABBANA, COLOR VERDE OSCURO', '[\"S\",\"M\"]', 60000.00, 10, 2, 'http://jdstore.cu.ma/storage/productos/mTWl51YVsW3ydo3eG9fKkT2LvPSuOmBmCWqRkU1F.avif', 'activo', '2026-05-26 05:40:33', '2026-05-26 05:40:33'),
(36, 'C0006', 'CAMISA RALPH LAUREN', 'CAMISA DE BOTÓN MARCA RALPH LAUREN  DE COLOR CREMA', '[\"XL\",\"XXL\"]', 60000.00, 10, 1, 'https://jdstore.cu.ma/storage/productos/yTugu9upcpepo2yV9r15ymPsnAwDOfdQr7WwLBZQ.avif', 'activo', '2026-05-26 05:43:44', '2026-05-26 05:43:44'),
(37, 'CS0014', 'CAMISETA PSYCHO BUNNY', 'CAMISETA PSYCHO BUNNY, COLOR AZUL OSCURO CON ESTAMPADO FRONTAL', '[\"M\",\"L\"]', 60000.00, 10, 2, 'http://jdstore.cu.ma/storage/productos/wvKPPZ3uFoqndqFXwi8oDbeFoWRJZjdxUW3sxAT0.avif', 'activo', '2026-05-26 05:44:04', '2026-05-26 05:44:04'),
(38, 'C0007', 'CAMISA RALPH LAUREN', 'CAMISA DE BOTÓN MARCA RALPH LAUREN DE COLOR ROJO', '[\"M\",\"L\",\"XL\"]', 60000.00, 9, 1, 'https://jdstore.cu.ma/storage/productos/t4lZICYlqVf4OqJP9pguaRmn0bP1lm2azOKHMwnn.avif', 'activo', '2026-05-26 05:46:19', '2026-05-26 17:47:53'),
(39, 'CS0015', 'CAMISETA BAPE', 'CAMISETA BAPE, COLOR AMARILLO CON ESTAMPADO FRONTAL', '[\"S\",\"M\",\"L\",\"XL\"]', 60000.00, 10, 2, 'http://jdstore.cu.ma/storage/productos/iggeG0RU1gbL5gG0it46x7U6v4jQwSNwP7jEhhWl.avif', 'activo', '2026-05-26 05:46:37', '2026-05-26 05:46:37'),
(40, 'CS0016', 'CAMISETA MONASTERY', 'CAMISETA MONASTERY, COLOR BLANCO CON DISEÑO FRONTAL', '[\"M\",\"L\"]', 60000.00, 10, 2, 'http://jdstore.cu.ma/storage/productos/XWrpLhicByJw5O7rvYfWOnJNVyzG9XBHAMFI2xcW.avif', 'activo', '2026-05-26 05:47:31', '2026-05-26 05:47:31'),
(41, 'CS0017', 'CAMISETA MONASTERY', 'CAMISETA MONASTERY, COLOR CREMA CON DISEÑO FRONTAL', '[\"S\",\"M\",\"L\",\"XL\"]', 60000.00, 10, 2, 'http://jdstore.cu.ma/storage/productos/SUgP5q0hVVeSr5OvFDVb9CILPDp4FavkOiaYPPxu.avif', 'activo', '2026-05-26 05:48:22', '2026-05-26 05:48:22'),
(42, 'CS0018', 'CAMISETA MONASTERY', 'CAMISETA MONASTERY, COLOR NEGRO CON DISEÑO FRONTAL', '[\"S\",\"M\",\"L\",\"XL\"]', 60000.00, 10, 2, 'http://jdstore.cu.ma/storage/productos/0WoajUEQeoZYRsnxBXfnr3Lyjmoy23V6gWEu8O8F.avif', 'activo', '2026-05-26 05:49:04', '2026-05-26 05:49:04'),
(43, 'CS0019', 'CAMISETA DSQUARED2', 'CAMISETA DSQUARED2, COLOR GRIS OPACO', '[\"S\",\"M\",\"L\",\"XL\"]', 60000.00, 9, 2, 'http://jdstore.cu.ma/storage/productos/k9hBjeMasluSAAbE15M8BWAwSTXwuIGTB2d4EpZh.avif', 'activo', '2026-05-26 05:54:13', '2026-06-03 17:13:23'),
(44, 'CS0020', 'CAMISETA NIKE', 'CAMISETA NIKE, COLOR AZUL OSCURO CON ESTAMPADO FRONTAL', '[\"M\",\"L\"]', 60000.00, 9, 2, 'http://jdstore.cu.ma/storage/productos/ovOdlb7bQOlTEYIWwgwXRJj0N7K7MnXVN4pZCnad.avif', 'activo', '2026-05-26 05:54:48', '2026-05-28 03:20:16'),
(45, 'PL0001', 'PANTALONETA FOX', 'PANTALONETA FOX, MULTICOLOR CON ESTAMPADOS LATERALES', '[\"S\",\"M\",\"L\",\"XL\"]', 55000.00, 10, 5, 'http://jdstore.cu.ma/storage/productos/GPpLxOWDloQvKDaUe3uP73sX22c5acQkqhPWdqeJ.avif', 'activo', '2026-05-26 05:56:12', '2026-05-26 05:56:12'),
(46, 'PL0002', 'PANTALONETA ADIDAS', 'PANTALONETA ADIDAS, COLOR GRIS CON DISEÑOS LATERALES', '[\"S\",\"M\",\"L\",\"XL\"]', 65000.00, 10, 5, 'http://jdstore.cu.ma/storage/productos/wUYNQHbJMFk9uNB2w2d3AcG15pvK5dnmLfajR4rw.avif', 'activo', '2026-05-26 05:57:13', '2026-05-26 05:57:13'),
(47, 'CH0001', 'CHAQUETA THE NORTH FACE', 'CHAQUETA THE NORTH FACE, COLORES NEGRO Y BEIGE', '[\"UNICA\"]', 120000.00, 10, 7, 'https://jdstore.cu.ma/storage/productos/NqLQA7JJTdNGbK27hULXkb3MhBcXxcjApZazNxh5.avif', 'activo', '2026-05-26 06:02:26', '2026-05-26 06:02:26'),
(48, 'CH0002', 'CHAQUETA ADIDAS', 'CHAQUETA ADIDAS, COLORES BLANCO Y TURQUESA VERDOSO', '[\"UNICA\"]', 120000.00, 10, 7, 'https://jdstore.cu.ma/storage/productos/7gKl6ElvcrHpJtamqY9oxTL3DfDeX7C50am8EQEZ.avif', 'activo', '2026-05-26 06:04:10', '2026-05-26 06:04:10'),
(49, 'S0001', 'SACO PUMA', 'SACO PUMA, COLOR ROJO CON DISEÑO NEGRO EN LOS LATERALES', '[\"XL\"]', 150000.00, 10, 3, 'https://jdstore.cu.ma/storage/productos/rOlyOYT5mER85dG00WjsDOtv4h5jOV5TYLV56dh3.avif', 'activo', '2026-05-26 06:08:09', '2026-05-26 06:08:09'),
(50, 'J0001', 'JEAN DSQUARED2', 'JEAN MARCA DSQUARED2, COLOR NEGRO CON AGUJEROS Y DISEÑO EN FORMA DE GOTAS DE PINTURA', '[\"S\",\"M\",\"L\",\"XL\"]', 110000.00, 10, 4, 'https://jdstore.cu.ma/storage/productos/2YfqmSRGA63tDR8cnd5Pbizr4gS4YLCWquqqdPet.avif', 'activo', '2026-05-26 06:10:57', '2026-05-26 06:10:57'),
(51, 'J0002', 'JEAN DSQUARED2', 'JEAN MARCA DSQUARED2, COLOR AZUL CON AGUJEROS', '[\"S\",\"M\",\"L\",\"XL\"]', 110000.00, 10, 4, 'https://jdstore.cu.ma/storage/productos/7CYcX79AdYELvUha6H9zGYmiIT1sLF2PUzAGdFNn.avif', 'activo', '2026-05-26 06:12:05', '2026-05-26 06:12:05'),
(52, 'J0003', 'JEAN DIESEL', 'JEAN MARCA DIESEL, COLOR AZUL CON DISEÑO DE PARCHES', '[\"S\",\"M\",\"L\"]', 110000.00, 10, 4, 'https://jdstore.cu.ma/storage/productos/kpyMoTxUKyoq7zb7fQpDoUdpkIpsJ7wCNZa6FKd6.avif', 'activo', '2026-05-26 06:14:08', '2026-05-26 06:14:08'),
(53, 'J0004', 'JEAN LEVI\'S', 'JEAN MARCA LEVI\'S, COLOR NEGRO', '[\"S\",\"M\",\"L\"]', 110000.00, 10, 4, 'https://jdstore.cu.ma/storage/productos/1MaJfsDlHUjjJO9pauT7s5Hos2myZQr36J1iGD2F.avif', 'activo', '2026-05-26 06:15:06', '2026-05-26 06:15:06'),
(54, 'J0005', 'JEAN DIESEL', 'JEAN MARCA DIESEL, COLOR AZUL CON UN POCO DE ENCLARECIMIENTO', '[\"S\",\"M\",\"L\",\"XL\"]', 110000.00, 10, 4, 'https://jdstore.cu.ma/storage/productos/rQ0CUtpRZyMj6OKUiEYJuNMYXB0BIPWs0BD1rAgg.avif', 'activo', '2026-05-26 06:16:03', '2026-05-26 06:16:03'),
(55, 'J0006', 'JEAN TOMMY HILFIGER', 'JEAN MARCA TOMMY HILFIGER, COLOR AZUL CLARO CON DISEÑO DE POCO DESGASTE', '[\"S\",\"M\",\"L\",\"XL\"]', 110000.00, 10, 4, 'https://jdstore.cu.ma/storage/productos/yCDorgfwmDnnokLd5LVsel6snISaiHYC97WWjpTe.avif', 'activo', '2026-05-26 06:16:59', '2026-05-26 06:18:14'),
(56, 'J0007', 'JEAN AMERICANINO', 'JEAN MARCA AMERICANINO, COLOR AZUL CON DISEÑO DE POCO DESGASTE', '[\"S\",\"M\",\"L\",\"XL\"]', 110000.00, 10, 4, 'https://jdstore.cu.ma/storage/productos/vJVoJV2qAmbUlDDrZOtemoR9NglvWzfIivw0lwTc.avif', 'activo', '2026-05-26 06:17:51', '2026-05-26 06:17:51'),
(57, 'J0008', 'JEAN DSQUEARED2', 'JEAN MARCA DSQUARED2, COLOR AZUL CON DISEÑO DE GOTAS DE PINTURA Y POCO DESGASTE', '[\"M\",\"L\"]', 110000.00, 10, 4, 'https://jdstore.cu.ma/storage/productos/f64tEr42vadl4iLO6uvo8iwZHOGRUiJQSfEaQJda.avif', 'activo', '2026-05-26 06:19:15', '2026-05-26 06:19:15'),
(58, 'J0009', 'JEAN AMIRI', 'JEAN MARCA AMIRI, COLOR AZUL CLARO CON DISEÑO DE AGUJEROS Y GOTAS DE PINTURA', '[\"S\",\"M\",\"L\"]', 110000.00, 10, 4, 'https://jdstore.cu.ma/storage/productos/ZN2SiPmxMH71EHo5srPubkh3ZeRA77pg8QblQADD.avif', 'activo', '2026-05-26 06:25:13', '2026-05-26 06:25:13'),
(59, 'J0010', 'JEAN DSQUARED2', 'JEAN MARCA DSQUARED2, COLOR AZUL CON DISEÑO DE GOTAS DE PINTURA', '[\"S\",\"M\",\"L\",\"XL\"]', 110000.00, 10, 4, 'https://jdstore.cu.ma/storage/productos/UExlSVw4npDwpf81vQtuuhBk4eeZ7L8Fvpv41G3V.avif', 'activo', '2026-05-26 06:26:51', '2026-05-26 06:26:51'),
(60, 'C0008', 'CAMISA RALPH LAUREN', 'CAMISA DE BOTÓN MARCA RALPH LAUREN DE COLOR AZUL COBALTO', '[\"M\",\"L\",\"XL\"]', 60000.00, 10, 1, 'https://jdstore.cu.ma/storage/productos/pG32ZilpLXyjL80nvq6QUS7XECMsLULzuW1SKHN7.avif', 'activo', '2026-05-26 08:11:42', '2026-05-26 08:11:42'),
(61, 'C0009', 'CAMISA RALPH LAUREN', 'CAMISA DE BOTÓN MARCA RALPH LAUREN DE COLOR NEGRO', '[\"L\",\"XL\"]', 60000.00, 10, 1, 'https://jdstore.cu.ma/storage/productos/M9EOnH2QkOxn5DqV6aK4bsnJ9RfQ2gxQ6GPn1EKH.avif', 'activo', '2026-05-26 08:12:44', '2026-05-26 08:12:44'),
(62, 'C0010', 'CAMISA RALPH LAUREN', 'CAMISA DE BOTÓN MARCA RALPH LAUREN  DE COLOR VERDE PASTO', '[\"L\",\"XL\"]', 60000.00, 10, 1, 'https://jdstore.cu.ma/storage/productos/lo6ogh5lFPZM3yNO9VymN5DO8xxGt2QfE37r3Qqy.avif', 'activo', '2026-05-26 08:14:04', '2026-05-26 08:14:04'),
(63, 'PT0001', 'SUDADERA NIKE', 'SUDADERA DE TELA FRÍA EN CORTE RECTO MARCA NIKE DE COLOR NEGRO', '[\"L\",\"XL\",\"XXL\"]', 85000.00, 10, 8, 'https://jdstore.cu.ma/storage/productos/UETERjf6mLaGj35oeuA6DPVZE1dbiwtdgJHoxLiP.avif', 'activo', '2026-05-26 08:26:14', '2026-06-05 15:38:49'),
(64, 'PT0002', 'SUDADERA CARGO NIKE', 'SUDADERA TIPO CARGO MARCA NIKE DE COLOR GRIS CLARO', '[\"M\",\"L\",\"XL\"]', 85000.00, 10, 8, 'https://jdstore.cu.ma/storage/productos/6F8E492TRqLsr9jU6bPyAKiDq7BfwJ1q1nnrXlIK.avif', 'activo', '2026-05-26 08:28:23', '2026-05-26 08:35:47'),
(65, 'PT0003', 'SUDADERA  NIKE', 'SUDADERA MARCA NIKE DE COLOR NEGRO', '[\"L\",\"XL\"]', 85000.00, 10, 8, 'https://jdstore.cu.ma/storage/productos/Y80Ko4nNwuF7xdf56EaB1e7kNG6gMk4zrxvryqb6.avif', 'activo', '2026-05-26 08:31:30', '2026-05-26 08:32:40'),
(66, 'PT0004', 'SUDADERA CARGO NIKE', 'SUDADERA TIPO CARGO DE TELA FRÍA MARCA NIKE DE COLOR GRIS AZULADO', '[\"L\"]', 85000.00, 10, 8, 'https://jdstore.cu.ma/storage/productos/QDASiF883BphzJlkKQdX8BK3U1TzHOr3APFKWnsr.avif', 'activo', '2026-05-26 08:35:16', '2026-05-26 08:35:16'),
(67, 'PT0005', 'SUDADERA NIKE', 'SUDADERA MARCA NIKE DE COLOR VERDE PASTO', '[\"L\",\"XL\"]', 85000.00, 10, 8, 'https://jdstore.cu.ma/storage/productos/rG5ZPp1eA4fILYGjBqTxGHodgYyBrMXxh7KukJro.avif', 'activo', '2026-05-26 08:37:50', '2026-05-26 08:37:50'),
(68, 'PT0006', 'SUDADERA NIKE', 'SUDADERA DE TELA FRÍA MARCA NIKE DE COLOR CREMA', '[\"M\",\"L\",\"XL\"]', 85000.00, 10, 8, 'https://jdstore.cu.ma/storage/productos/AhqLBQ9VilGg8C3T5bTeED91S7n4iCPsCuRgw10f.avif', 'activo', '2026-05-26 08:46:33', '2026-05-26 08:46:33'),
(69, 'PT0007', 'SUDADERA NIKE', 'SUDADERA DE CORTE RECTO CON TELA FRÍA MARCA NIKE DE COLOR CREMA', '[\"L\",\"XL\"]', 85000.00, 10, 8, 'https://jdstore.cu.ma/storage/productos/XC79RqaPyUfEiaePDc1mzni7DPqnXYUOdkz1rxsX.avif', 'activo', '2026-05-26 08:49:02', '2026-05-26 08:49:02'),
(70, 'PT0008', 'SUDADERA NIKE', 'SUDADERA MARCA NIKE DE COLOR NEGRO', '[\"L\",\"XL\"]', 85000.00, 10, 8, 'https://jdstore.cu.ma/storage/productos/Ctz0MU8HY6g80NkDJ1MAShrSscBBGat3AlMRrhVE.avif', 'activo', '2026-05-26 08:50:12', '2026-05-26 08:50:12'),
(71, 'PT0009', 'SUDADERA ADIDAS', 'SUDADERA DE CORTE RECTO Y TELA FRÍA MARCA NIKE DE COLOR NEGRO CON DETALLES EN BLANCO', '[\"L\",\"XL\"]', 85000.00, 8, 8, 'https://jdstore.cu.ma/storage/productos/ykzrabtZRKJQMqx3Zn8XpqoP2Z5PI1LlsIOu4PlM.avif', 'activo', '2026-05-26 08:53:50', '2026-06-04 17:39:55'),
(72, 'J0011', 'JEAN CARGO GREGORY', 'JEAN TIPO CARGO MARCA GREGORY DE COLOR GRIS AZULADO', '[\"XL\"]', 120000.00, 10, 4, 'https://jdstore.cu.ma/storage/productos/wpuBG5UTvdnkaUjjapM677WGA3hlO491mq1Ix9hn.avif', 'activo', '2026-05-26 08:58:24', '2026-05-26 08:58:24'),
(73, 'J0012', 'JEAN CARGO GREGORY', 'JEAN TIPO CARGO MARCA GREGORY DE COLOR GRIS OSCURO', '[\"L\",\"XL\"]', 120000.00, 10, 4, 'https://jdstore.cu.ma/storage/productos/09K0qZgy0UQrgGQGxpm5IvGKCcw80wUms8hYsZXy.avif', 'activo', '2026-05-26 08:59:30', '2026-05-26 08:59:30'),
(74, 'PT0010', 'PANTALÓN CARGO MONARCA', 'PANTALÓN TIPO CARGO EN DRILL MARCA MONARCA COLOR CAQUI', '[\"L\",\"XL\"]', 120000.00, 10, 8, 'https://jdstore.cu.ma/storage/productos/pBmN3YhEn3Bb0Nc1FwmTIXcNGdGcWbRu7ZS7i85C.avif', 'activo', '2026-05-26 09:01:00', '2026-05-26 09:01:00'),
(75, 'PT0011', 'PANTALÓN CARGO GOMELOS', 'PANTALÓN TIPO CARGO EN DRILL MARCA GOMELOS DE COLOR CAFÉ', '[\"M\",\"L\",\"XL\"]', 120000.00, 9, 8, 'https://jdstore.cu.ma/storage/productos/Nx3gSQrIpkljsEHKgxyyGfsoATc5ee3RX8xd6UQc.avif', 'activo', '2026-05-26 09:02:56', '2026-05-28 03:18:40'),
(76, 'J0013', 'JEAN CARGO GREGORY', 'JEAN TIPO CARGO MARCA GREGORY DE COLOR GRIS CLARO', '[\"XL\"]', 120000.00, 10, 4, 'https://jdstore.cu.ma/storage/productos/EmEWesCFA1yVIMYeDf1KzbkcZKBwxoYfnIm3bMMK.avif', 'activo', '2026-05-26 09:05:03', '2026-05-26 09:05:03'),
(77, 'P0001', 'POLO TOMMY HILFIGER', 'POLO MARCA TOMMY HILFIGER DE COLOR AZUL COBALTO CON DETALLES EN CUELLO Y MANGAS DE COLOR BLANCO', '[\"L\",\"XL\"]', 70000.00, 10, 6, 'https://jdstore.cu.ma/storage/productos/IpHZqIu5qPhWTY6KbsMZoBb551KW8CY7Kl4sTqhy.avif', 'activo', '2026-05-26 09:08:06', '2026-05-26 09:08:06'),
(78, 'P0002', 'POLO LACOSTE', 'POLO MARCA LACOSTE DE COLOR ROJO CON DETALLES DE LINEAS EN CUELLO Y MANGAS DE COLOR BLANCO Y ROJO', '[\"M\",\"L\",\"XL\"]', 70000.00, 10, 6, 'https://jdstore.cu.ma/storage/productos/gInskugUZX1ZIbLNqCoxkUEaOOKEcTiLTlYAdSnP.avif', 'activo', '2026-05-26 09:09:40', '2026-05-26 09:09:40'),
(79, 'P0003', 'POLO ARMANI EXCHANGE', 'POLO MARCA ARMANI EXCHANGE DE COLOR AZUL MARINO CON DETALLES EN LAS MANGAS DE COLOR BLANCO', '[\"S\",\"M\",\"L\",\"XL\"]', 70000.00, 10, 6, 'https://jdstore.cu.ma/storage/productos/ozdFRXTLMOQP7TVOSJL3pcxbf2uIadGQuvs2QlWK.avif', 'activo', '2026-05-26 09:14:20', '2026-05-26 09:14:20'),
(80, 'P0004', 'POLO VERSACE', 'POLO MARCA VERSACE DE COLOR VERDE CON DETALLES EN CUELLO Y MANGAS DE COLOR NEGRO', '[\"M\",\"L\",\"XL\"]', 70000.00, 10, 6, 'https://jdstore.cu.ma/storage/productos/hryylLzm2WVpfFLijDeYPA6y9t0za3hKpAK2XPN8.avif', 'activo', '2026-05-26 09:23:38', '2026-05-26 09:23:38'),
(81, 'P0005', 'POLO HUGO BOSS', 'POLO MARCA HUGO BOSS DE COLOR GRIS CLARO', '[\"M\",\"L\"]', 70000.00, 10, 6, 'https://jdstore.cu.ma/storage/productos/SOTiBHQU3V6g4aKvNs4NvfhRU56z1SAZcGYWewzX.avif', 'activo', '2026-05-26 09:25:23', '2026-05-26 09:25:23'),
(82, 'P0006', 'POLO RALPH LAUREN', 'POLO MARCA RALPH LAUREN DE COLOR VERDE', '[\"XL\",\"XXL\"]', 70000.00, 10, 6, 'https://jdstore.cu.ma/storage/productos/QjtFNEy2GNdUwJ4dJzQcR4thGyV8dRi7reFMy0kj.avif', 'activo', '2026-05-26 09:29:04', '2026-05-26 09:29:04'),
(83, 'P0007', 'POLO ARMANI EXCHANGE', 'POLO MARCA ARMANI EXCHANGE DE COLOR ROSADO', '[\"L\",\"XL\"]', 70000.00, 10, 6, 'https://jdstore.cu.ma/storage/productos/VF89bDmlaP4Q8Nuc1dpte9p2uthcGjcHeWTCskfI.avif', 'activo', '2026-05-26 09:31:15', '2026-05-26 09:31:15'),
(84, 'P0008', 'POLO ARMANI EXCHANGE', 'POLO MARCA ARMANI EXCHANGE DE COLOR NEGRO', '[\"L\",\"XL\"]', 70000.00, 10, 6, 'https://jdstore.cu.ma/storage/productos/0J9hS3zTWAcWLzqNnOuXpTXUoSq6eAXOexQR3oN8.avif', 'activo', '2026-05-26 09:36:38', '2026-05-26 09:36:38'),
(85, 'P0009', 'POLO PSYCHO BUNNY', 'POLO MARCA PSYCHO BUNNY DE COLOR NEGRO CON DETALLES EN CUELLO Y MANGAS DE COLOR BLANCO Y CREMA', '[\"M\",\"L\",\"XL\"]', 70000.00, 10, 6, 'https://jdstore.cu.ma/storage/productos/K36UDOhSmSGTkuVDBFjYpQBBaeSBpB4zgODTu9be.avif', 'activo', '2026-05-26 09:39:35', '2026-05-26 09:39:35'),
(86, 'P0010', 'POLO CALVIN KLEIN', 'POLO MARCA CALVIN KLEIN DE COLOR GRIS', '[\"L\",\"XL\"]', 70000.00, 10, 6, 'https://jdstore.cu.ma/storage/productos/eSxWPaEgTGoHZWzyBR4Tu6gDuk022LtKTRKo5tYC.avif', 'activo', '2026-05-26 09:40:42', '2026-05-26 09:40:42'),
(88, 'CS0021', 'CAMISETA HUGO BOSS', 'CAMISETA MARCA HUGO BOSS DE COLOR BEIGE', '[\"L\",\"XL\"]', 10000.00, 3, 2, 'https://jdstore.cu.ma/storage/productos/jrXObRbmjfNILz0kJ67WDR6LWAlTFQDcwJKONCIr.avif', 'activo', '2026-05-29 19:46:46', '2026-06-04 18:41:03');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `promociones`
--

CREATE TABLE `promociones` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `titulo` varchar(120) DEFAULT NULL,
  `tipo` enum('porcentaje','fijo') NOT NULL,
  `valor` decimal(10,2) NOT NULL,
  `producto_id` bigint(20) UNSIGNED DEFAULT NULL,
  `categoria_id` bigint(20) UNSIGNED DEFAULT NULL,
  `activo` tinyint(1) NOT NULL DEFAULT 1,
  `fecha_inicio` timestamp NULL DEFAULT NULL,
  `fecha_fin` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `recibos`
--

CREATE TABLE `recibos` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `pedido_id` bigint(20) UNSIGNED NOT NULL,
  `numero_recibo` varchar(255) NOT NULL,
  `fecha_hora` timestamp NOT NULL DEFAULT current_timestamp(),
  `caja_id` bigint(20) UNSIGNED DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `recibos`
--

INSERT INTO `recibos` (`id`, `pedido_id`, `numero_recibo`, `fecha_hora`, `caja_id`, `created_at`, `updated_at`) VALUES
(10, 10, 'JD-20260526-000010-FPLL', '2026-05-26 16:18:11', NULL, '2026-05-26 16:18:11', '2026-05-26 16:18:11'),
(11, 11, 'JD-20260526-000011-SREE', '2026-05-26 17:47:53', NULL, '2026-05-26 17:47:53', '2026-05-26 17:47:53'),
(12, 12, 'JD-20260527-000012-VBTX', '2026-05-28 03:18:40', NULL, '2026-05-28 03:18:40', '2026-05-28 03:18:40'),
(13, 13, 'JD-20260527-000013-R6GV', '2026-05-28 03:20:16', NULL, '2026-05-28 03:20:16', '2026-05-28 03:20:16'),
(14, 14, 'JD-20260529-000014-JSNT', '2026-05-29 19:43:45', NULL, '2026-05-29 19:43:45', '2026-05-29 19:43:45'),
(15, 15, 'JD-20260529-000015-HLT4', '2026-05-29 19:57:51', NULL, '2026-05-29 19:57:51', '2026-05-29 19:57:51'),
(16, 16, 'JD-20260603-000016-WPV9', '2026-06-03 17:13:23', NULL, '2026-06-03 17:13:23', '2026-06-03 17:13:23'),
(17, 17, 'JD-20260604-000017-5AUO', '2026-06-04 17:39:55', NULL, '2026-06-04 17:39:55', '2026-06-04 17:39:55'),
(18, 18, 'JD-20260604-000018-1LBA', '2026-06-04 17:44:22', NULL, '2026-06-04 17:44:22', '2026-06-04 17:44:22'),
(19, 19, 'JD-20260604-000019-E7OX', '2026-06-04 17:45:02', NULL, '2026-06-04 17:45:02', '2026-06-04 17:45:02'),
(20, 20, 'JD-20260604-000020-XK7T', '2026-06-04 17:46:56', NULL, '2026-06-04 17:46:56', '2026-06-04 17:46:56'),
(21, 21, 'JD-20260604-000021-UFQA', '2026-06-04 17:47:09', NULL, '2026-06-04 17:47:09', '2026-06-04 17:47:09'),
(22, 22, 'JD-20260604-000022-AZPL', '2026-06-04 17:47:13', NULL, '2026-06-04 17:47:13', '2026-06-04 17:47:13'),
(23, 23, 'JD-20260604-000023-YRYX', '2026-06-04 17:47:15', NULL, '2026-06-04 17:47:15', '2026-06-04 17:47:15'),
(24, 24, 'JD-20260604-000024-9J5D', '2026-06-04 17:47:16', NULL, '2026-06-04 17:47:16', '2026-06-04 17:47:16'),
(25, 25, 'JD-20260604-000025-TKEL', '2026-06-04 17:47:17', NULL, '2026-06-04 17:47:17', '2026-06-04 17:47:17'),
(26, 26, 'JD-20260604-000026-ST0V', '2026-06-04 18:38:30', NULL, '2026-06-04 18:38:30', '2026-06-04 18:38:30'),
(27, 27, 'JD-20260604-000027-Y8CS', '2026-06-04 18:39:06', NULL, '2026-06-04 18:39:06', '2026-06-04 18:39:06'),
(28, 28, 'JD-20260605-000028-XTMQ', '2026-06-05 15:37:46', NULL, '2026-06-05 15:37:46', '2026-06-05 15:37:46');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `resenas`
--

CREATE TABLE `resenas` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `producto_id` bigint(20) UNSIGNED NOT NULL,
  `cliente_id` bigint(20) UNSIGNED NOT NULL,
  `calificacion` tinyint(3) UNSIGNED NOT NULL,
  `comentario` text DEFAULT NULL,
  `estado` enum('pendiente','aprobada','rechazada') NOT NULL DEFAULT 'pendiente',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `sessions`
--

CREATE TABLE `sessions` (
  `id` varchar(255) NOT NULL,
  `user_id` bigint(20) UNSIGNED DEFAULT NULL,
  `ip_address` varchar(45) DEFAULT NULL,
  `user_agent` text DEFAULT NULL,
  `payload` longtext NOT NULL,
  `last_activity` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `sessions`
--

INSERT INTO `sessions` (`id`, `user_id`, `ip_address`, `user_agent`, `payload`, `last_activity`) VALUES
('04Gkxecaudz9uB6LbaV6nirsChophz6ovZcm62sD', NULL, '179.1.217.89', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiaUViemJjTEZUWG52Z0prQVRlR3kzSWpkTWhYS2xUNmltYklZYnNRSiI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6NDg6Imh0dHBzOi8vamRzdG9yZS5jdS5tYS9pbWFnZW5lcy92aWRlby1zdG9yZS0yLm1wNCI7czo1OiJyb3V0ZSI7Tjt9czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1780411974),
('cAKtD6fDNgZBSSFqo93NVSwpZ7B6nTl4ZMbhyJtF', NULL, '179.1.217.89', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiRk5Ud3RaQmdOeHdkaVFjRFpsS0dCUnZ0TmhDd1cwQTFpUk41NHAxMyI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6NTI6Imh0dHBzOi8vamRzdG9yZS5jdS5tYS9pbWFnZW5lcy9zdG9yZV9leHRlcmlvcl8zLmF2aWYiO3M6NToicm91dGUiO047fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', 1780411974),
('cHQXClOacAj1PrZmX8XI60ZrhJN8zGfnfZAUrdCd', NULL, '179.1.217.89', 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Mobile Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiQTIyRjVYVXRVeUFtU3ZJYnVycDJJS1hQRzZFZDI4Y2FpOXJXTjhmNSI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6NTI6Imh0dHBzOi8vamRzdG9yZS5jdS5tYS9pbWFnZW5lcy9zdG9yZV9leHRlcmlvcl8xLmF2aWYiO3M6NToicm91dGUiO047fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', 1780412056),
('dB0zHXLylcn0w3CSLjnziZTW68mR6XryDWgCbzCB', NULL, '179.1.217.88', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiVmEzOHgyenlhVzNLUWJhYnlvQ0gxMkw3ckRYb0pjZ254RjVmOThIcyI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6MzY6Imh0dHBzOi8vamRzdG9yZS5jdS5tYS9pbmljaWFyLXNlc2lvbiI7czo1OiJyb3V0ZSI7Tjt9czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1780572818),
('GR2FVdVxcxdTvvWQJdWAH2W0K7haHeDA4VVY5NFL', NULL, '179.1.217.89', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiYUFDYkRPaEZEalRlYmJ2amRNNm9BdWN2Q1NtN2xFZVViT1BXQUJociI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6NTI6Imh0dHBzOi8vamRzdG9yZS5jdS5tYS9pbWFnZW5lcy9zdG9yZV9leHRlcmlvcl8xLmF2aWYiO3M6NToicm91dGUiO047fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', 1780411974),
('HfTuewYe2PjZFvdCdIJh8YUo4R6fZVJdjDyqxVSL', NULL, '179.1.217.89', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoicmwxc0w3UmY2ZUhoT0hwTUs5WlhFYmFCaHdYSkhEaE0xZjBoOWlTUCI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6MzY6Imh0dHBzOi8vamRzdG9yZS5jdS5tYS9hZG1pbi9yZXBvcnRlcyI7czo1OiJyb3V0ZSI7Tjt9czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1780489634),
('ivspr4ebi7WtETTJh9y0Zf0ED4TonVkcoLbPVcxx', NULL, '179.1.217.89', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiZm5PQzltV0VWSjh6MXRJb0h6UmZhOG8yUGQyeHVMdTdIcFpXd0JjQiI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6NDg6Imh0dHBzOi8vamRzdG9yZS5jdS5tYS9pbWFnZW5lcy92aWRlby1zdG9yZS0xLm1wNCI7czo1OiJyb3V0ZSI7Tjt9czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1780411974),
('PFlUYCOhYvoPmZKl2LSLBvIwa5ChAQHLdm63DGgX', NULL, '179.1.217.89', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiVzhOdWhJcVBlT2cyMnFmZlVVb0VwRHRtWG9OamNHNEx4c1FqR240TSI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6OTE6Imh0dHBzOi8vamRzdG9yZS5jdS5tYS9jaGVja291dC9yZXN1bHRhZG8/ZW52PXRlc3QmaWQ9MTIxMDkyODQtMTc4MDY1OTUwNS03NTc1MCZwZWRpZG9faWQ9MjgiO3M6NToicm91dGUiO047fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', 1780659527),
('QmQ5KkZWoD4JOUH13fBzw01UlQJTJsgpya7c8TxW', NULL, '179.1.217.90', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiTlRuZFgwVW1TdlVHbkZKM0tmeUl2Y3V4V25TSzRxaFc2SHNFTGNNSSI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6MzE6Imh0dHBzOi8vamRzdG9yZS5jdS5tYS9yZWNpYm8vMTYiO3M6NToicm91dGUiO047fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', 1780492414),
('Riyx19f3cEzweZxB5DPUUhmGbNk2aklYxUeXqp80', NULL, '179.1.217.89', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoid0RCZEdhZGY0TjhyUllhSVFFbE9jdmRQYll6YVRSeXRWaWVFZzQ2biI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6NDA6Imh0dHBzOi8vamRzdG9yZS5jdS5tYS9pbWFnZW5lcy9sb2dvLmF2aWYiO3M6NToicm91dGUiO047fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', 1780411974),
('u5abXhRbosF8JedhRBMBeFzf9Os7NiFleadAii4M', NULL, '74.7.241.6', 'Mozilla/5.0 AppleWebKit/537.36 (KHTML, like Gecko; compatible; GPTBot/1.4; +https://openai.com/gptbot)', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiNHlyelI3T3B4OW12NHB1bk5EOHRLdTZGcWx4MHVTdUJXOHJuUkZQSSI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6NDc6Imh0dHBzOi8vamRzdG9yZS5jdS5tYS9hc3NldHMvJTYwK2MubC5UYXJnZXQrJTYwIjtzOjU6InJvdXRlIjtOO31zOjY6Il9mbGFzaCI7YToyOntzOjM6Im9sZCI7YTowOnt9czozOiJuZXciO2E6MDp7fX19', 1780532798),
('xfYBJr6pDtzzZ15T5XlHUeo4LuFvnH78FlPhoGAb', NULL, '179.1.217.88', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoidVAyQVZWSjRPTng0dXV2aVhWOW0yOUtwMzFWSHZKaHJLblZaV2ZoRyI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6OTE6Imh0dHBzOi8vamRzdG9yZS5jdS5tYS9jaGVja291dC9yZXN1bHRhZG8/ZW52PXRlc3QmaWQ9MTIxMDkyODQtMTc4MDU4NDAwMy0zMDY2OCZwZWRpZG9faWQ9MjciO3M6NToicm91dGUiO047fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', 1780584062),
('ztPVol2kwl3IcLNIbgSxT5dXXmi5uMo1aJlRmPM2', NULL, '179.1.217.89', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoicmhPNGFvTkRzZ00wSzlib1RadGtJN3pOYzlramVMUjBLY25KMmpyMCI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6NTI6Imh0dHBzOi8vamRzdG9yZS5jdS5tYS9pbWFnZW5lcy9zdG9yZV9leHRlcmlvcl80LmF2aWYiO3M6NToicm91dGUiO047fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', 1780412340);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `users`
--

CREATE TABLE `users` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `nombre_completo` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `email_verified_at` timestamp NULL DEFAULT NULL,
  `password` varchar(255) NOT NULL,
  `password_temporal` tinyint(1) NOT NULL DEFAULT 0,
  `password_temporal_creado_en` timestamp NULL DEFAULT NULL,
  `telefono` varchar(10) DEFAULT NULL,
  `direccion` varchar(255) DEFAULT NULL,
  `direcciones_guardadas` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`direcciones_guardadas`)),
  `rol` enum('admin','vendedor','cliente') NOT NULL DEFAULT 'cliente',
  `estado` enum('activo','inactivo') NOT NULL DEFAULT 'activo',
  `remember_token` varchar(100) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `users`
--

INSERT INTO `users` (`id`, `nombre_completo`, `email`, `email_verified_at`, `password`, `password_temporal`, `password_temporal_creado_en`, `telefono`, `direccion`, `direcciones_guardadas`, `rol`, `estado`, `remember_token`, `created_at`, `updated_at`) VALUES
(1, 'Angel Cardenas', 'cardenascortessantiago@gmail.com', NULL, '$2y$12$.kAuKLMG6DCJ/0h0BlDtPOc9g4HfrYZSf6ejirVjZ5ZymjQzoWAva', 0, NULL, '3103970638', '123', NULL, 'admin', 'activo', 'qAbAFbXgZjTL2hR2FU82rIvlZXG1u8Deut25aAW8Nyovc7nAMfpkZlpPSNjH', '2026-05-18 09:09:10', '2026-05-25 19:30:33'),
(2, 'Juan Rojas', 'juandapro2000@gmail.com', NULL, '$2y$12$vQlYo3e0PTJObwhk05f7rutRbJ0fqLGaEM7hY22h2W0vJj5zN/nGe', 0, NULL, '3124342344', 'Simón Bolivar', NULL, 'cliente', 'activo', 'W28S0xKE3I4vYIzLIxKvm69llTRMmFgEtvZrtOZT2sK4L7n3fwQqlUOPYzyw', '2026-05-19 04:45:43', '2026-06-04 15:39:26'),
(6, 'Angel Cortes', 'angelsantiagocardenascortes162@gmail.com', NULL, '$2y$12$hwN0bwFZJzQrPHxmnu3iMOw4wQvGps6RNLHCpDEcVDSZUDR86VRku', 0, NULL, '3103970638', 'Manzana D Casa 10 Piso 2 Arkaniza 1', NULL, 'cliente', 'activo', 'khEl7jn3OovpWB7ogB8dqoCeppcXCvBPg5I2yoJm8nE2NeJfGvE4M7seZLgs', '2026-05-19 09:03:38', '2026-05-19 09:07:25'),
(7, 'Angel Cortes', 'xantyagov@gmail.com', NULL, '$2y$12$dbyZv2cKiaoDlgTz7GqM8erBPbSqb70iIR/FX4U1fh.zPNhxlNeNO', 0, NULL, '1234567890', '12345', NULL, 'cliente', 'activo', NULL, '2026-05-19 13:10:22', '2026-05-19 13:10:43'),
(9, 'Marcela', 'marcelalopezdiaz6@gmail.com', NULL, '$2y$12$fIlIVq3GEVqysRqQd2J2GuSwgtvfBEIKs8jCOgI08c3lx3a2J0Et2', 0, NULL, '3228990071', NULL, NULL, 'cliente', 'activo', NULL, '2026-05-24 07:04:07', '2026-05-24 07:04:07'),
(10, 'Juan Admin', 'jdrojaspe@ut.edu.co', NULL, '$2y$12$Fm3xkuTYC8CckYD39r42B.agOidMerTtn4/G9y2aBA2d4ZCQxelii', 0, NULL, '3124342344', 'Carrera 2 sur calle 97B', NULL, 'admin', 'activo', NULL, '2026-05-25 19:56:28', '2026-05-25 19:56:28'),
(11, 'JUAM', 'juan@gmail.com', NULL, '$2y$12$DbDAiMwmLxz5NVV1lc..pez0dGvdGrrckniUpg6PYHh0EHzgLux6a', 0, NULL, '3124342344', 'Mz31 Cs13 Ciudadela', NULL, 'cliente', 'activo', NULL, '2026-05-25 20:23:43', '2026-05-25 20:23:43'),
(12, 'Sebastián', 'fcervera84@gmail.com', NULL, '$2y$12$Ev75ppZpbeFhqpRpX.y0nOLKYTqO3XUq6nIUX4TS2WeIJ15VS9Jvm', 0, NULL, '3143487688', 'Calle 1a q le importa', NULL, 'cliente', 'activo', NULL, '2026-05-26 14:32:25', '2026-05-26 14:32:25'),
(13, 'brian', 'briannrodriguez0103@gmail.com', NULL, '$2y$12$H.JlZC3UZ9xDusvBlvxM8unxMTtEPk2PpRIgS4I5MqLY.Bd.wZzAu', 1, '2026-05-26 19:56:35', '3173716667', 'mi casa en el galan', NULL, 'cliente', 'activo', NULL, '2026-05-26 19:56:22', '2026-05-26 19:56:35'),
(14, 'Santiago Almanza', 'almanzasantiago26@gmail.com', NULL, '$2y$12$r9i/bvWqV/Y66BiuX227CeO5VDO52c8GphjlC0D.beYIeXAvPM0KW', 0, NULL, '3151952885', 'Manzana 61 Casa 10 Ciudadela Simón Bolívar Etapa 3', NULL, 'cliente', 'activo', 'v3j9DyJsBfzF7ldf9W5f4PLXvm7UNOnODVepC8SJchcY9oHGVA2p00X4NDZw', '2026-05-28 03:26:28', '2026-05-28 03:28:15');

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `banners`
--
ALTER TABLE `banners`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `cache`
--
ALTER TABLE `cache`
  ADD PRIMARY KEY (`key`),
  ADD KEY `cache_expiration_index` (`expiration`);

--
-- Indices de la tabla `cache_locks`
--
ALTER TABLE `cache_locks`
  ADD PRIMARY KEY (`key`),
  ADD KEY `cache_locks_expiration_index` (`expiration`);

--
-- Indices de la tabla `caja`
--
ALTER TABLE `caja`
  ADD PRIMARY KEY (`id`),
  ADD KEY `caja_vendedor_id_foreign` (`vendedor_id`);

--
-- Indices de la tabla `categorias`
--
ALTER TABLE `categorias`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `categorias_nombre_unique` (`nombre`);

--
-- Indices de la tabla `cupones`
--
ALTER TABLE `cupones`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `cupones_codigo_unique` (`codigo`);

--
-- Indices de la tabla `destacados`
--
ALTER TABLE `destacados`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `destacados_producto_id_unique` (`producto_id`);

--
-- Indices de la tabla `detalle_pedidos`
--
ALTER TABLE `detalle_pedidos`
  ADD PRIMARY KEY (`id`),
  ADD KEY `detalle_pedidos_pedido_id_foreign` (`pedido_id`),
  ADD KEY `detalle_pedidos_producto_id_foreign` (`producto_id`);

--
-- Indices de la tabla `devoluciones`
--
ALTER TABLE `devoluciones`
  ADD PRIMARY KEY (`id`),
  ADD KEY `devoluciones_pedido_id_foreign` (`pedido_id`),
  ADD KEY `devoluciones_producto_id_foreign` (`producto_id`);

--
-- Indices de la tabla `failed_jobs`
--
ALTER TABLE `failed_jobs`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `failed_jobs_uuid_unique` (`uuid`);

--
-- Indices de la tabla `jobs`
--
ALTER TABLE `jobs`
  ADD PRIMARY KEY (`id`),
  ADD KEY `jobs_queue_index` (`queue`);

--
-- Indices de la tabla `job_batches`
--
ALTER TABLE `job_batches`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `logs_actividad`
--
ALTER TABLE `logs_actividad`
  ADD PRIMARY KEY (`id`),
  ADD KEY `logs_actividad_usuario_id_foreign` (`usuario_id`);

--
-- Indices de la tabla `mensajes`
--
ALTER TABLE `mensajes`
  ADD PRIMARY KEY (`id`),
  ADD KEY `mensajes_cliente_id_index` (`cliente_id`),
  ADD KEY `mensajes_respondido_por_index` (`respondido_por`);

--
-- Indices de la tabla `migrations`
--
ALTER TABLE `migrations`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `notificaciones`
--
ALTER TABLE `notificaciones`
  ADD PRIMARY KEY (`id`),
  ADD KEY `notificaciones_usuario_id_index` (`usuario_id`);

--
-- Indices de la tabla `password_reset_tokens`
--
ALTER TABLE `password_reset_tokens`
  ADD PRIMARY KEY (`email`);

--
-- Indices de la tabla `pedidos`
--
ALTER TABLE `pedidos`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `pedidos_referencia_pago_unique` (`referencia_pago`),
  ADD KEY `pedidos_cliente_id_foreign` (`cliente_id`);

--
-- Indices de la tabla `personal_access_tokens`
--
ALTER TABLE `personal_access_tokens`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `personal_access_tokens_token_unique` (`token`),
  ADD KEY `personal_access_tokens_tokenable_type_tokenable_id_index` (`tokenable_type`,`tokenable_id`),
  ADD KEY `personal_access_tokens_expires_at_index` (`expires_at`);

--
-- Indices de la tabla `productos`
--
ALTER TABLE `productos`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `productos_sku_unique` (`sku`),
  ADD KEY `productos_categoria_id_foreign` (`categoria_id`);

--
-- Indices de la tabla `promociones`
--
ALTER TABLE `promociones`
  ADD PRIMARY KEY (`id`),
  ADD KEY `promociones_producto_id_index` (`producto_id`),
  ADD KEY `promociones_categoria_id_index` (`categoria_id`);

--
-- Indices de la tabla `recibos`
--
ALTER TABLE `recibos`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `recibos_numero_recibo_unique` (`numero_recibo`),
  ADD KEY `recibos_pedido_id_foreign` (`pedido_id`),
  ADD KEY `recibos_caja_id_index` (`caja_id`);

--
-- Indices de la tabla `resenas`
--
ALTER TABLE `resenas`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `resenas_producto_cliente_unique` (`producto_id`,`cliente_id`),
  ADD KEY `resenas_cliente_id_index` (`cliente_id`);

--
-- Indices de la tabla `sessions`
--
ALTER TABLE `sessions`
  ADD PRIMARY KEY (`id`),
  ADD KEY `sessions_user_id_index` (`user_id`),
  ADD KEY `sessions_last_activity_index` (`last_activity`);

--
-- Indices de la tabla `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `users_email_unique` (`email`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `banners`
--
ALTER TABLE `banners`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `caja`
--
ALTER TABLE `caja`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `categorias`
--
ALTER TABLE `categorias`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT de la tabla `cupones`
--
ALTER TABLE `cupones`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `destacados`
--
ALTER TABLE `destacados`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `detalle_pedidos`
--
ALTER TABLE `detalle_pedidos`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=29;

--
-- AUTO_INCREMENT de la tabla `devoluciones`
--
ALTER TABLE `devoluciones`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `failed_jobs`
--
ALTER TABLE `failed_jobs`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `jobs`
--
ALTER TABLE `jobs`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `logs_actividad`
--
ALTER TABLE `logs_actividad`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `mensajes`
--
ALTER TABLE `mensajes`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT de la tabla `migrations`
--
ALTER TABLE `migrations`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=16;

--
-- AUTO_INCREMENT de la tabla `notificaciones`
--
ALTER TABLE `notificaciones`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `pedidos`
--
ALTER TABLE `pedidos`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=29;

--
-- AUTO_INCREMENT de la tabla `personal_access_tokens`
--
ALTER TABLE `personal_access_tokens`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=215;

--
-- AUTO_INCREMENT de la tabla `productos`
--
ALTER TABLE `productos`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=89;

--
-- AUTO_INCREMENT de la tabla `promociones`
--
ALTER TABLE `promociones`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `recibos`
--
ALTER TABLE `recibos`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=29;

--
-- AUTO_INCREMENT de la tabla `resenas`
--
ALTER TABLE `resenas`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `users`
--
ALTER TABLE `users`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=15;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `caja`
--
ALTER TABLE `caja`
  ADD CONSTRAINT `caja_vendedor_id_foreign` FOREIGN KEY (`vendedor_id`) REFERENCES `users` (`id`);

--
-- Filtros para la tabla `destacados`
--
ALTER TABLE `destacados`
  ADD CONSTRAINT `destacados_producto_id_foreign` FOREIGN KEY (`producto_id`) REFERENCES `productos` (`id`) ON DELETE CASCADE;

--
-- Filtros para la tabla `detalle_pedidos`
--
ALTER TABLE `detalle_pedidos`
  ADD CONSTRAINT `detalle_pedidos_pedido_id_foreign` FOREIGN KEY (`pedido_id`) REFERENCES `pedidos` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `detalle_pedidos_producto_id_foreign` FOREIGN KEY (`producto_id`) REFERENCES `productos` (`id`);

--
-- Filtros para la tabla `devoluciones`
--
ALTER TABLE `devoluciones`
  ADD CONSTRAINT `devoluciones_pedido_id_foreign` FOREIGN KEY (`pedido_id`) REFERENCES `pedidos` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `devoluciones_producto_id_foreign` FOREIGN KEY (`producto_id`) REFERENCES `productos` (`id`);

--
-- Filtros para la tabla `logs_actividad`
--
ALTER TABLE `logs_actividad`
  ADD CONSTRAINT `logs_actividad_usuario_id_foreign` FOREIGN KEY (`usuario_id`) REFERENCES `users` (`id`);

--
-- Filtros para la tabla `notificaciones`
--
ALTER TABLE `notificaciones`
  ADD CONSTRAINT `notificaciones_usuario_id_foreign` FOREIGN KEY (`usuario_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Filtros para la tabla `pedidos`
--
ALTER TABLE `pedidos`
  ADD CONSTRAINT `pedidos_cliente_id_foreign` FOREIGN KEY (`cliente_id`) REFERENCES `users` (`id`);

--
-- Filtros para la tabla `productos`
--
ALTER TABLE `productos`
  ADD CONSTRAINT `productos_categoria_id_foreign` FOREIGN KEY (`categoria_id`) REFERENCES `categorias` (`id`);

--
-- Filtros para la tabla `promociones`
--
ALTER TABLE `promociones`
  ADD CONSTRAINT `promociones_categoria_id_foreign` FOREIGN KEY (`categoria_id`) REFERENCES `categorias` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `promociones_producto_id_foreign` FOREIGN KEY (`producto_id`) REFERENCES `productos` (`id`) ON DELETE SET NULL;

--
-- Filtros para la tabla `recibos`
--
ALTER TABLE `recibos`
  ADD CONSTRAINT `recibos_pedido_id_foreign` FOREIGN KEY (`pedido_id`) REFERENCES `pedidos` (`id`) ON DELETE CASCADE;

--
-- Filtros para la tabla `resenas`
--
ALTER TABLE `resenas`
  ADD CONSTRAINT `resenas_cliente_id_foreign` FOREIGN KEY (`cliente_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `resenas_producto_id_foreign` FOREIGN KEY (`producto_id`) REFERENCES `productos` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
