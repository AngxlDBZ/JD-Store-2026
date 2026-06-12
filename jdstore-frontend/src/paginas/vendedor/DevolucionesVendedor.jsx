import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { crearDevolucion, listarDevoluciones } from '../../servicios/devolucionServicio'
import { consultarInventarioPorSku } from '../../servicios/inventarioServicio'

function extraerMensaje(error, fallback) {
  const data = error?.response?.data
  const primerCampo = data?.errors ? Object.keys(data.errors)[0] : null
  const primerError = primerCampo ? data.errors[primerCampo]?.[0] : null
  if (typeof primerError === 'string') return primerError
  if (typeof data?.mensaje === 'string') return data.mensaje
  return fallback
}

function formatearFecha(valor) {
  const fecha = valor ? new Date(valor) : null
  if (!fecha || Number.isNaN(fecha.getTime())) return '—'
  return fecha.toLocaleString()
}

export function DevolucionesVendedor() {
  const [cargando, setCargando] = useState(true)
  const [guardando, setGuardando] = useState(false)
  const [devoluciones, setDevoluciones] = useState([])
  const [formulario, setFormulario] = useState({
    pedido_id: '',
    producto_ref: '',
    cantidad: '1',
    motivo: '',
  })
  const [productoResuelto, setProductoResuelto] = useState(null)

  async function cargar() {
    setCargando(true)
    try {
      const datos = await listarDevoluciones()
      setDevoluciones(datos.devoluciones?.data || [])
    } catch {
      toast.error('No se pudieron cargar las devoluciones')
    } finally {
      setCargando(false)
    }
  }

  useEffect(() => {
    cargar()
  }, [])

  async function resolverProductoId() {
    const referencia = String(formulario.producto_ref || '').trim()

    if (!referencia) {
      return null
    }

    if (/^\d+$/.test(referencia)) {
      setProductoResuelto(null)
      return Number(referencia)
    }

    const datos = await consultarInventarioPorSku(referencia)
    setProductoResuelto(datos)

    return Number(datos?.producto_id || 0) || null
  }

  async function guardar(e) {
    e.preventDefault()
    setGuardando(true)
    try {
      const productoId = await resolverProductoId()

      if (!productoId) {
        toast.error('Escribe un ID de producto válido o un SKU existente')
        return
      }

      const payload = {
        pedido_id: Number(formulario.pedido_id),
        producto_id: productoId,
        cantidad: Number(formulario.cantidad),
        motivo: formulario.motivo.trim() || undefined,
      }
      const datos = await crearDevolucion(payload)
      toast.success('Devolución registrada')
      setFormulario({ pedido_id: '', producto_ref: '', cantidad: '1', motivo: '' })
      setProductoResuelto(null)
      setDevoluciones((actual) => (datos.devolucion ? [datos.devolucion, ...actual] : actual))
      await cargar()
    } catch (error) {
      toast.error(extraerMensaje(error, 'No se pudo registrar la devolución'))
    } finally {
      setGuardando(false)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <div className="text-xs uppercase tracking-widest text-claro/50">Vendedor</div>
        <h1 className="mt-2 font-urbana text-3xl tracking-wide text-claro/90 sm:text-4xl">Devoluciones</h1>
      </div>

      <div className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
        <form onSubmit={guardar} className="rounded-2xl border border-grisOscuro bg-grisOscuro/40 p-5">
          <div className="text-sm font-semibold text-dorado">Registrar devolución</div>
          <div className="mt-2 text-xs leading-6 text-claro/55">
            Puedes escribir el `ID del producto` o el `SKU` del producto o de una talla concreta.
          </div>
          <div className="mt-4 grid gap-3">
            <input
              value={formulario.pedido_id}
              onChange={(e) => setFormulario((actual) => ({ ...actual, pedido_id: e.target.value.replace(/\D/g, '') }))}
              placeholder="ID del pedido"
              inputMode="numeric"
              className="rounded-xl border border-grisOscuro bg-oscuro/40 px-4 py-3 text-sm text-claro/80 placeholder:text-claro/40 focus:border-dorado/60 focus:outline-none"
              required
            />
            <input
              value={formulario.producto_ref}
              onChange={(e) => {
                setFormulario((actual) => ({ ...actual, producto_ref: e.target.value }))
                setProductoResuelto(null)
              }}
              placeholder="ID del producto o SKU"
              className="rounded-xl border border-grisOscuro bg-oscuro/40 px-4 py-3 text-sm text-claro/80 placeholder:text-claro/40 focus:border-dorado/60 focus:outline-none"
              required
            />
            {productoResuelto ? (
              <div className="rounded-xl border border-dorado/20 bg-dorado/10 px-4 py-3 text-xs text-claro/75">
                Producto detectado: <span className="font-semibold text-claro">{productoResuelto.producto || `#${productoResuelto.producto_id}`}</span>
                {productoResuelto.talla ? <span className="ml-2 text-doradoClaro">Talla: {productoResuelto.talla}</span> : null}
                <span className="ml-2 text-claro/60">Stock actual: {productoResuelto.stock}</span>
              </div>
            ) : null}
            <input
              value={formulario.cantidad}
              onChange={(e) => setFormulario((actual) => ({ ...actual, cantidad: e.target.value.replace(/\D/g, '') || '1' }))}
              placeholder="Cantidad"
              inputMode="numeric"
              className="rounded-xl border border-grisOscuro bg-oscuro/40 px-4 py-3 text-sm text-claro/80 placeholder:text-claro/40 focus:border-dorado/60 focus:outline-none"
              required
            />
            <textarea
              value={formulario.motivo}
              onChange={(e) => setFormulario((actual) => ({ ...actual, motivo: e.target.value }))}
              placeholder="Motivo de la devolución"
              rows={4}
              className="rounded-xl border border-grisOscuro bg-oscuro/40 px-4 py-3 text-sm text-claro/80 placeholder:text-claro/40 focus:border-dorado/60 focus:outline-none"
            />
          </div>

          <button
            type="submit"
            disabled={guardando}
            className={`mt-5 rounded-xl px-4 py-3 text-sm font-semibold transition ${
              guardando ? 'bg-grisMedio/40 text-claro/50' : 'bg-dorado text-oscuro hover:bg-doradoClaro'
            }`}
          >
            {guardando ? 'Guardando...' : 'Registrar devolución'}
          </button>
        </form>

        <div className="rounded-2xl border border-grisOscuro bg-grisOscuro/40 p-5">
          <div className="flex items-center justify-between gap-3">
            <div className="text-sm font-semibold text-dorado">Historial</div>
            <button
              type="button"
              onClick={cargar}
              className="rounded-lg border border-grisOscuro bg-oscuro/40 px-3 py-1 text-xs text-claro/70 transition hover:border-dorado/40 hover:text-doradoClaro"
            >
              Recargar
            </button>
          </div>

          <div className="mt-4 grid gap-3">
            {cargando ? (
              <div className="text-sm text-claro/60">Cargando devoluciones...</div>
            ) : devoluciones.length === 0 ? (
              <div className="text-sm text-claro/60">No hay devoluciones registradas.</div>
            ) : (
              devoluciones.slice(0, 10).map((devolucion) => (
                <div key={devolucion.id} className="rounded-2xl border border-grisOscuro bg-oscuro/40 p-4 text-sm text-claro/75">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div className="font-semibold text-claro">Devolución #{devolucion.id}</div>
                    <div className="text-xs text-claro/50">{formatearFecha(devolucion.fecha)}</div>
                  </div>
                  <div className="mt-2 text-claro/60">Pedido #{devolucion.pedido?.id || devolucion.pedido_id}</div>
                  <div className="mt-1 text-claro/60">
                    Producto: {devolucion.producto?.nombre || `#${devolucion.producto_id}`} x {devolucion.cantidad}
                  </div>
                  <div className="mt-1 text-claro/60">Motivo: {devolucion.motivo || 'Sin motivo registrado'}</div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
