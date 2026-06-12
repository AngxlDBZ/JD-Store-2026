import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { eliminarMensaje, listarMensajesAdmin, marcarMensajeLeido, responderMensajeAdmin } from '../../servicios/mensajeServicio'

export function GestionMensajes() {
  const [cargando, setCargando] = useState(true)
  const [mensajes, setMensajes] = useState([])
  const [respondiendoId, setRespondiendoId] = useState(null)
  const [respuestaTexto, setRespuestaTexto] = useState('')
  const [guardandoRespuesta, setGuardandoRespuesta] = useState(false)

  async function cargar() {
    setCargando(true)
    try {
      const datos = await listarMensajesAdmin()
      setMensajes(datos.mensajes?.data || [])
    } catch {
      toast.error('No se pudieron cargar los mensajes')
    } finally {
      setCargando(false)
    }
  }

  useEffect(() => {
    cargar()
  }, [])

  async function abrirResponder(m) {
    setRespondiendoId(m.id)
    setRespuestaTexto(m.respuesta || '')
    try {
      if (!m.leido) await marcarMensajeLeido(m.id)
    } catch {
      null
    }
  }

  async function guardarRespuesta(m) {
    const texto = respuestaTexto.trim()
    if (!texto) {
      toast.error('Escribe una respuesta')
      return
    }
    setGuardandoRespuesta(true)
    try {
      await responderMensajeAdmin(m.id, texto)
      toast.success('Respuesta guardada')
      setRespondiendoId(null)
      setRespuestaTexto('')
      await cargar()
    } catch {
      toast.error('No se pudo guardar la respuesta')
    } finally {
      setGuardandoRespuesta(false)
    }
  }

  async function borrar(m) {
    try {
      await eliminarMensaje(m.id)
      toast.success('Mensaje eliminado')
      await cargar()
    } catch {
      toast.error('No se pudo eliminar')
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <div className="text-xs uppercase tracking-widest text-claro/50">Admin</div>
        <h1 className="mt-2 font-urbana text-4xl tracking-wide text-claro/90">Mensajes</h1>
      </div>

      <div className="rounded-2xl border border-grisOscuro bg-grisOscuro/40 overflow-hidden">
        <div className="px-5 py-4 border-b border-grisOscuro flex items-center justify-between">
          <div className="text-sm font-semibold text-claro/80">Bandeja</div>
          <button
            type="button"
            onClick={cargar}
            className="text-xs rounded-lg border border-grisOscuro bg-oscuro/40 px-3 py-1 text-claro/70 hover:border-dorado/40 hover:text-doradoClaro transition"
          >
            Recargar
          </button>
        </div>

        <div className="divide-y divide-grisOscuro">
          {cargando ? (
            <div className="p-6 text-center text-claro/50">Cargando...</div>
          ) : mensajes.length === 0 ? (
            <div className="p-6 text-center text-claro/50">Sin mensajes</div>
          ) : (
            mensajes.map((m) => (
              <div key={m.id} className="p-5 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <div className="font-semibold text-claro/90 truncate">{m.nombre_remitente}</div>
                    <div
                      className={`text-xs rounded-full px-3 py-1 border ${
                        m.leido
                          ? 'bg-oscuro/40 text-claro/60 border-grisOscuro'
                          : 'bg-dorado/15 text-doradoClaro border-dorado/30'
                      }`}
                    >
                      {m.leido ? 'Leído' : 'Nuevo'}
                    </div>
                    {m.respuesta ? (
                      <div className="text-xs rounded-full px-3 py-1 border bg-emerald-500/10 text-emerald-300 border-emerald-500/20">
                        Respondido
                      </div>
                    ) : null}
                  </div>
                  <div className="text-xs text-claro/50">{m.correo_remitente}</div>
                  <div className="mt-2 text-sm text-claro/70 whitespace-pre-wrap">{m.mensaje}</div>
                  {m.respuesta && respondiendoId !== m.id ? (
                    <div className="mt-4 rounded-2xl border border-grisOscuro bg-oscuro/40 p-4">
                      <div className="text-xs text-claro/50">Respuesta</div>
                      <div className="mt-2 text-sm text-claro/80 whitespace-pre-wrap">{m.respuesta}</div>
                    </div>
                  ) : null}

                  {respondiendoId === m.id ? (
                    <div className="mt-4 rounded-2xl border border-grisOscuro bg-oscuro/40 p-4">
                      <div className="text-xs text-claro/50">Respuesta</div>
                      <textarea
                        value={respuestaTexto}
                        onChange={(e) => setRespuestaTexto(e.target.value)}
                        rows={4}
                        className="mt-2 w-full rounded-xl border border-grisOscuro bg-oscuro/40 px-4 py-3 text-sm text-claro placeholder:text-claro/40 focus:outline-none focus:border-dorado/50"
                        placeholder="Escribe la respuesta para el cliente..."
                      />
                      <div className="mt-3 flex flex-wrap gap-2">
                        <button
                          type="button"
                          disabled={guardandoRespuesta}
                          onClick={() => guardarRespuesta(m)}
                          className={`rounded-lg px-4 py-2 text-sm font-semibold transition ${
                            guardandoRespuesta ? 'bg-grisMedio/40 text-claro/50' : 'bg-dorado text-oscuro hover:bg-doradoClaro'
                          }`}
                        >
                          {guardandoRespuesta ? 'Guardando...' : 'Guardar'}
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setRespondiendoId(null)
                            setRespuestaTexto('')
                          }}
                          className="rounded-lg border border-grisOscuro bg-oscuro/40 px-4 py-2 text-sm text-claro/70 hover:border-dorado/40 hover:text-doradoClaro transition"
                        >
                          Cancelar
                        </button>
                      </div>
                    </div>
                  ) : null}
                </div>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => abrirResponder(m)}
                    className="rounded-lg bg-dorado px-4 py-2 text-sm font-semibold text-oscuro hover:bg-doradoClaro transition"
                  >
                    {m.respuesta ? 'Editar respuesta' : 'Responder'}
                  </button>
                  <button
                    type="button"
                    onClick={() => borrar(m)}
                    className="rounded-lg border border-grisOscuro bg-oscuro/40 px-4 py-2 text-sm text-claro/70 hover:border-dorado/40 hover:text-doradoClaro transition"
                  >
                    Eliminar
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

