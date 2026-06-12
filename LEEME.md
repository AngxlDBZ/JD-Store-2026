# JD Store - Analisis general y guia real del proyecto

## Resumen del proyecto

Este proyecto esta dividido en **3 carpetas principales** y cada una cumple un papel distinto:

- `jdstore-backend/`
  - Es el backend local del proyecto.
  - Esta hecho en **Laravel 12**.
  - Expone una **API REST** para autenticacion, catalogo, pedidos, mensajes, reportes, inventario, caja y usuarios.

- `jdstore-frontend/`
  - Es el frontend local del proyecto.
  - Esta hecho en **React 18 + Vite + Tailwind CSS**.
  - Consume la API del backend y renderiza toda la tienda, el carrito, la cuenta del cliente y el panel administrativo.

- `jdstore.cu.ma/`
  - Es la copia preparada para produccion y subida a **GoogieHost**.
  - Contiene el backend Laravel y el frontend ya compilado dentro de `public_html/`.
  - La URL publica del proyecto es: `https://jdstore.cu.ma`

## Como se relacionan las 3 carpetas

- `jdstore-backend/` + `jdstore-frontend/` son la version de desarrollo local.
- `jdstore.cu.ma/` es la version desplegada.
- En la carpeta desplegada, el frontend ya no vive como codigo React editable sino como archivos compilados en `public_html/`.
- Eso significa que:
  - para **desarrollar**, editar y probar cambios, debes trabajar sobre `jdstore-backend/` y `jdstore-frontend/`
  - para **publicar**, el frontend debe compilarse y su resultado terminar dentro de `public_html/` del hosting

## Stack tecnico

- Backend: Laravel 12, Sanctum, Eloquent, MySQL
- Frontend: React 18, React Router, Axios, React Hot Toast, Recharts, Vite
- Estilos: Tailwind CSS, tema oscuro con acentos dorados
- Autenticacion: token Bearer almacenado en `localStorage`
- Persistencia en cliente:
  - carrito en `localStorage`
  - favoritos en `localStorage`
  - sesion basada en token

## Lo que tiene la pagina

La pagina no es solo una landing. Es una tienda completa con parte publica, parte cliente y parte administrativa.

### 1. Parte publica

- **Inicio**
  - Hero principal de la marca JD Store.
  - Botones a catalogo y a quienes somos.
  - Bloque de informacion de la tienda fisica.
  - Seccion de productos destacados.
  - Seccion de productos nuevos.
  - Fotos del local.

- **Catalogo**
  - Listado paginado de productos.
  - Busqueda por nombre, categoria, SKU o texto relacionado.
  - Filtro por categoria.
  - Carga productos activos.
  - Cuando no hay filtros, muestra mezcla aleatoria para variar la vitrina.

- **Categoria**
  - Vista filtrada por `slug` de categoria.
  - Reutiliza el flujo de catalogo pero segmentado.

- **Detalle de producto**
  - Imagen del producto.
  - Nombre, SKU, descripcion y precio.
  - Stock disponible.
  - Seleccion de tallas cuando aplica.
  - Boton para agregar al carrito.
  - Manejo de producto sin stock.

- **Carrito**
  - Lista de productos agregados.
  - Cantidades.
  - Talla seleccionada cuando existe.
  - Subtotal y total.
  - Persistencia local en el navegador.

- **Quienes somos**
  - Presentacion de la marca.
  - Enfoque de moda urbana masculina.
  - Datos de contacto y redes.

- **Contacto**
  - Formulario para enviar mensajes.
  - Mapa incrustado.
  - Datos del local.

- **Autenticacion**
  - Registro de clientes.
  - Inicio de sesion.
  - Recuperacion de contrasena por correo.

### 2. Parte del cliente autenticado

- **Checkout**
  - Requiere inicio de sesion.
  - Valida direccion de envio.
  - Permite metodo de pago en efectivo o tarjeta.
  - Hace validaciones basicas del numero de tarjeta, vencimiento y CVV en frontend.
  - Crea el pedido en la API.

- **Perfil**
  - Ver datos del usuario.
  - Editar perfil.
  - Cambiar contrasena.
  - Ver historial de pedidos.
  - Ver mensajes asociados a su cuenta.
  - Marcar mensajes como leidos.
  - Ver favoritos recientes.

- **Recibo**
  - Pantalla estilo comprobante.
  - Permite imprimir o guardar PDF del pedido.
  - Muestra direccion, forma de pago, detalle de productos y total.

- **Favoritos**
  - Se guardan por usuario en `localStorage`.
  - Se pueden usar como lista rapida de productos preferidos.

### 3. Parte administrativa

- **Dashboard**
  - Ingresos totales.
  - Pedidos pendientes.
  - Productos activos.
  - Alertas de bajo stock.
  - Grafica de ventas por dia.

- **Gestion de productos**
  - Crear producto.
  - Editar producto.
  - Subir imagen.
  - Eliminar logicamente cambiando estado a `inactivo`.
  - Eliminar permanentemente.

- **Gestion de pedidos**
  - Listado de pedidos.
  - Filtros por busqueda, estado y fechas.
  - Cambio de estado del pedido.

- **Gestion de usuarios**
  - Lista de usuarios registrados.
  - Busqueda por nombre, correo o telefono.
  - Visualizacion de rol y estado.

- **Gestion de mensajes**
  - Bandeja de mensajes de contacto.
  - Marcar como leido.
  - Responder desde el panel.
  - Eliminar mensajes.

- **Reportes**
  - Ventas por periodo.
  - Reporte diario por fecha.
  - Generacion para impresion / PDF desde el navegador.

## Funcionalidades del backend

El backend local tiene una API bastante completa. Entre lo implementado:

- **Autenticacion**
  - registro
  - login
  - logout
  - endpoint `auth/yo`
  - cambio de contrasena
  - actualizacion de perfil
  - recuperacion de contrasena con envio de correo

- **Roles**
  - `admin`
  - `vendedor`
  - `cliente`
  - middleware:
    - `rol.admin`
    - `rol.vendedor`
    - `rol.cliente`

- **Categorias**
  - listado publico

- **Productos**
  - listado publico con filtros
  - detalle por producto
  - CRUD para admin
  - manejo de imagenes
  - stock
  - estado activo/inactivo

- **Pedidos**
  - creacion de pedidos por cliente
  - historial del cliente
  - vista detallada del pedido
  - cambio de estado por admin
  - descuento de stock al comprar
  - generacion de recibo al crear el pedido

- **Mensajes**
  - mensaje publico desde contacto
  - mensajes del cliente autenticado
  - respuesta administrativa

- **Inventario**
  - consulta por SKU
  - listado de bajo stock

- **Caja y devoluciones**
  - abrir caja
  - cerrar caja
  - listar cajas
  - registrar devoluciones
  - reintegrar stock cuando se hace devolucion

- **Clientes y usuarios**
  - listado de clientes
  - detalle de cliente
  - listado general de usuarios

### Modelos principales

- `Usuario`
- `Categoria`
- `Producto`
- `Pedido`
- `DetallePedido`
- `Recibo`
- `Caja`
- `Devolucion`
- `Mensaje`
- `LogActividad`

### Seeders y datos base

- Seeder de categorias con:
  - Camisas
  - Camisetas
  - Sacos
  - Jeans
  - Pantalon
  - Pantalonetas
  - Polos
  - Chaquetas
- Seeder de administrador por defecto

## Estructura recomendada del proyecto

```text
C:\laragon\www\JD Store LR\
├── jdstore-backend\        -> API Laravel local
├── jdstore-frontend\       -> Frontend React local
├── jdstore.cu.ma\          -> Copia de despliegue para hosting
├── jdstore_db.sql          -> Respaldo o export de base de datos
└── LEEME.md                -> Este documento
```

## Estado real del proyecto local

Despues de revisar archivos, configuraciones y ejecutar comprobaciones tecnicas, este es el estado real:

### Backend local

- **Si puede correr en local**, pero depende de que Laragon tenga encendidos:
  - Apache
  - MySQL
- La configuracion del backend apunta a:
  - base de datos `jdstore_db`
  - host `127.0.0.1`
  - puerto `3306`
- La API carga correctamente a nivel de codigo y tiene rutas registradas.
- En la validacion hecha, `artisan route:list --path=api` funciono.
- En la validacion hecha, `artisan migrate:status` **fallo** porque MySQL no estaba aceptando conexiones en `127.0.0.1:3306`.

Conclusion del backend local:

- **Si enciende**, pero solo cuando MySQL de Laragon este arriba y la base `jdstore_db` exista.
- Si MySQL esta apagado, el backend no podra operar aunque el codigo este bien.

### Frontend local

- **El frontend si puede usarse en local**, pero actualmente necesita un ajuste de configuracion para desarrollo con Vite.
- Hoy el archivo `.env` del frontend tiene:

```env
VITE_API_URL=/api
```

- Ese valor sirve bien cuando el frontend ya esta compilado y se sirve desde el mismo dominio del backend, como en produccion.
- Pero para levantar React con `npm run dev` en `http://localhost:5173`, lo correcto es apuntarlo al backend local, por ejemplo:

```env
VITE_API_URL=http://jdstore.test/api
```

Conclusion del frontend local:

- **No esta listo para `npm run dev` tal como esta ahora** si se ejecuta por separado en `localhost:5173`.
- **Si quedaria listo** al cambiar `VITE_API_URL` a la URL real del backend local y tener instaladas las dependencias con `npm install`.

## Respuesta corta: las carpetas en local si encienden?

- `jdstore-backend/`: **si**, siempre que MySQL este iniciado y exista la base `jdstore_db`
- `jdstore-frontend/`: **si**, pero hay que ajustar `VITE_API_URL` para desarrollo local con Vite
- `jdstore.cu.ma/`: **ya es la carpeta de despliegue**, no es la opcion principal para desarrollar, sino para publicar en hosting

## Requisitos para levantar el proyecto local

- Laragon instalado
- Apache encendido
- MySQL encendido
- PHP de Laragon disponible
- Composer
- Node.js
- Base de datos `jdstore_db`

## Como encender el backend local

1. Iniciar Laragon y verificar Apache y MySQL en verde.
2. Confirmar que exista la base `jdstore_db`.
3. Entrar en `C:\laragon\www\JD Store LR\jdstore-backend\`
4. Verificar `.env` del backend:

```env
APP_URL=http://jdstore.test
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=jdstore_db
DB_USERNAME=root
DB_PASSWORD=
FRONTEND_URL=http://localhost:5173
SANCTUM_STATEFUL_DOMAINS=localhost:5173
```

5. Ejecutar:

```bash
composer install
php artisan migrate --seed
php artisan storage:link
php artisan serve
```

6. O usar Laragon apuntando el virtual host a:
   - dominio: `jdstore.test`
   - raiz: `C:\laragon\www\JD Store LR\jdstore-backend\public`

7. Probar:
   - `http://jdstore.test/api/estado`
   - `http://jdstore.test/api/productos`

## Como encender el frontend local

1. Entrar en `C:\laragon\www\JD Store LR\jdstore-frontend\`
2. Ajustar `.env` a:

```env
VITE_API_URL=http://jdstore.test/api
```

3. Ejecutar:

```bash
npm install
npm run dev
```

4. Abrir:
   - `http://localhost:5173`

## Como funciona en produccion

En produccion el flujo cambia:

- el frontend React se compila con `npm run build`
- el resultado compilado se publica en `jdstore.cu.ma/public_html/`
- el backend Laravel queda en la carpeta `jdstore.cu.ma/`
- el dominio publico apunta a `https://jdstore.cu.ma`

En este escenario, `VITE_API_URL=/api` tiene sentido porque frontend y backend quedan bajo el mismo origen.

## Credenciales del admin por defecto

- Correo: `admin@jdstore.com`
- Contrasena: `Admin1234*`

Se recomienda cambiar estas credenciales despues del primer acceso.

## Comandos utiles

| Accion | Comando |
|---|---|
| Ver rutas API | `php artisan route:list --path=api` |
| Migrar y sembrar | `php artisan migrate --seed` |
| Reset total de BD | `php artisan migrate:fresh --seed` |
| Crear enlace de storage | `php artisan storage:link` |
| Instalar dependencias frontend | `npm install` |
| Levantar frontend | `npm run dev` |
| Compilar frontend | `npm run build` |

## Observaciones importantes

- El backend local esta bien estructurado y las rutas existen.
- La causa principal por la que el backend no termina de responder en local suele ser que **MySQL no este encendido**.
- La causa principal por la que el frontend no funcionaria con `npm run dev` tal como esta ahora es que **`VITE_API_URL` esta configurado para produccion**.
- La carpeta `jdstore.cu.ma/` representa la publicacion, no el entorno ideal para programar.
- Hay configuracion SMTP en el `.env` del backend; conviene revisar y proteger esas credenciales antes de mover el proyecto o compartirlo.

