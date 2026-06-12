import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import toast from 'react-hot-toast'
import { usarAutenticacion } from '../../hooks/usarAutenticacion'
import { enviarMensajeCliente } from '../../servicios/mensajeServicio'
import { rutas } from '../../constantes/rutas'

export function Contacto() {
  const { usuario } = usarAutenticacion()
  const [formulario, setFormulario] = useState({ nombre_remitente: '', correo_remitente: '', mensaje: '' })
  const [enviando, setEnviando] = useState(false)

  useEffect(() => {
    setFormulario((actual) => ({
      ...actual,
      nombre_remitente: usuario?.nombre_completo || '',
      correo_remitente: usuario?.email || '',
    }))
  }, [usuario?.nombre_completo, usuario?.email])

  async function onSubmit(e) {
    e.preventDefault()

    if (!usuario) {
      toast.error('Debes iniciar sesión para enviar un mensaje')
      return
    }

    if (formulario.mensaje.trim().length < 10) {
      toast.error('El mensaje debe tener al menos 10 caracteres')
      return
    }

    setEnviando(true)
    try {
      await enviarMensajeCliente(formulario.mensaje.trim())
      setFormulario((f) => ({ ...f, mensaje: '' }))
      toast.success('Mensaje enviado')
    } catch {
      toast.error('No se pudo enviar el mensaje')
    } finally {
      setEnviando(false)
    }
  }

  return (
    <div className="section-shell py-12">
      <div className="surface-panel p-6 sm:p-7">
        <div className="section-kicker">Contacto</div>
        <h1 className="mt-2 font-urbana text-4xl tracking-wide sm:text-5xl">Contáctanos</h1>
        <p className="mt-3 max-w-3xl text-sm leading-7 text-claro/65 sm:text-base">
          Escríbenos desde tu cuenta y mantén la conversación centralizada dentro de JD Store para dar seguimiento más fácil a tus pedidos o dudas.
        </p>
      </div>

      <div className="mt-8 grid gap-6 xl:grid-cols-[minmax(0,1.2fr)_minmax(360px,440px)]">
        <form onSubmit={onSubmit} className="surface-panel p-7 lg:p-8">
          <div className="text-sm text-dorado font-semibold">Envíanos un mensaje</div>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <input
              value={formulario.nombre_remitente}
              placeholder="Nombre"
                className="rounded-xl border border-grisOscuro bg-oscuro/40 px-4 py-3 text-sm text-claro/60 sm:col-span-1"
              disabled
            />
            <input
              value={formulario.correo_remitente}
              placeholder="Correo"
              type="email"
              className="rounded-xl border border-grisOscuro bg-oscuro/40 px-4 py-3 text-sm text-claro/60 sm:col-span-1"
              disabled
            />

            {!usuario ? (
              <div className="rounded-2xl border border-dorado/20 bg-dorado/10 p-4 text-sm text-claro/75 sm:col-span-2">
                Inicia sesión o crea una cuenta para enviarnos un mensaje.
                <div className="mt-3 flex flex-wrap gap-3">
                  <Link
                    to={rutas.iniciarSesion}
                    className="rounded-xl bg-dorado px-4 py-2 font-semibold text-oscuro transition hover:bg-doradoClaro"
                  >
                    Iniciar sesión
                  </Link>
                  <Link
                    to={rutas.registro}
                    className="rounded-xl border border-grisOscuro bg-oscuro/40 px-4 py-2 text-claro/80 transition hover:border-dorado/40 hover:text-doradoClaro"
                  >
                    Crear cuenta
                  </Link>
                </div>
              </div>
            ) : null}

            <textarea
              value={formulario.mensaje}
              onChange={(e) => setFormulario((f) => ({ ...f, mensaje: e.target.value }))}
              placeholder={usuario ? 'Mensaje' : 'Inicia sesión para escribir tu mensaje'}
              rows={5}
              className="rounded-xl border border-grisOscuro bg-oscuro/40 px-4 py-3 text-sm text-claro placeholder:text-claro/40 focus:outline-none focus:border-dorado/50 sm:col-span-2"
              disabled={!usuario}
              required
            />
            <button
              type="submit"
              disabled={enviando || !usuario}
              className={`rounded-xl px-5 py-3 font-semibold transition sm:col-span-2 ${
                enviando || !usuario ? 'bg-grisMedio/40 text-claro/50' : 'bg-dorado text-oscuro hover:bg-doradoClaro'
              }`}
            >
              {enviando ? 'Enviando...' : 'Enviar'}
            </button>
          </div>
        </form>

        <div className="grid gap-6">
          <div className="surface-panel p-7 lg:p-8">
            <div className="text-sm text-dorado font-semibold">Información</div>
            <div className="mt-3 space-y-2 text-sm text-claro/75">
              <div>Correo: mora59974@gmail.com</div>
              <div>WhatsApp: +57 318 326 0720</div>
              <div>Dirección: Centro Comercial La 14, Local 128, Piso 1, Ibagué, Tolima</div>
            </div>
          </div>

          <div className="surface-panel p-4 sm:p-5">
            <div className="px-3 text-sm text-dorado font-semibold">Mapa</div>
            <div className="mt-3 rounded-2xl overflow-hidden border border-grisOscuro">
              <iframe
                title="Mapa JD Store"
                className="h-72 w-full"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                src="https://www.google.com/maps?q=Centro%20Comercial%20La%2014%20Ibagu%C3%A9&output=embed"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

