import { useEffect, useRef, useState } from 'react'
import { useParams } from 'react-router-dom'
import toast from 'react-hot-toast'
import { obtenerProducto } from '../../servicios/productoServicio'
import { crearResena, listarResenasProducto } from '../../servicios/resenaServicio'
import { CargadorSpinner } from '../../componentes/comunes/CargadorSpinner'
import { GuiaTallas } from '../../componentes/comunes/GuiaTallas'
import { MensajeError } from '../../componentes/comunes/MensajeError'
import { formatearMoneda } from '../../utilidades/formatearMoneda'
import { resolverUrlImagen } from '../../utilidades/resolverUrlImagen'
import { usarCarrito } from '../../hooks/usarCarrito'
import { usarAutenticacion } from '../../hooks/usarAutenticacion'

export function DetalleProducto() {
  const { id } = useParams()
  const { agregarProducto } = usarCarrito()
  const { estaAutenticado } = usarAutenticacion()

  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState(null)
  const [producto, setProducto] = useState(null)
  const [varianteSeleccionadaId, setVarianteSeleccionadaId] = useState(null)
  const [cargandoResenas, setCargandoResenas] = useState(true)
  const [resenas, setResenas] = useState([])
  const [resumenResenas, setResumenResenas] = useState({ promedio: 0, total: 0 })
  const [paginaResenas, setPaginaResenas] = useState(1)
  const [hayMasResenas, setHayMasResenas] = useState(false)
  const [formResena, setFormResena] = useState({ calificacion: 5, comentario: '' })
  const [enviandoResena, setEnviandoResena] = useState(false)
  const [activarResenas, setActivarResenas] = useState(false)
  const seccionResenasRef = useRef(null)

  useEffect(() => {
    const objetivo = seccionResenasRef.current
    if (!objetivo || activarResenas || typeof IntersectionObserver === 'undefined') {
      return undefined
    }

    const observador = new IntersectionObserver(
      (entradas) => {
        if (entradas.some((entrada) => entrada.isIntersecting)) {
          setActivarResenas(true)
          observador.disconnect()
        }
      },
      { rootMargin: '260px 0px' }
    )

    observador.observe(objetivo)

    return () => observador.disconnect()
  }, [activarResenas])

  useEffect(() => {
    let activo = true
    async function cargar() {
      setVarianteSeleccionadaId(null)
      setActivarResenas(false)
      setPaginaResenas(1)
      setCargando(true)
      setError(null)
      try {
        const datos = await obtenerProducto(id)
        if (activo) {
          setProducto(datos.producto)

          const variantesActivas = Array.isArray(datos.producto?.variantes)
            ? datos.producto.variantes.filter((variante) => variante.estado !== 'inactivo')
            : []

          if (variantesActivas.length === 1) {
            setVarianteSeleccionadaId(variantesActivas[0].id)
          }
        }
      } catch (e) {
        if (activo) setError(e)
      } finally {
        if (activo) setCargando(false)
      }
    }
    cargar()
    return () => {
      activo = false
    }
  }, [id])

  useEffect(() => {
    let activo = true

    if (!activarResenas) {
      setCargandoResenas(false)
      return () => {
        activo = false
      }
    }

    async function cargarResenas() {
      setCargandoResenas(true)
      try {
        const datos = await listarResenasProducto(id, { page: paginaResenas })
        const paginacion = datos.resenas
        const items = paginacion?.data || []

        if (!activo) return

        setResumenResenas(datos.resumen || { promedio: 0, total: 0 })
        setHayMasResenas(Boolean(paginacion?.next_page_url))

        if (paginaResenas === 1) {
          setResenas(items)
        } else {
          setResenas((actual) => [...actual, ...items])
        }
      } catch {
        if (activo && paginaResenas === 1) {
          setResenas([])
          setResumenResenas({ promedio: 0, total: 0 })
        }
      } finally {
        if (activo) setCargandoResenas(false)
      }
    }

    cargarResenas()

    return () => {
      activo = false
    }
  }, [activarResenas, id, paginaResenas])

  const promedioResenas = Number(resumenResenas?.promedio || 0)
  const textoPromedio = promedioResenas ? `${promedioResenas.toFixed(1)} / 5` : 'Sin reseñas'

  if (cargando) {
    return (
      <div className="section-shell grid gap-10 py-10 md:grid-cols-[minmax(280px,430px)_minmax(0,1fr)] md:items-start">
        <div className="surface-panel skeleton-shimmer overflow-hidden">
          <div className="aspect-[4/5] bg-white/[0.05]" />
        </div>
        <div className="space-y-4">
          <div className="h-3 w-20 rounded-full bg-white/[0.06]" />
          <div className="h-10 w-3/4 rounded-full bg-white/[0.08]" />
          <div className="h-6 w-40 rounded-full bg-dorado/15" />
          <div className="surface-panel skeleton-shimmer h-24" />
          <div className="surface-panel skeleton-shimmer h-28" />
          <div className="h-12 w-full rounded-2xl bg-dorado/15" />
        </div>
      </div>
    )
  }
  if (error || !producto) {
    return (
      <div className="section-shell py-10">
        <MensajeError detalle="No se pudo cargar el producto." />
      </div>
    )
  }

  const variantes = Array.isArray(producto.variantes)
    ? producto.variantes.filter((variante) => variante.estado !== 'inactivo')
    : []
  const varianteSeleccionada = variantes.find((variante) => Number(variante.id) === Number(varianteSeleccionadaId)) || null
  const requiereTalla = variantes.length > 0
  const sinStock = Number(producto.stock) <= 0
  const stockVisible = varianteSeleccionada ? Number(varianteSeleccionada.stock || 0) : Number(producto.stock || 0)
  const puedeAgregar = !sinStock && (!requiereTalla || (varianteSeleccionada && Number(varianteSeleccionada.stock || 0) > 0))
  const imagenProducto = resolverUrlImagen(producto.imagen_url)
  const precioOriginal = Number(producto.precio_original || producto.precio || 0)
  const precioFinal = Number(producto.precio_final || producto.precio || 0)
  const descuento = Number(producto.descuento_promocion || 0)

  return (
    <div className="section-shell grid gap-10 py-10 md:grid-cols-[minmax(280px,430px)_minmax(0,1fr)] md:items-start lg:py-12">
      <div className="surface-panel mx-auto w-full max-w-[430px] overflow-hidden">
        {imagenProducto ? (
          <img
            src={imagenProducto}
            alt={producto.nombre}
            className="aspect-[4/5] w-full object-cover"
            loading="eager"
            fetchPriority="high"
            decoding="async"
          />
        ) : (
          <div className="aspect-[4/5] grid place-items-center text-grisMedio">Sin imagen</div>
        )}
      </div>

      <div className="max-w-3xl">
        <div className="section-kicker">Producto</div>
        <div className="mt-3 text-xs text-claro/50">{producto.sku}</div>
        <h1 className="mt-2 font-urbana text-4xl tracking-wide sm:text-5xl">{producto.nombre}</h1>
        <div className="mt-3 flex flex-wrap items-baseline gap-3">
          <div className="text-dorado text-2xl font-semibold">{formatearMoneda(precioFinal)}</div>
          {descuento > 0 ? <div className="text-sm text-claro/50 line-through">{formatearMoneda(precioOriginal)}</div> : null}
          {descuento > 0 ? (
            <div className="rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-200">
              Promoción
            </div>
          ) : null}
        </div>
        <div className="mt-2 text-sm text-claro/60">
          Reseñas: <span className="font-semibold text-claro/80">{textoPromedio}</span>
          {Number(resumenResenas?.total || 0) > 0 ? <span className="ml-2 text-claro/50">({resumenResenas.total})</span> : null}
        </div>

        {producto.descripcion ? <p className="mt-5 max-w-2xl text-claro/70">{producto.descripcion}</p> : null}

        <div className="mt-6 grid gap-3 text-sm text-claro/70">
          {variantes.length > 0 ? (
            <div className="surface-panel p-4">
              <div className="text-xs uppercase tracking-[0.18em] text-claro/45">Tallas disponibles</div>
              <div className="mt-3 flex flex-wrap gap-2">
                {variantes.map((variante) => (
                  <button
                    type="button"
                    key={variante.id}
                    onClick={() => setVarianteSeleccionadaId(variante.id)}
                    disabled={Number(variante.stock || 0) <= 0}
                    className={`inline-flex items-center rounded-xl border px-3 py-1 text-xs transition ${
                      varianteSeleccionadaId === variante.id
                        ? 'border-dorado bg-dorado text-oscuro'
                        : Number(variante.stock || 0) <= 0
                          ? 'cursor-not-allowed border-grisOscuro bg-grisOscuro/20 text-claro/30'
                          : 'border-grisOscuro bg-grisOscuro/30 text-claro/80 hover:border-dorado/40'
                    }`}
                  >
                    {variante.talla}
                  </button>
                ))}
              </div>
            </div>
          ) : null}
          <div className="surface-panel p-4">
            Stock disponible:{' '}
            <span className="text-claro/90 font-semibold">{stockVisible}</span>
            {requiereTalla && !varianteSeleccionada ? (
              <span className="ml-2 text-xs text-claro/50">Selecciona una talla para ver su stock real</span>
            ) : null}
          </div>
          {requiereTalla ? <GuiaTallas /> : null}
        </div>

        <div className="mt-6">
          <button
            type="button"
            disabled={!puedeAgregar}
            onClick={() => {
              if (requiereTalla && !varianteSeleccionada) {
                toast.error('Selecciona una talla')
                return
              }

              agregarProducto(producto, 1, varianteSeleccionada ? { id: varianteSeleccionada.id, talla: varianteSeleccionada.talla } : null)
              toast.success('Agregado al carrito')
            }}
            className={`w-full rounded-2xl px-5 py-3 font-semibold transition ${
              !puedeAgregar
                ? 'bg-grisMedio/40 text-claro/40 cursor-not-allowed'
                : 'bg-dorado text-oscuro hover:bg-doradoClaro'
            }`}
          >
            {sinStock
              ? 'Sin stock'
              : requiereTalla && !varianteSeleccionada
                ? 'Selecciona una talla'
                : varianteSeleccionada && Number(varianteSeleccionada.stock || 0) <= 0
                  ? 'Talla sin stock'
                  : 'Agregar al carrito'}
          </button>
        </div>

        <div ref={seccionResenasRef} className="mt-10 space-y-4 content-auto">
          <div className="text-sm font-semibold text-dorado">Reseñas</div>

          {!activarResenas ? (
            <div className="surface-panel p-4 text-sm text-claro/60">Cargando reseñas cuando llegues a esta sección...</div>
          ) : cargandoResenas && paginaResenas === 1 ? (
            <div className="text-sm text-claro/60">Cargando reseñas...</div>
          ) : resenas.length === 0 ? (
            <div className="surface-panel p-4 text-sm text-claro/65">
              Aún no hay reseñas aprobadas.
            </div>
          ) : (
            <div className="grid gap-3">
              {resenas.map((r) => (
                <div key={r.id} className="surface-panel p-4">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div className="text-sm font-semibold text-claro/90">{r.cliente?.nombre_completo || 'Cliente'}</div>
                    <div className="text-xs text-doradoClaro font-semibold">{Number(r.calificacion || 0)} / 5</div>
                  </div>
                  {r.comentario ? <div className="mt-2 text-sm text-claro/70">{r.comentario}</div> : null}
                </div>
              ))}
            </div>
          )}

          {hayMasResenas ? (
            <button
              type="button"
              onClick={() => setPaginaResenas((p) => p + 1)}
              disabled={cargandoResenas}
              className={`rounded-xl border px-4 py-3 text-sm transition ${
                cargandoResenas ? 'border-grisOscuro text-claro/40' : 'border-grisOscuro text-claro/70 hover:border-dorado/40 hover:text-doradoClaro'
              }`}
            >
              {cargandoResenas ? 'Cargando...' : 'Ver más reseñas'}
            </button>
          ) : null}

          {estaAutenticado ? (
            <form
              onSubmit={async (e) => {
                e.preventDefault()
                setEnviandoResena(true)
                try {
                  await crearResena(id, {
                    calificacion: Number(formResena.calificacion),
                    comentario: formResena.comentario.trim() || undefined,
                  })
                  toast.success('Reseña enviada para revisión')
                  setFormResena({ calificacion: 5, comentario: '' })
                  setActivarResenas(true)
                  setPaginaResenas(1)
                } catch (error2) {
                  const data = error2?.response?.data
                  const primerCampo = data?.errors ? Object.keys(data.errors)[0] : null
                  const primerError = primerCampo ? data.errors[primerCampo]?.[0] : null
                  toast.error(typeof primerError === 'string' ? primerError : data?.mensaje || 'No se pudo enviar la reseña')
                } finally {
                  setEnviandoResena(false)
                }
              }}
              className="surface-panel p-5"
            >
              <div className="text-sm font-semibold text-dorado">Escribe tu reseña</div>
              <div className="mt-4 grid gap-3">
                <select
                  value={formResena.calificacion}
                  onChange={(e) => setFormResena((f) => ({ ...f, calificacion: Number(e.target.value) }))}
                  className="rounded-xl border border-grisOscuro bg-oscuro/40 px-4 py-3 text-sm text-claro focus:border-dorado/50 focus:outline-none"
                >
                  {[5, 4, 3, 2, 1].map((v) => (
                    <option key={v} value={v}>
                      {v} / 5
                    </option>
                  ))}
                </select>
                <textarea
                  value={formResena.comentario}
                  onChange={(e) => setFormResena((f) => ({ ...f, comentario: e.target.value }))}
                  rows={4}
                  placeholder="Cuéntanos qué tal te pareció..."
                  className="rounded-xl border border-grisOscuro bg-oscuro/40 px-4 py-3 text-sm text-claro placeholder:text-claro/40 focus:border-dorado/50 focus:outline-none"
                />
                <button
                  type="submit"
                  disabled={enviandoResena}
                  className={`rounded-xl px-5 py-3 font-semibold transition ${
                    enviandoResena ? 'bg-grisMedio/40 text-claro/50' : 'bg-dorado text-oscuro hover:bg-doradoClaro'
                  }`}
                >
                  {enviandoResena ? 'Enviando...' : 'Enviar reseña'}
                </button>
              </div>
            </form>
          ) : (
            <div className="surface-panel p-4 text-sm text-claro/65">
              Inicia sesión para dejar una reseña.
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

