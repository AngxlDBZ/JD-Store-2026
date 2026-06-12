import { useEffect, useMemo, useState } from 'react'
import toast from 'react-hot-toast'
import { TarjetaEstadistica } from '../../componentes/admin/TarjetaEstadistica'
import { abrirCaja, cerrarCaja, listarCajas } from '../../servicios/cajaServicio'

function formatearFecha(valor) {
  const fecha = valor ? new Date(valor) : null
  if (!fecha || Number.isNaN(fecha.getTime())) return '—'
  return fecha.toLocaleString()
}

function extraerMensaje(error, fallback) {
  const mensaje = error?.response?.data?.mensaje
  return typeof mensaje === 'string' && mensaje.trim() ? mensaje : fallback
}

export function PanelVendedor() {
  const [cargando, setCargando] = useState(true)
  const [procesando, setProcesando] = useState(false)
  const [cajas, setCajas] = useState([])

  async function cargar() {
    setCargando(true)
    try {
      const datos = await listarCajas()
      setCajas(datos.cajas?.data || [])
    } catch {
      toast.error('No se pudo cargar la caja')
    } finally {
      setCargando(false)
    }
  }

  useEffect(() => {
    cargar()
  }, [])

  const cajaAbierta = useMemo(() => cajas.find((caja) => !caja.fecha_cierre) || null, [cajas])
  const cajasCerradas = useMemo(() => cajas.filter((caja) => caja.fecha_cierre).length, [cajas])

  async function manejarAbrirCaja() {
    setProcesando(true)
    try {
      const datos = await abrirCaja()
      setCajas((actual) => {
        const resto = actual.filter((caja) => caja.id !== datos.caja?.id)
        return datos.caja ? [datos.caja, ...resto] : actual
      })
      toast.success('Caja lista para operar')
    } catch (error) {
      toast.error(extraerMensaje(error, 'No se pudo abrir la caja'))
    } finally {
      setProcesando(false)
    }
  }

  async function manejarCerrarCaja() {
    if (!cajaAbierta) return

    setProcesando(true)
    try {
      const datos = await cerrarCaja(cajaAbierta.id)
      setCajas((actual) =>
        actual.map((caja) => (caja.id === datos.caja?.id ? { ...caja, ...datos.caja } : caja))
      )
      toast.success('Caja cerrada correctamente')
    } catch (error) {
      toast.error(extraerMensaje(error, 'No se pudo cerrar la caja'))
    } finally {
      setProcesando(false)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <div className="text-xs uppercase tracking-widest text-claro/50">Vendedor</div>
        <h1 className="mt-2 font-urbana text-3xl tracking-wide text-claro/90 sm:text-4xl">Caja y turno</h1>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <TarjetaEstadistica titulo="Cajas registradas" valor={cajas.length || '0'} />
        <TarjetaEstadistica titulo="Caja abierta" valor={cajaAbierta ? `#${cajaAbierta.id}` : 'No'} />
        <TarjetaEstadistica titulo="Cajas cerradas" valor={cajasCerradas} />
        <TarjetaEstadistica titulo="Total ventas" valor={cajaAbierta?.total_ventas ?? '0'} />
      </div>

      <div className="grid gap-6 xl:grid-cols-[1fr_0.9fr]">
        <div className="rounded-2xl border border-grisOscuro bg-grisOscuro/40 p-5">
          <div className="text-sm font-semibold text-dorado">Estado actual</div>

          {cargando ? (
            <div className="mt-4 text-sm text-claro/60">Consultando caja...</div>
          ) : cajaAbierta ? (
            <div className="mt-4 grid gap-3 text-sm text-claro/75">
              <div className="flex justify-between gap-4">
                <span>Caja</span>
                <span className="font-semibold text-claro">#{cajaAbierta.id}</span>
              </div>
              <div className="flex justify-between gap-4">
                <span>Apertura</span>
                <span className="text-right text-claro/90">{formatearFecha(cajaAbierta.fecha_apertura)}</span>
              </div>
              <div className="flex justify-between gap-4">
                <span>Total ventas</span>
                <span className="font-semibold text-dorado">{cajaAbierta.total_ventas ?? 0}</span>
              </div>
              <div className="rounded-2xl border border-dorado/20 bg-oscuro/40 p-4 text-xs text-claro/65">
                La caja permanece abierta hasta que cierres el turno. Si ya está abierta, el backend reutiliza la misma caja.
              </div>
            </div>
          ) : (
            <div className="mt-4 rounded-2xl border border-grisOscuro bg-oscuro/40 p-4 text-sm text-claro/65">
              No tienes una caja abierta. Abre una para iniciar el turno.
            </div>
          )}

          <div className="mt-5 flex flex-wrap gap-3">
            <button
              type="button"
              disabled={procesando || Boolean(cajaAbierta)}
              onClick={manejarAbrirCaja}
              className={`rounded-xl px-4 py-3 text-sm font-semibold transition ${
                procesando || cajaAbierta ? 'bg-grisMedio/40 text-claro/50' : 'bg-dorado text-oscuro hover:bg-doradoClaro'
              }`}
            >
              Abrir caja
            </button>
            <button
              type="button"
              disabled={procesando || !cajaAbierta}
              onClick={manejarCerrarCaja}
              className={`rounded-xl border px-4 py-3 text-sm font-semibold transition ${
                procesando || !cajaAbierta
                  ? 'border-grisOscuro text-claro/40'
                  : 'border-grisOscuro text-claro/80 hover:border-dorado/40 hover:text-doradoClaro'
              }`}
            >
              Cerrar caja
            </button>
          </div>
        </div>

        <div className="rounded-2xl border border-grisOscuro bg-grisOscuro/40 p-5">
          <div className="flex items-center justify-between gap-3">
            <div className="text-sm font-semibold text-dorado">Historial reciente</div>
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
              <div className="text-sm text-claro/60">Cargando historial...</div>
            ) : cajas.length === 0 ? (
              <div className="text-sm text-claro/60">Todavía no hay cajas registradas.</div>
            ) : (
              cajas.slice(0, 6).map((caja) => (
                <div key={caja.id} className="rounded-2xl border border-grisOscuro bg-oscuro/40 p-4 text-sm text-claro/75">
                  <div className="flex items-center justify-between gap-3">
                    <div className="font-semibold text-claro">Caja #{caja.id}</div>
                    <div className={`rounded-full px-3 py-1 text-xs ${caja.fecha_cierre ? 'bg-claro/10 text-claro/70' : 'bg-dorado/15 text-dorado'}`}>
                      {caja.fecha_cierre ? 'Cerrada' : 'Abierta'}
                    </div>
                  </div>
                  <div className="mt-2 text-claro/60">Apertura: {formatearFecha(caja.fecha_apertura)}</div>
                  <div className="mt-1 text-claro/60">Cierre: {formatearFecha(caja.fecha_cierre)}</div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
