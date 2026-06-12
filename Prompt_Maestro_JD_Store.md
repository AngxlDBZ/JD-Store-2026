# 🛍️ PROMPT MAESTRO — DESARROLLO WEB E-COMMERCE JD STORE
> **Este prompt está diseñado para ser ejecutado en [Trae](https://trae.ai), editor de código con IA integrada.**
> Trae debe leer este documento completo antes de escribir una sola línea de código y seguir cada instrucción al pie de la letra.

---

## 🎯 CONTEXTO GENERAL

Desarrolla un sistema de información web completo para **JD Store**, una tienda de ropa urbana masculina ubicada en Ibagué, Tolima, Colombia. El proyecto es tanto un **e-commerce funcional** (para que los clientes compren en línea) como un **sistema de gestión comercial** (para que el administrador y vendedores operen el negocio). El stack tecnológico principal es **Laravel 12 (API REST) + React 18 (frontend) + Tailwind CSS v3 + MySQL**, ejecutado en entorno local con **Laragon**.

### 📌 Instrucciones directas para Trae

1. **Carpeta del proyecto:** Toda la implementación va dentro de `C:/laragon/www/JD Store LR/` que ya existe y está vacía. Crear dentro de ella las dos subcarpetas del sistema:
   - `C:/laragon/www/JD Store LR/jdstore-backend/` → proyecto Laravel 12
   - `C:/laragon/www/JD Store LR/jdstore-frontend/` → proyecto React + Vite
2. **No crear ningún archivo fuera de esa ruta.**
3. **Leer este documento completo** antes de generar cualquier archivo.
4. **Implementar el proyecto en orden:** base de datos → backend → frontend.
5. **Al finalizar el desarrollo completo**, crear obligatoriamente el archivo `C:/laragon/www/JD Store LR/LEEME.md` con las instrucciones de encendido del proyecto (ver sección al final de este documento).

---

## 🏪 INFORMACIÓN DE LA TIENDA

| Campo | Detalle |
|---|---|
| **Nombre** | JD Store |
| **Descripción** | Tienda de moda urbana masculina |
| **Slogan** | *"En JD Store vestimos tu actitud, acompañamos tu flow y llevamos tu estilo a otro nivel."* |
| **Quiénes somos** | En JD Store somos más que una tienda de ropa, somos un espacio donde el estilo urbano cobra vida. Nos encontramos en el Centro Comercial La 14 en Ibagué, Tolima, ofreciendo a nuestros clientes lo mejor de la moda urbana, combinando comodidad, tendencia y autenticidad. Nuestro objetivo es que cada persona que nos visite encuentre prendas que reflejen su esencia y su manera de vivir la calle, con un look fresco, moderno y lleno de personalidad. |
| **Dirección** | Centro Comercial La 14, Local 128, Piso 1, Ibagué, Tolima |
| **Correo** | mora59974@gmail.com |
| **Teléfono / WhatsApp** | +57 318 326 0720 |
| **Instagram** | @jd.store_12 |
| **TikTok** | @jd.store.120 |
| **Moneda** | COP (Pesos Colombianos) |

---

## 🎨 IDENTIDAD VISUAL Y DISEÑO

- **Paleta de colores:** Tonos oscuros como base (negros y grises oscuros), blanco para contraste y dorado como color de acento/detalle.
- **Estética:** Urbana, moderna, premium. Inspirada en streetwear de alto nivel. Oscura y elegante, nunca genérica.
- **Tipografía:** Elegir fuentes que reflejen identidad urbana y moderna. Evitar Arial, Inter, Roboto o fuentes genéricas.
- **Diseño responsive:** Adaptado a escritorio, tablet y móvil (mobile-first).
- **Animaciones:** Micro-interacciones en hover, transiciones suaves en navegación, efectos de aparición en carga de página.
- **Compatibilidad de navegadores:** Chrome, Firefox, Edge y Safari.

---

## 🛠️ STACK TECNOLÓGICO

| Capa | Tecnología |
|---|---|
| **Backend** | Laravel 12 (PHP) — API REST pura, sin Blade |
| **Frontend** | React 18 con Vite |
| **Estilos** | Tailwind CSS v3 |
| **Base de Datos** | MySQL 8.0+ |
| **Entorno local** | Laragon (Apache + PHP + MySQL integrados) |
| **Gestor de paquetes JS** | npm (Node.js v18+) |
| **Gestor de paquetes PHP** | Composer |
| **Autenticación** | Laravel Sanctum (tokens SPA) |
| **Control de versiones** | Git (GitHub o GitLab) |
| **Servidor producción** | AWS, Google Cloud o Azure |
| **SSL** | Certificado HTTPS para producción |
| **Herramientas de prueba** | Postman, Chrome DevTools, React DevTools |

> ⚠️ **El backend (Laravel) y el frontend (React) son proyectos separados.** Laravel expone una API REST en `http://jdstore.test/api` (dominio local de Laragon) y React la consume desde su propio servidor de desarrollo Vite (`http://localhost:5173`). En producción, React se compila y sirve como archivos estáticos.

---

## 👥 TIPOS DE USUARIOS Y ROLES

| Rol | Descripción | Acceso |
|---|---|---|
| **Administrador** | Propietario/encargado con control total | Panel admin completo: productos, pedidos, mensajes, reportes, usuarios |
| **Vendedor / Empleado** | Personal del local | Registro de ventas, consulta de inventario, cierre de caja |
| **Cliente registrado** | Compradores con cuenta activa | Catálogo, carrito, checkout, historial de pedidos, perfil |
| **Cliente no registrado** | Visitantes sin cuenta | Solo navegación del catálogo |

---

## 📄 PÁGINAS / VISTAS DEL SISTEMA (14 vistas mínimo)

### Vistas públicas
1. **Inicio (index)** — Presentación de la tienda, banners, productos destacados, secciones de categorías.
2. **Catálogo general** — Listado de todos los productos con buscador, filtros por categoría y precio.
3. **Vistas por categoría** — Una vista por cada categoría:
   - Camisas
   - Camisetas
   - Sacos
   - Jeans
   - Pantalonetas
   - Polos
   - Chaquetas
4. **Detalle de producto** — Imagen, nombre, descripción, precio en COP, tallas disponibles, stock, botón "Agregar al carrito".
5. **Carrito de compras** — Listado de artículos, cantidades editables, subtotal, total en COP, botón de checkout.
6. **Checkout** — Resumen del pedido, datos de envío y confirmación.
7. **Registro (signup)** — Formulario con: nombre completo, correo, contraseña (mín. 8 caracteres), teléfono (10 dígitos), dirección de envío.
8. **Inicio de sesión (login)** — Correo + contraseña, opción "Recordarme".
9. **¿Quiénes somos?** — Texto corporativo, ubicación, misión.
10. **Contáctanos** — Formulario de mensajes (nombre, correo, mensaje), información de contacto, redes sociales, mapa de ubicación.

### Vistas privadas (cliente autenticado)
11. **Perfil del cliente** — Datos personales, historial de compras.

### Vistas de administrador
12. **Panel Admin — Dashboard** — Resumen: ingresos totales, pedidos pendientes, productos activos, alertas de bajo stock.
13. **Panel Admin — Gestión de Productos** — CRUD completo de productos.
14. **Panel Admin — Gestión de Pedidos** — Listado, detalle y actualización de estado de pedidos.
15. **Panel Admin — Mensajes de Clientes** — Recepción y respuesta de consultas del formulario de contacto.
16. **Panel Admin — Reportes** — Ventas por período, stock, rendimiento.

---

## 🧩 MÓDULOS Y FUNCIONALIDADES DETALLADAS

### 1. Módulo de Autenticación
- Registro con validación: nombre, correo único, contraseña mínima 8 caracteres, teléfono 10 dígitos, dirección.
- Inicio de sesión: correo + contraseña, opción "Recordarme".
- Recuperación de contraseña por correo.
- Cierre de sesión desde el menú del usuario.
- Control de acceso por rol (Admin / Vendedor / Cliente) con middleware de Laravel.
- Contraseñas almacenadas cifradas (bcrypt); nunca en texto plano.

### 2. Módulo de Gestión de Productos (Admin)
- Crear producto con: SKU, nombre, descripción, categoría, precio en COP, stock, imagen (JPG/PNG hasta 10 MB).
- Editar y actualizar datos del producto.
- Activar / desactivar producto (eliminación lógica — campo `estado`: activo/inactivo).
- Eliminar permanentemente con confirmación.
- Listado con columnas: nombre, SKU, precio, stock y estado.

### 3. Módulo de Inventario
- Consulta de stock en tiempo real.
- Alertas automáticas cuando el stock alcanza el umbral crítico (configurable).
- Registro de devoluciones con reingreso al inventario.
- Consulta de stock histórico.

### 4. Módulo de Ventas
- Registro transaccional de ventas con desglose de productos, cantidades y precios.
- Generación automática de recibos de venta.
- Registro del método de pago.
- Anulación de ventas con autorización del administrador.
- Cierre de caja diario con resumen de transacciones.

### 5. Módulo de Gestión de Clientes (Admin)
- Listado de clientes registrados con datos: nombre, teléfono, correo, dirección.
- Historial de compras por cliente.
- Aplicación de descuentos personalizados por cliente.
- Datos fiscales para facturación.

### 6. Módulo de Reportes (Admin)
- Reportes de ventas filtrados por período.
- Reportes de stock e inventario.
- Reportes de rendimiento por vendedor.
- Exportación de reportes (PDF o Excel).
- Dashboard con: ingresos totales, pedidos pendientes, productos activos.

### 7. Gestión de Pedidos (Admin)
- Listado de pedidos ordenado por más reciente.
- Detalle del pedido: datos del cliente, productos, cantidades, total.
- Actualización de estado: `Pendiente → En preparación → Enviado → Completado / Cancelado`.

### 8. Mensajes de Clientes (Admin)
- Recepción de consultas enviadas desde la página Contáctanos.
- Respuesta al cliente abriendo el cliente de correo predeterminado (mailto).
- Eliminación de mensajes atendidos.

---

## 🗃️ BASE DE DATOS — ENTIDADES PRINCIPALES

| Entidad | Atributos principales |
|---|---|
| **users** | id, nombre, email, password, teléfono, dirección, rol (admin/vendedor/cliente), estado, timestamps |
| **productos** | id, sku, nombre, descripción, precio, stock, categoría, imagen_url, estado (activo/inactivo), timestamps |
| **categorías** | id, nombre (Camisas, Camisetas, Sacos, Jeans, Pantalonetas, Polos, Chaquetas) |
| **pedidos** | id, id_cliente, total, método_pago, estado (pendiente/completado/cancelado), fecha, timestamps |
| **detalle_pedidos** | id, id_pedido, id_producto, cantidad, precio_unitario |
| **recibos** | id, id_pedido, número_recibo, fecha_hora, id_caja |
| **caja** | id, id_vendedor, id_local, fecha_apertura, fecha_cierre, total_ventas |
| **devoluciones** | id, id_pedido, id_producto, cantidad, motivo, fecha |
| **mensajes** | id, nombre_remitente, correo_remitente, mensaje, leído, fecha |
| **logs_actividad** | id, id_usuario, acción, descripción, ip, timestamps |

**Reglas de integridad:**
- Claves primarias (PK) en todas las entidades.
- Claves foráneas (FK) para integridad referencial.
- Eliminación lógica (campo `estado`) en lugar de DELETE físico.
- Backups automáticos semanales.

---

## ✅ REQUISITOS FUNCIONALES PRIORITARIOS (30 RF)

| ID | Requisito | Prioridad |
|---|---|---|
| RF-01 | Registro de productos (CRUD completo) | Alta |
| RF-02 | Gestión de ventas transaccional | Alta |
| RF-03 | Registro de clientes | Media |
| RF-04 | Registro de vendedores | Media |
| RF-05 | Generación de reportes estadísticos y financieros | Alta |
| RF-06 | Consulta de inventario en tiempo real | Alta |
| RF-07 | Interfaz responsive (escritorio, tablet, móvil) | Alta |
| RF-08 | Validación de entradas en formularios | Alta |
| RF-09 | Exportación de reportes (PDF/Excel) | Baja |
| RF-10 | Inicio de sesión seguro con roles | Alta |
| RF-11 | Recuperación de contraseña | Media |
| RF-12 | Registro de logs de actividad | Media |
| RF-13 | Alertas automáticas de bajo inventario | Alta |
| RF-14 | Historial de compras por cliente | Media |
| RF-15 | Actualización de datos de productos | Alta |
| RF-16 | Eliminación lógica de registros | Media |
| RF-17 | Asociación de productos por categorías | Media |
| RF-18 | Búsqueda avanzada (nombre, SKU, categoría) | Media |
| RF-19 | Reportes de rendimiento por vendedor | Media |
| RF-20 | Configuración de parámetros del sistema | Media |
| RF-21 | Registro de devoluciones | Media |
| RF-22 | Aplicación de descuentos por cliente | Media |
| RF-23 | Registro de métodos de pago | Alta |
| RF-24 | Anulación de ventas con autorización admin | Alta |
| RF-25 | Asignación de roles (Admin / Vendedor / Cliente) | Alta |
| RF-26 | Consulta de stock histórico | Baja |
| RF-27 | Cierre de caja diario | Alta |
| RF-28 | Generación automática de recibos de venta | Alta |
| RF-29 | Consulta de productos por SKU | Alta |
| RF-30 | Registro de datos fiscales del cliente en factura | Alta |

---

## 🔒 REQUISITOS DE SEGURIDAD

| Medida | Descripción |
|---|---|
| HTTPS / SSL | Cifrado de comunicación en producción |
| Cifrado de contraseñas | Bcrypt — nunca texto plano |
| Middleware de roles | Laravel Middleware por rol (admin/vendedor/cliente) |
| Validación de formularios | Frontend + backend (Laravel Validator) |
| Eliminación lógica | Registros marcados como inactivos para trazabilidad |
| Logs de actividad | Auditoría de acciones por usuario |
| Tokens de sesión | Laravel Sanctum o sesiones seguras |

---

## ⚙️ REQUISITOS NO FUNCIONALES

| Atributo | Descripción |
|---|---|
| **Disponibilidad** | Sistema disponible 24/7 |
| **Tiempo de respuesta** | Consultas e inserciones < 2 segundos |
| **Escalabilidad** | Arquitectura preparada para crecimiento |
| **Compatibilidad** | Chrome, Firefox, Edge, Safari |
| **Responsividad** | Escritorio, tablet y móvil |
| **Fiabilidad** | Comportamiento consistente en todas las operaciones |
| **Exactitud** | Cálculos correctos en ventas, descuentos e inventario |
| **Backup** | Respaldo semanal de base de datos |
| **Amigabilidad** | Interfaz intuitiva alineada con identidad de marca |

---

## 🏗️ ARQUITECTURA DEL PROYECTO

El sistema se divide en **dos proyectos independientes** dentro de la carpeta de Laragon (`C:/laragon/www/JD Store LR/`):

```
C:/laragon/www/JD Store LR/
├── jdstore-backend/        ← Proyecto Laravel 12 (API REST)
└── jdstore-frontend/       ← Proyecto React 18 + Vite + Tailwind
```

---

### 📁 ESTRUCTURA DEL BACKEND — Laravel 12 (`jdstore-backend/`)

```
jdstore-backend/
├── app/
│   ├── Http/
│   │   ├── Controllers/
│   │   │   ├── Api/
│   │   │   │   ├── AutenticacionControlador.php
│   │   │   │   ├── ProductoControlador.php
│   │   │   │   ├── CategoriaControlador.php
│   │   │   │   ├── PedidoControlador.php
│   │   │   │   ├── DetallePedidoControlador.php
│   │   │   │   ├── ClienteControlador.php
│   │   │   │   ├── MensajeControlador.php
│   │   │   │   ├── ReporteControlador.php
│   │   │   │   ├── InventarioControlador.php
│   │   │   │   ├── CajaControlador.php
│   │   │   │   └── DevolucionControlador.php
│   │   ├── Middleware/
│   │   │   ├── VerificarRolAdmin.php
│   │   │   ├── VerificarRolVendedor.php
│   │   │   └── VerificarRolCliente.php
│   │   └── Requests/
│   │       ├── GuardarProductoRequest.php
│   │       ├── RegistrarUsuarioRequest.php
│   │       ├── IniciarSesionRequest.php
│   │       └── GuardarPedidoRequest.php
│   ├── Models/
│   │   ├── Usuario.php
│   │   ├── Producto.php
│   │   ├── Categoria.php
│   │   ├── Pedido.php
│   │   ├── DetallePedido.php
│   │   ├── Recibo.php
│   │   ├── Caja.php
│   │   ├── Devolucion.php
│   │   ├── Mensaje.php
│   │   └── LogActividad.php
│   └── Services/
│       ├── ProductoServicio.php
│       ├── PedidoServicio.php
│       ├── InventarioServicio.php
│       └── ReporteServicio.php
├── database/
│   ├── migrations/
│   │   ├── crear_tabla_usuarios.php
│   │   ├── crear_tabla_categorias.php
│   │   ├── crear_tabla_productos.php
│   │   ├── crear_tabla_pedidos.php
│   │   ├── crear_tabla_detalle_pedidos.php
│   │   ├── crear_tabla_recibos.php
│   │   ├── crear_tabla_caja.php
│   │   ├── crear_tabla_devoluciones.php
│   │   ├── crear_tabla_mensajes.php
│   │   └── crear_tabla_logs_actividad.php
│   └── seeders/
│       ├── DatabaseSeeder.php
│       ├── CategoriaSeeder.php
│       └── UsuarioAdminSeeder.php
├── routes/
│   ├── api.php             ← Todas las rutas de la API REST
│   └── web.php             ← Solo para rutas no-API si se necesitan
├── storage/
│   └── app/
│       └── publico/        ← Imágenes de productos subidas
└── .env                    ← Variables de entorno (DB, Laragon, Sanctum)
```

---

### 📁 ESTRUCTURA DEL FRONTEND — React + Vite (`jdstore-frontend/`)

```
jdstore-frontend/
├── public/
│   └── imagenes/           ← Imágenes estáticas (logo, banners, íconos)
├── src/
│   ├── componentes/        ← Componentes reutilizables
│   │   ├── comunes/
│   │   │   ├── Encabezado.jsx
│   │   │   ├── PieDePagina.jsx
│   │   │   ├── TarjetaProducto.jsx
│   │   │   ├── BotonPrimario.jsx
│   │   │   ├── CargadorSpinner.jsx
│   │   │   ├── MensajeError.jsx
│   │   │   └── ModalConfirmacion.jsx
│   │   ├── catalogo/
│   │   │   ├── FiltroCatalogo.jsx
│   │   │   ├── BuscadorProductos.jsx
│   │   │   └── ListaProductos.jsx
│   │   ├── carrito/
│   │   │   ├── IconoCarrito.jsx
│   │   │   ├── ItemCarrito.jsx
│   │   │   └── ResumenCarrito.jsx
│   │   └── admin/
│   │       ├── BarraLateral.jsx
│   │       ├── TarjetaEstadistica.jsx
│   │       ├── TablaProductos.jsx
│   │       ├── TablaPedidos.jsx
│   │       └── FormularioProducto.jsx
│   ├── paginas/            ← Vistas completas (una por ruta)
│   │   ├── publicas/
│   │   │   ├── Inicio.jsx
│   │   │   ├── Catalogo.jsx
│   │   │   ├── DetalleProducto.jsx
│   │   │   ├── QuienesSomos.jsx
│   │   │   └── Contacto.jsx
│   │   ├── autenticacion/
│   │   │   ├── IniciarSesion.jsx
│   │   │   └── Registro.jsx
│   │   ├── cliente/
│   │   │   ├── Carrito.jsx
│   │   │   ├── Checkout.jsx
│   │   │   └── Perfil.jsx
│   │   └── admin/
│   │       ├── PanelAdmin.jsx
│   │       ├── GestionProductos.jsx
│   │       ├── GestionPedidos.jsx
│   │       ├── GestionMensajes.jsx
│   │       └── Reportes.jsx
│   ├── contextos/          ← React Context API para estado global
│   │   ├── ContextoAutenticacion.jsx
│   │   └── ContextoCarrito.jsx
│   ├── hooks/              ← Custom hooks reutilizables
│   │   ├── usarAutenticacion.js
│   │   ├── usarCarrito.js
│   │   ├── usarProductos.js
│   │   └── usarPedidos.js
│   ├── servicios/          ← Llamadas a la API de Laravel
│   │   ├── clienteHttp.js      ← Instancia de Axios configurada
│   │   ├── autenticacionServicio.js
│   │   ├── productoServicio.js
│   │   ├── pedidoServicio.js
│   │   ├── mensajeServicio.js
│   │   └── reporteServicio.js
│   ├── rutas/
│   │   ├── RutasPublicas.jsx
│   │   ├── RutasCliente.jsx
│   │   ├── RutasAdmin.jsx
│   │   └── RutaProtegida.jsx   ← HOC para rutas con autenticación
│   ├── utilidades/         ← Funciones puras reutilizables
│   │   ├── formatearMoneda.js  ← Formato COP: $ 1.200.000
│   │   ├── validarFormulario.js
│   │   └── manejarErrores.js
│   ├── constantes/
│   │   ├── rutas.js            ← Rutas de la app centralizadas
│   │   └── configuracion.js    ← URL base de la API, etc.
│   ├── estilos/
│   │   └── global.css          ← Imports de Tailwind + variables CSS custom
│   ├── App.jsx
│   └── main.jsx
├── tailwind.config.js      ← Paleta personalizada (negro, gris, blanco, dorado)
├── vite.config.js
├── .env                    ← VITE_API_URL=http://jdstore.test/api
└── package.json
```

---

## ✅ BUENAS PRÁCTICAS OBLIGATORIAS

### 🗂️ Nomenclatura — TODO en español
- **Carpetas:** minúsculas con guiones si aplica → `paginas/`, `componentes/`, `servicios/`, `utilidades/`
- **Archivos React:** PascalCase en español → `TarjetaProducto.jsx`, `GestionPedidos.jsx`
- **Archivos JS/utilidades:** camelCase en español → `formatearMoneda.js`, `usarCarrito.js`
- **Variables y funciones:** camelCase en español → `const precioTotal`, `function calcularDescuento()`
- **Props de componentes:** camelCase en español → `nombreProducto`, `precioUnitario`, `estaActivo`
- **Modelos Laravel:** PascalCase en español → `Producto.php`, `DetallePedido.php`
- **Controladores:** PascalCase + sufijo `Controlador` → `ProductoControlador.php`
- **Migraciones:** snake_case descriptivo → `crear_tabla_productos`, `agregar_campo_sku_productos`
- **Rutas API:** kebab-case en español → `/api/productos`, `/api/detalle-pedidos`
- **Columnas de BD:** snake_case en español → `nombre_completo`, `precio_unitario`, `fecha_creacion`

### 🚫 Código basura — Prohibiciones estrictas
- ❌ No dejar archivos `.blade.php` en el proyecto (no se usa Blade)
- ❌ No crear componentes que solo renderizen otro componente sin lógica adicional
- ❌ No duplicar lógica: si una función se usa en 2+ lugares, va a `/utilidades/`
- ❌ No hardcodear URLs de la API: siempre desde `/constantes/configuracion.js`
- ❌ No mezclar lógica de negocio dentro de los componentes visuales; usar hooks o servicios
- ❌ No dejar `console.log()` en código que va a producción
- ❌ No crear migraciones sin nombre descriptivo (nunca `migration_1`, `test_table`, etc.)
- ❌ No crear controladores "Dios" con más de 7 métodos; dividir en controladores específicos
- ❌ No repetir clases de Tailwind largas: extraerlas como componentes o usar `@apply` en `global.css`
- ❌ No crear seeders con datos de prueba que queden activos en producción (usar `--class` y entornos)

### ✅ Prácticas recomendadas
- ✅ Un componente React = un archivo. Máximo ~150 líneas por archivo; si crece, dividir.
- ✅ Toda llamada a la API va en `/servicios/`, nunca dentro de un componente directamente.
- ✅ Toda lógica de estado global va en `/contextos/`; el estado local va en el componente que lo usa.
- ✅ Usar `FormRequest` de Laravel para validar datos en el backend (nunca validar solo en frontend).
- ✅ Usar `Service` classes en Laravel para lógica de negocio compleja; los controladores solo coordinan.
- ✅ Los `seeders` solo cargan datos esenciales del sistema (categorías, admin por defecto); no datos ficticios masivos.
- ✅ Usar variables de entorno (`.env`) para todo valor configurable: URL de API, credenciales, puertos.
- ✅ Tailwind: definir la paleta de marca en `tailwind.config.js` con nombres semánticos (`dorado`, `oscuro`, `claro`) y usarlos en lugar de valores arbitrarios.
- ✅ React Router: todas las rutas definidas en `/rutas/`, nunca inline en `App.jsx`.
- ✅ Axios: configurar la instancia base en `clienteHttp.js` (baseURL, headers, interceptores) y exportarla; nunca usar `fetch` directo ni instanciar Axios en cada servicio.

---

## 🛒 CATEGORÍAS DE PRODUCTOS

Únicamente ropa de **hombre**, en las siguientes 7 categorías:
1. Camisas
2. Camisetas
3. Sacos
4. Jeans
5. Pantalonetas
6. Polos
7. Chaquetas

---

## 📦 HEADER Y FOOTER

**Header:** Logo JD Store, menú de navegación (Inicio, Catálogo, Categorías, ¿Quiénes somos?, Contacto), icono de carrito con contador de artículos, botón de Login/Registro o menú de usuario si está autenticado.

**Footer:** Logo, slogan, información de contacto (correo, teléfono/WhatsApp), dirección, redes sociales (Instagram: @jd.store_12, TikTok: @jd.store.120), categorías de productos, copyright JD Store.

---

## 💻 CONFIGURACIÓN EN LARAGON

Laragon sirve como entorno de desarrollo local. La carpeta raíz del proyecto es `C:/laragon/www/JD Store LR/` (ya creada).

### Backend (Laravel)
1. Crear el proyecto Laravel en `C:/laragon/www/JD Store LR/jdstore-backend/`.
2. Laragon detecta automáticamente la subcarpeta y crea el dominio virtual. Dado que la carpeta padre tiene espacios, configurar manualmente el dominio en el panel de Laragon → **Pretty URLs** → apuntar al dominio `http://jdstore.test` con raíz `C:/laragon/www/JD Store LR/jdstore-backend/public`.
3. El archivo `.env` del backend debe quedar así:
   ```env
   APP_NAME=JDStore
   APP_ENV=local
   APP_DEBUG=true
   APP_URL=http://jdstore.test

   DB_CONNECTION=mysql
   DB_HOST=127.0.0.1
   DB_PORT=3306
   DB_DATABASE=jdstore_db
   DB_USERNAME=root
   DB_PASSWORD=

   SANCTUM_STATEFUL_DOMAINS=localhost:5173
   SESSION_DOMAIN=localhost
   FRONTEND_URL=http://localhost:5173
   ```
4. Crear la base de datos `jdstore_db` desde **HeidiSQL** (incluido en Laragon): abrir HeidiSQL → conectar con usuario `root` sin contraseña → crear base de datos `jdstore_db` con cotejamiento `utf8mb4_unicode_ci`.
5. Desde la terminal apuntando a `C:/laragon/www/JD Store LR/jdstore-backend/`:
   ```bash
   composer install
   php artisan key:generate
   php artisan migrate --seed
   php artisan storage:link
   ```

### Frontend (React + Vite)
1. Crear el proyecto React en `C:/laragon/www/JD Store LR/jdstore-frontend/`.
2. El archivo `.env` del frontend debe quedar así:
   ```env
   VITE_API_URL=http://jdstore.test/api
   ```
3. Desde la terminal apuntando a `C:/laragon/www/JD Store LR/jdstore-frontend/`:
   ```bash
   npm install
   npm run dev
   ```
4. El frontend corre en `http://localhost:5173` y consume la API de Laragon en `http://jdstore.test`.

### CORS en Laravel
En `config/cors.php` del backend configurar:
```php
'allowed_origins' => ['http://localhost:5173'],
'allowed_methods' => ['*'],
'allowed_headers' => ['*'],
'supports_credentials' => true,
```

---

## 📋 NOTAS ADICIONALES PARA EL DESARROLLADOR

1. Los pagos en la versión actual se registran manualmente; la integración con pasarelas de pago (PSE, tarjeta) está proyectada para versiones futuras.
2. Las imágenes de productos deben aceptar JPG/PNG con tamaño máximo de 10 MB. Se almacenan en `storage/app/publico/productos/` y se acceden por URL pública via `php artisan storage:link`.
3. Todos los precios se muestran en COP con la función `formatearMoneda.js` → ejemplo: `$ 1.200.000`.
4. El teléfono del cliente debe validarse como número de 10 dígitos (tanto en React como en `FormRequest` de Laravel).
5. La contraseña mínima es de 8 caracteres (validado en frontend y backend).
6. Los productos eliminados deben marcarse como inactivos (columna `estado`), nunca `DELETE` físico.
7. El carrito puede usarse sin iniciar sesión (estado en `ContextoCarrito` + localStorage); el checkout requiere autenticación.
8. El panel de administrador debe ser visualmente completamente diferente al frontend del cliente (paleta, layout, tipografía).
9. Usar seeders de Laravel para cargar las 7 categorías y el usuario administrador por defecto.
10. La búsqueda en el catálogo debe filtrar por nombre, categoría y SKU desde la API (`/api/productos?buscar=jeans`).
11. Tailwind CSS: definir en `tailwind.config.js` los colores personalizados de la marca:
    ```js
    colors: {
      oscuro: '#111111',
      grisOscuro: '#1f1f1f',
      grisMedio: '#3a3a3a',
      claro: '#ffffff',
      dorado: '#c9a84c',
      doradoClaro: '#e8c97e',
    }
    ```
12. React Router v6: usar rutas anidadas para el panel de administrador y proteger todas las rutas privadas con `RutaProtegida.jsx`.
13. Nunca instalar librerías sin justificación. Librerías permitidas: `axios`, `react-router-dom`, `react-hot-toast` (notificaciones), `recharts` (gráficas del panel admin), `react-icons` (íconos).

---

## 📄 ARCHIVO LEEME.md — OBLIGATORIO AL FINALIZAR

> ⚠️ **Trae debe crear este archivo automáticamente al terminar todo el desarrollo.**
> Ruta exacta: `C:/laragon/www/JD Store LR/LEEME.md`

El contenido del `LEEME.md` debe seguir esta estructura:

```markdown
# JD Store — Guía de inicio del proyecto

## ¿Qué se construyó?
[Trae describe aquí en detalle todo lo que implementó: módulos, páginas,
funcionalidades, modelos, rutas API creadas, seeders, etc.]

## Estructura de carpetas
C:/laragon/www/JD Store LR/
├── jdstore-backend/     → API REST en Laravel 12
└── jdstore-frontend/    → Frontend en React 18 + Vite + Tailwind CSS

## Requisitos previos
- Laragon instalado y corriendo (Apache + MySQL activos)
- Node.js v18 o superior
- Composer instalado
- Base de datos `jdstore_db` creada en HeidiSQL

## ▶️ Cómo encender el proyecto

### Paso 1 — Iniciar Laragon
1. Abrir Laragon.
2. Hacer clic en "Iniciar todo" (Start All).
3. Verificar que Apache y MySQL estén en verde.

### Paso 2 — Encender el Backend (Laravel)
1. Abrir una terminal en: `C:/laragon/www/JD Store LR/jdstore-backend/`
2. Ejecutar:
   ```bash
   php artisan serve --host=jdstore.test --port=80
   ```
   > O simplemente acceder a `http://jdstore.test` directamente si Laragon ya
   > gestiona el dominio virtual automáticamente.
3. Verificar que la API responde en: `http://jdstore.test/api/productos`

### Paso 3 — Encender el Frontend (React)
1. Abrir una segunda terminal en: `C:/laragon/www/JD Store LR/jdstore-frontend/`
2. Ejecutar:
   ```bash
   npm run dev
   ```
3. Abrir el navegador en: `http://localhost:5173`

## 🔑 Credenciales del administrador por defecto
- **Correo:** admin@jdstore.com
- **Contraseña:** Admin1234*
> Cambiar estas credenciales después del primer inicio de sesión.

## 🗃️ Base de datos
- **Nombre:** jdstore_db
- **Usuario:** root
- **Contraseña:** (vacía por defecto en Laragon)
- **Puerto:** 3306
- Para administrar la BD: abrir HeidiSQL desde el panel de Laragon.

## 🔄 Comandos útiles

| Acción | Comando |
|---|---|
| Resetear y re-sembrar la BD | `php artisan migrate:fresh --seed` |
| Limpiar caché de Laravel | `php artisan cache:clear && php artisan config:clear` |
| Ver rutas de la API | `php artisan route:list` |
| Compilar frontend para producción | `npm run build` |

## ⚠️ Solución de problemas comunes
- **Error CORS:** Verificar que Laragon esté corriendo y que `SANCTUM_STATEFUL_DOMAINS=localhost:5173` esté en el `.env` del backend.
- **Error 404 en rutas de React:** Las rutas del frontend las maneja React Router; no configurar rutas en Apache para ellas.
- **Imágenes no cargan:** Ejecutar `php artisan storage:link` desde la carpeta del backend.
```