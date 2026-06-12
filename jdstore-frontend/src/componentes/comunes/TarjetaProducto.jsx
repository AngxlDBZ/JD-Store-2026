import { memo } from 'react'
import { Link } from 'react-router-dom'
import { rutas } from '../../constantes/rutas'
import { formatearMoneda } from '../../utilidades/formatearMoneda'
import { resolverUrlImagen } from '../../utilidades/resolverUrlImagen'
import { usarFavoritos } from '../../hooks/usarFavoritos'

function TarjetaProductoBase({ producto, compacta = false, prioridadImagen = false }) {
  const { alternarFavorito, esFavorito } = usarFavoritos()
  const favorito = esFavorito(producto.id)
  const imagenProducto = resolverUrlImagen(producto.imagen_url)
  const precioOriginal = Number(producto.precio_original || producto.precio || 0)
  const precioFinal = Number(producto.precio_final || producto.precio || 0)
  const descuento = Number(producto.descuento_promocion || 0)

  return (
    <article className="group motion-soft-pop overflow-hidden rounded-[24px] border border-grisOscuro bg-grisOscuro/35 transition duration-200 hover:-translate-y-1 hover:border-dorado/25 [content-visibility:auto]">
      <div className={`relative bg-[#0b0b0b] ${compacta ? 'aspect-[4/4.2]' : 'aspect-[4/5]'}`}>
        <Link to={rutas.producto(producto.id)} className="block h-full w-full">
          {imagenProducto ? (
            <img
              src={imagenProducto}
              alt={producto.nombre}
              className="h-full w-full object-cover opacity-95 transition duration-300 group-hover:scale-[1.03] group-hover:opacity-100"
              loading={prioridadImagen ? 'eager' : 'lazy'}
              fetchPriority={prioridadImagen ? 'high' : 'auto'}
              decoding="async"
            />
          ) : (
            <div className="grid h-full w-full place-items-center text-grisMedio">
              <span className="text-sm">Sin imagen</span>
            </div>
          )}
        </Link>

        {descuento > 0 ? (
          <div
            className={`absolute left-3 top-3 rounded-full border border-emerald-500/30 bg-emerald-500/10 font-semibold text-emerald-200 ${
              compacta ? 'px-2 py-1 text-[10px]' : 'px-3 py-2 text-xs'
            }`}
          >
            Promo
          </div>
        ) : null}

        <button
          type="button"
          onClick={() => alternarFavorito(producto)}
          aria-label={favorito ? 'Quitar de favoritos' : 'Agregar a favoritos'}
          className={`absolute rounded-full border font-semibold shadow-lg backdrop-blur transition ${
            compacta ? 'right-2 top-2 px-2 py-1 text-[10px]' : 'right-3 top-3 px-3 py-2 text-xs'
          } ${
            favorito
              ? 'border-dorado/50 bg-dorado text-oscuro'
              : 'border-grisOscuro bg-oscuro/70 text-claro/80 hover:border-dorado/40 hover:text-doradoClaro'
          }`}
        >
          {favorito ? 'Favorito' : 'Guardar'}
        </button>
      </div>

      <Link to={rutas.producto(producto.id)} className={`block ${compacta ? 'p-2.5' : 'p-4'}`}>
        <div className="text-xs text-claro/50">{producto.sku}</div>
        <div className={`mt-1 font-semibold text-claro transition group-hover:text-doradoClaro ${compacta ? 'text-[13px] leading-tight' : ''}`}>
          {producto.nombre}
        </div>
        <div className={`mt-2 flex flex-wrap items-baseline gap-2 ${compacta ? 'mt-1' : ''}`}>
          <div className={`font-semibold text-dorado ${compacta ? 'text-[13px]' : ''}`}>{formatearMoneda(precioFinal)}</div>
          {descuento > 0 ? (
            <div className="text-xs text-claro/50 line-through">{formatearMoneda(precioOriginal)}</div>
          ) : null}
        </div>
        <div className={`text-xs text-claro/60 ${compacta ? 'mt-1.5' : 'mt-2'}`}>
          Stock: <span className="text-claro/80">{producto.stock}</span>
        </div>
      </Link>
    </article>
  )
}

export const TarjetaProducto = memo(TarjetaProductoBase)
