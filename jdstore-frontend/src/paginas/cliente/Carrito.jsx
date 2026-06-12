import { Link } from 'react-router-dom'
import { rutas } from '../../constantes/rutas'
import { usarCarrito } from '../../hooks/usarCarrito'
import { formatearMoneda } from '../../utilidades/formatearMoneda'
import { resolverUrlImagen } from '../../utilidades/resolverUrlImagen'

export function Carrito() {
  const { items, subtotal, cantidadTotal, actualizarCantidad, eliminarProducto, obtenerStockDisponible } = usarCarrito()

  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <div className="text-dorado text-xs tracking-widest">CARRITO</div>
      <h1 className="mt-2 font-urbana text-4xl tracking-wide">Tus artículos</h1>

      {items.length === 0 ? (
        <div className="mt-10 rounded-3xl border border-grisOscuro bg-grisOscuro/40 p-8 text-claro/70">
          Tu carrito está vacío. <Link to={rutas.catalogo} className="text-doradoClaro hover:text-dorado">Explorar catálogo</Link>
        </div>
      ) : (
        <div className="mt-10 grid gap-6 lg:grid-cols-[1fr_360px]">
          <div className="grid gap-4">
            {items.map((item) => (
              (() => {
                const imagenProducto = resolverUrlImagen(item.producto.imagen_url)
                const claveItem = `${item.producto.id}-${item.variante_id || item.talla || 'sin-variante'}`
                const stockDisponible = obtenerStockDisponible(item.producto, item.variante_id || null, item.talla)
                const precioOriginal = Number(item.producto.precio_original || item.producto.precio || 0)
                const precioFinal = Number(item.producto.precio_final || item.producto.precio || 0)
                const descuento = Number(item.producto.descuento_promocion || 0)

                return (
              <div
                key={claveItem}
                className="rounded-3xl border border-grisOscuro bg-grisOscuro/40 p-5 flex gap-4"
              >
                <div className="h-24 w-24 rounded-2xl overflow-hidden bg-oscuro/40 border border-grisOscuro shrink-0">
                  {imagenProducto ? (
                    <img src={imagenProducto} alt={item.producto.nombre} className="h-full w-full object-cover" />
                  ) : null}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-claro">{item.producto.nombre}</div>
                  <div className="mt-1 flex flex-wrap items-baseline gap-2">
                    <div className="text-sm font-semibold text-dorado">{formatearMoneda(precioFinal)}</div>
                    {descuento > 0 ? <div className="text-xs text-claro/50 line-through">{formatearMoneda(precioOriginal)}</div> : null}
                  </div>
                  {item.talla ? (
                    <div className="mt-2 text-xs text-claro/60">
                      Talla: <span className="text-claro/80 font-semibold">{item.talla}</span>
                    </div>
                  ) : null}
                  <div className="mt-1 text-xs text-claro/50">
                    Stock disponible: <span className="font-semibold text-claro/70">{stockDisponible}</span>
                  </div>
                  <div className="mt-4 flex items-center gap-3">
                    <input
                      type="number"
                      min={1}
                      max={Math.max(1, stockDisponible)}
                      value={item.cantidad}
                      onChange={(e) =>
                        actualizarCantidad(item.producto.id, item.variante_id || null, item.talla, Number(e.target.value))
                      }
                      className="w-20 rounded-xl border border-grisOscuro bg-oscuro/40 px-3 py-2 text-sm text-claro focus:outline-none focus:border-dorado/50"
                    />
                    <button
                      type="button"
                      onClick={() => eliminarProducto(item.producto.id, item.variante_id || null, item.talla)}
                      className="text-sm text-claro/60 hover:text-doradoClaro"
                    >
                      Quitar
                    </button>
                  </div>
                </div>
                <div className="text-right text-sm text-claro/70">
                  <div>Total</div>
                  <div className="mt-1 text-dorado font-semibold">
                    {formatearMoneda(precioFinal * item.cantidad)}
                  </div>
                </div>
              </div>
                )
              })()
            ))}
          </div>

          <div className="rounded-3xl border border-grisOscuro bg-oscuro/40 p-6 h-fit">
            <div className="text-sm text-dorado font-semibold">Resumen</div>
            <div className="mt-4 flex justify-between text-sm text-claro/70">
              <span>Artículos</span>
              <span className="text-claro/90 font-semibold">{cantidadTotal}</span>
            </div>
            <div className="mt-2 flex justify-between text-sm text-claro/70">
              <span>Subtotal</span>
              <span className="text-claro/90 font-semibold">{formatearMoneda(subtotal)}</span>
            </div>
            <div className="mt-6">
              <Link
                to={rutas.checkout}
                className="block text-center rounded-xl bg-dorado px-5 py-3 text-oscuro font-semibold hover:bg-doradoClaro transition"
              >
                Ir a checkout
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

