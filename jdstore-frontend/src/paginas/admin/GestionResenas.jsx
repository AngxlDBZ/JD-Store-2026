import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { actualizarEstadoResena, listarResenasAdmin } from '../../servicios/resenaServicio'

function capitalizarEstado(valor) {
  return String(valor || '—')
    .replaceAll('_', ' ')
    .replace(/\b\w/g, (letra) => letra.toUpperCase())
}

export function GestionResenas() {
  const [cargando, setCargando] = useState(true)
  const [resenas, setResenas] = useState([])
  const [estado, setEstado] = useState('')
  const [actualizandoId, setActualizandoId] = useState(null)

  async function cargar() {
    setCargando(true)
    try {
      const datos = await listarResenasAdmin(estado ? { estado } : {})
      setResenas(datos.resenas?.data || [])
    } catch {
      toast.error('No se pudieron cargar las reseñas')
    } finally {
      setCargando(false)
    }
  }

  useEffect(() => {
    cargar()
  }, [estado])

  async function cambiarEstado(r, nuevoEstado) {
    setActualizandoId(r.id)
    try {
      await actualizarEstadoResena(r.id, nuevoEstado)
      toast.success('Reseña actualizada')
      await cargar()
    } catch {
      toast.error('No se pudo actualizar la reseña')
    } finally {
      setActualizandoId(null)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <div className="text-xs uppercase tracking-widest text-claro/50">Admin</div>
        <h1 className="mt-2 font-urbana text-4xl tracking-wide text-claro/90">Reseñas</h1>
        <p className="mt-3 max-w-3xl text-sm text-claro/60">
          Revisa las opiniones de los clientes y decide si se publican, se dejan pendientes o se rechazan.
        </p>
      </div>

      <div className="rounded-2xl border border-grisOscuro bg-grisOscuro/40 p-5">
        <p className="max-w-2xl text-xs leading-6 text-claro/55">
          Usa este filtro para revisar solo las reseñas pendientes, aprobadas o rechazadas y luego cambia su estado desde cada tarjeta.
        </p>
        <div className="flex flex-wrap items-end gap-3">
          <div>
            <div className="text-xs text-claro/50">Filtrar por estado</div>
            <select
              value={estado}
              onChange={(e) => setEstado(e.target.value)}
              className="mt-1 rounded-xl border border-grisOscuro bg-oscuro/40 px-4 py-2 text-sm text-claro/80 focus:outline-none focus:border-dorado/50"
            >
              <option value="">Todas</option>
              <option value="pendiente">Pendientes</option>
              <option value="aprobada">Aprobadas</option>
              <option value="rechazada">Rechazadas</option>
            </select>
          </div>

          <button
            type="button"
            onClick={cargar}
            className="rounded-xl border border-grisOscuro bg-oscuro/40 px-4 py-2 text-sm text-claro/80 transition hover:border-dorado/40 hover:text-doradoClaro"
          >
            Recargar
          </button>
        </div>
      </div>

      <div className="rounded-2xl border border-grisOscuro bg-grisOscuro/40 overflow-hidden">
        <div className="divide-y divide-grisOscuro">
          {cargando ? (
            <div className="p-6 text-center text-claro/50">Cargando...</div>
          ) : resenas.length === 0 ? (
            <div className="p-6 text-center text-claro/50">Sin reseñas</div>
          ) : (
            resenas.map((r) => (
              <div key={r.id} className="p-5 flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <div className="font-semibold text-claro/90 truncate">{r.producto?.nombre || `Producto #${r.producto_id}`}</div>
                    <div className="text-xs rounded-full px-3 py-1 border border-grisOscuro bg-oscuro/40 text-claro/70">
                      {Number(r.calificacion || 0)} / 5
                    </div>
                    <div className="text-xs rounded-full px-3 py-1 border border-dorado/30 bg-dorado/10 text-doradoClaro">
                      {capitalizarEstado(r.estado)}
                    </div>
                  </div>
                  <div className="mt-3 grid gap-3 text-sm text-claro/68 sm:grid-cols-2">
                    <div>
                      <div className="text-[11px] uppercase tracking-[0.18em] text-claro/40">Cliente</div>
                      <div className="mt-1 text-xs text-claro/60">{r.cliente?.nombre_completo || 'Cliente'}</div>
                    </div>
                    <div>
                      <div className="text-[11px] uppercase tracking-[0.18em] text-claro/40">SKU</div>
                      <div className="mt-1 text-xs text-claro/60">{r.producto?.sku || 'Sin SKU'}</div>
                    </div>
                  </div>
                  {r.comentario ? (
                    <div className="mt-3">
                      <div className="text-[11px] uppercase tracking-[0.18em] text-claro/40">Comentario</div>
                      <div className="mt-1 whitespace-pre-wrap text-sm text-claro/70">{r.comentario}</div>
                    </div>
                  ) : null}
                </div>

                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    disabled={actualizandoId === r.id}
                    onClick={() => cambiarEstado(r, 'aprobada')}
                    className={`rounded-lg px-4 py-2 text-sm font-semibold transition ${
                      actualizandoId === r.id ? 'bg-grisMedio/40 text-claro/50' : 'bg-dorado text-oscuro hover:bg-doradoClaro'
                    }`}
                  >
                    Aprobar
                  </button>
                  <button
                    type="button"
                    disabled={actualizandoId === r.id}
                    onClick={() => cambiarEstado(r, 'rechazada')}
                    className="rounded-lg border border-grisOscuro bg-oscuro/40 px-4 py-2 text-sm text-claro/70 transition hover:border-dorado/40 hover:text-doradoClaro"
                  >
                    Rechazar
                  </button>
                  <button
                    type="button"
                    disabled={actualizandoId === r.id}
                    onClick={() => cambiarEstado(r, 'pendiente')}
                    className="rounded-lg border border-grisOscuro bg-oscuro/40 px-4 py-2 text-sm text-claro/70 transition hover:border-dorado/40 hover:text-doradoClaro"
                  >
                    Pendiente
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}

