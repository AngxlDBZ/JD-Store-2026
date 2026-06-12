import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { rutas } from '../../constantes/rutas'
import { usarAutenticacion } from '../../hooks/usarAutenticacion'
import { enviarRecuperacionPassword } from '../../servicios/autenticacionServicio'
import { Inicio } from '../publicas/Inicio'

function extraerMensajeErrorLogin(error) {
  const data = error?.response?.data
  if (typeof data?.mensaje === 'string') return data.mensaje
  if (typeof data?.message === 'string') return data.message
  const primerCampo = data?.errors ? Object.keys(data.errors)[0] : null
  const primerError = primerCampo ? data.errors[primerCampo]?.[0] : null
  if (typeof primerError === 'string') return primerError
  return 'Credenciales inválidas'
}

function extraerMensajeErrorRegistro(error) {
  const data = error?.response?.data
  if (typeof data?.mensaje === 'string') return data.mensaje
  if (typeof data?.message === 'string') return data.message
  const primerCampo = data?.errors ? Object.keys(data.errors)[0] : null
  const primerError = primerCampo ? data.errors[primerCampo]?.[0] : null
  if (typeof primerError === 'string') return primerError
  return 'No se pudo crear la cuenta'
}

function extraerMensajeError(error) {
  const data = error?.response?.data
  if (typeof data?.mensaje === 'string') return data.mensaje
  if (typeof data?.message === 'string') return data.message
  const primerCampo = data?.errors ? Object.keys(data.errors)[0] : null
  const primerError = primerCampo ? data.errors[primerCampo]?.[0] : null
  return typeof primerError === 'string' ? primerError : 'Ocurrió un error'
}

export function ApartadoAutenticacion({ modoInicial = 'login' }) {
  const navegar = useNavigate()
  const { iniciarSesion, registrar } = usarAutenticacion()

  const [modo, setModo] = useState(modoInicial)
  const [enviandoLogin, setEnviandoLogin] = useState(false)
  const [enviandoRegistro, setEnviandoRegistro] = useState(false)
  const [mostrandoRecuperacion, setMostrandoRecuperacion] = useState(false)
  const [emailRecuperacion, setEmailRecuperacion] = useState('')
  const [enviandoRecuperacion, setEnviandoRecuperacion] = useState(false)

  const [formLogin, setFormLogin] = useState({ email: '', password: '', recordarme: true })
  const [formRegistro, setFormRegistro] = useState({
    nombre_completo: '',
    email: '',
    password: '',
    password_confirmation: '',
    telefono: '',
    direccion: '',
  })

  useEffect(() => {
    const html = document.documentElement
    const body = document.body
    const prevHtmlOverflow = html.style.overflow
    const prevBodyOverflow = body.style.overflow
    const prevBodyPaddingRight = body.style.paddingRight

    const scrollBarWidth = window.innerWidth - html.clientWidth
    html.style.overflow = 'hidden'
    body.style.overflow = 'hidden'
    if (scrollBarWidth > 0) body.style.paddingRight = `${scrollBarWidth}px`

    return () => {
      html.style.overflow = prevHtmlOverflow
      body.style.overflow = prevBodyOverflow
      body.style.paddingRight = prevBodyPaddingRight
    }
  }, [])

  async function onSubmitLogin(e) {
    e.preventDefault()
    setEnviandoLogin(true)
    try {
      const datos = await iniciarSesion(formLogin)
      const rol = datos.usuario?.rol
      navegar(rol === 'admin' ? rutas.admin : rol === 'vendedor' ? rutas.vendedor : rutas.inicio)
    } catch (e) {
      toast.error(extraerMensajeErrorLogin(e))
    } finally {
      setEnviandoLogin(false)
    }
  }

  async function onSubmitRecuperacion() {
    const email = emailRecuperacion.trim()
    if (!email) {
      toast.error('Ingresa tu correo')
      return
    }

    setEnviandoRecuperacion(true)
    try {
      await enviarRecuperacionPassword(email)
      toast.success('Te enviamos una contraseña temporal a tu correo')
      setMostrandoRecuperacion(false)
      setEmailRecuperacion('')
    } catch (e) {
      toast.error(extraerMensajeError(e) || 'No se pudo enviar el correo')
    } finally {
      setEnviandoRecuperacion(false)
    }
  }

  async function onSubmitRegistro(e) {
    e.preventDefault()

    if (!/^[A-Za-zÁÉÍÓÚÜÑáéíóúüñ\s]+$/.test(formRegistro.nombre_completo.trim())) {
      toast.error('El nombre solo puede contener letras')
      return
    }
    if (formRegistro.telefono && !/^\d+$/.test(formRegistro.telefono)) {
      toast.error('El teléfono solo puede contener números')
      return
    }
    if (formRegistro.password.length < 8) {
      toast.error('La contraseña debe tener mínimo 8 caracteres')
      return
    }
    if (formRegistro.password !== formRegistro.password_confirmation) {
      toast.error('Las contraseñas no coinciden')
      return
    }
    if (formRegistro.telefono && formRegistro.telefono.replace(/\D/g, '').length !== 10) {
      toast.error('El teléfono debe tener 10 dígitos')
      return
    }
    if (formRegistro.direccion && formRegistro.direccion.trim().length < 8) {
      toast.error('La dirección debe tener al menos 8 caracteres')
      return
    }

    setEnviandoRegistro(true)
    try {
      await registrar(formRegistro)
      navegar(rutas.inicio)
    } catch (e) {
      toast.error(extraerMensajeErrorRegistro(e))
    } finally {
      setEnviandoRegistro(false)
    }
  }

  return (
    <div className="relative min-h-screen">
      <div className="absolute inset-0 pointer-events-none select-none blur-md scale-[1.02]">
        <Inicio />
      </div>

      <div className="absolute inset-0 bg-oscuro/50 backdrop-blur-sm" />

      <div className="relative z-10 h-[calc(100dvh-5rem)] overflow-y-auto overscroll-contain">
        <div
          className={`mx-auto flex min-h-full w-full items-start px-3 pb-16 pt-3 sm:px-4 sm:pb-8 sm:pt-5 lg:items-center ${
            modo === 'login' ? 'max-w-2xl xl:max-w-[760px]' : 'max-w-3xl'
          }`}
        >
          <div className="w-full motion-fade-up">
            <div className="flex items-center justify-between gap-3">
              <div className="text-dorado text-xs tracking-widest sm:text-sm">ACCESO</div>
              <Link to={rutas.inicio} className="text-sm font-semibold uppercase tracking-wider text-claro/70 transition hover:text-doradoClaro">
                Volver
              </Link>
            </div>

            <div className="mt-4 overflow-hidden rounded-[1.6rem] border border-grisOscuro bg-grisOscuro/40 shadow-dorado sm:mt-5">
              <div className="p-1.5 sm:p-2">
                <div className="grid grid-cols-2 rounded-2xl border border-grisOscuro bg-oscuro/40 p-1">
                  <button
                    type="button"
                    onClick={() => setModo('login')}
                    className={`rounded-xl py-1.5 text-xs font-semibold transition sm:text-sm ${
                      modo === 'login' ? 'bg-dorado text-oscuro' : 'text-claro/70 hover:text-doradoClaro'
                    }`}
                  >
                    Iniciar sesión
                  </button>
                  <button
                    type="button"
                    onClick={() => setModo('registro')}
                    className={`rounded-xl py-1.5 text-xs font-semibold transition sm:text-sm ${
                      modo === 'registro' ? 'bg-dorado text-oscuro' : 'text-claro/70 hover:text-doradoClaro'
                    }`}
                  >
                    Registro
                  </button>
                </div>
              </div>

              <div className="relative overflow-hidden">
                <div
                  className={`flex w-[200%] transition-transform duration-500 ease-out ${
                    modo === 'registro' ? '-translate-x-1/2' : 'translate-x-0'
                  }`}
                >
                  <div className="flex w-1/2 flex-col p-4 pb-5 sm:p-5">
                    <h1 className="font-urbana text-xl tracking-wide sm:text-2xl">Iniciar sesión</h1>
                    <form onSubmit={onSubmitLogin} className="mt-4 flex flex-1 flex-col gap-2">
                  <input
                    value={formLogin.email}
                    onChange={(e) => setFormLogin((f) => ({ ...f, email: e.target.value }))}
                    placeholder="Correo"
                    type="email"
                    className="rounded-xl border border-grisOscuro bg-oscuro/40 px-4 py-2.5 text-sm text-claro placeholder:text-claro/40 focus:outline-none focus:border-dorado/50"
                    required
                  />
                  <input
                    value={formLogin.password}
                    onChange={(e) => setFormLogin((f) => ({ ...f, password: e.target.value }))}
                    placeholder="Contraseña"
                    type="password"
                    className="rounded-xl border border-grisOscuro bg-oscuro/40 px-4 py-2.5 text-sm text-claro placeholder:text-claro/40 focus:outline-none focus:border-dorado/50"
                    required
                  />
                  <label className="flex items-center gap-2 text-xs text-claro/70 sm:text-sm">
                    <input
                      type="checkbox"
                      checked={formLogin.recordarme}
                      onChange={(e) => setFormLogin((f) => ({ ...f, recordarme: e.target.checked }))}
                      className="accent-dorado"
                    />
                    Recordarme
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      setMostrandoRecuperacion((v) => !v)
                      setEmailRecuperacion(formLogin.email || '')
                    }}
                    className="text-left text-xs text-claro/70 hover:text-doradoClaro sm:text-sm"
                  >
                    ¿Olvidaste tu contraseña?
                  </button>

                  {mostrandoRecuperacion ? (
                    <div className="mt-2 grid gap-3 rounded-2xl border border-grisOscuro bg-oscuro/40 p-4">
                      <div className="text-xs text-claro/50">Enviaremos una contraseña temporal a este correo</div>
                      <input
                        value={emailRecuperacion}
                        onChange={(e) => setEmailRecuperacion(e.target.value)}
                        placeholder="Correo"
                        type="email"
                        className="rounded-xl border border-grisOscuro bg-oscuro/40 px-4 py-2.5 text-sm text-claro placeholder:text-claro/40 focus:outline-none focus:border-dorado/50"
                      />
                      <div className="flex flex-wrap gap-2">
                        <button
                          type="button"
                          disabled={enviandoRecuperacion}
                          onClick={onSubmitRecuperacion}
                        className={`rounded-xl px-4 py-2 text-sm font-semibold transition ${
                            enviandoRecuperacion ? 'bg-grisMedio/40 text-claro/50' : 'bg-dorado text-oscuro hover:bg-doradoClaro'
                          }`}
                        >
                          {enviandoRecuperacion ? 'Enviando...' : 'Enviar'}
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setMostrandoRecuperacion(false)
                            setEmailRecuperacion('')
                          }}
                          className="rounded-xl border border-grisOscuro bg-oscuro/40 px-4 py-2 text-sm text-claro/70 hover:border-dorado/40 hover:text-doradoClaro transition"
                        >
                          Cancelar
                        </button>
                      </div>
                    </div>
                  ) : null}
                      <button
                        type="submit"
                        disabled={enviandoLogin}
                        className={`mt-1 rounded-xl px-5 py-2.5 text-sm font-semibold transition sm:text-base ${
                          enviandoLogin ? 'bg-grisMedio/40 text-claro/50' : 'bg-dorado text-oscuro hover:bg-doradoClaro'
                        }`}
                      >
                        {enviandoLogin ? 'Ingresando...' : 'Entrar'}
                      </button>
                    </form>
                  </div>

                  <div className="w-1/2 border-l border-grisOscuro/70 p-4 pb-5 sm:p-5">
                    <h2 className="font-urbana text-xl tracking-wide sm:text-2xl">Registro</h2>
                    <form onSubmit={onSubmitRegistro} className="mt-4 grid gap-2">
                  <input
                    value={formRegistro.nombre_completo}
                    onChange={(e) => setFormRegistro((f) => ({ ...f, nombre_completo: e.target.value }))}
                    placeholder="Nombre completo"
                    className="rounded-xl border border-grisOscuro bg-oscuro/40 px-4 py-2.5 text-sm text-claro placeholder:text-claro/40 focus:outline-none focus:border-dorado/50"
                    required
                  />
                  <input
                    value={formRegistro.email}
                    onChange={(e) => setFormRegistro((f) => ({ ...f, email: e.target.value }))}
                    placeholder="Correo (@ejemplo.com)"
                    type="email"
                    className="rounded-xl border border-grisOscuro bg-oscuro/40 px-4 py-2.5 text-sm text-claro placeholder:text-claro/40 focus:outline-none focus:border-dorado/50"
                    required
                  />
                  <input
                    value={formRegistro.password}
                    onChange={(e) => setFormRegistro((f) => ({ ...f, password: e.target.value }))}
                    placeholder="Contraseña (mín. 8 caracteres)"
                    type="password"
                    className="rounded-xl border border-grisOscuro bg-oscuro/40 px-4 py-2.5 text-sm text-claro placeholder:text-claro/40 focus:outline-none focus:border-dorado/50"
                    required
                  />
                  <input
                    value={formRegistro.password_confirmation}
                    onChange={(e) => setFormRegistro((f) => ({ ...f, password_confirmation: e.target.value }))}
                    placeholder="Confirmar contraseña"
                    type="password"
                    className="rounded-xl border border-grisOscuro bg-oscuro/40 px-4 py-2.5 text-sm text-claro placeholder:text-claro/40 focus:outline-none focus:border-dorado/50"
                    required
                  />
                  <input
                    value={formRegistro.telefono}
                    onChange={(e) => setFormRegistro((f) => ({ ...f, telefono: e.target.value.replace(/\D/g, '') }))}
                    placeholder="Teléfono (10 dígitos)"
                    inputMode="numeric"
                    className="rounded-xl border border-grisOscuro bg-oscuro/40 px-4 py-2.5 text-sm text-claro placeholder:text-claro/40 focus:outline-none focus:border-dorado/50"
                  />
                  <input
                    value={formRegistro.direccion}
                    onChange={(e) => setFormRegistro((f) => ({ ...f, direccion: e.target.value }))}
                    placeholder="Dirección de envío"
                    className="rounded-xl border border-grisOscuro bg-oscuro/40 px-4 py-2.5 text-sm text-claro placeholder:text-claro/40 focus:outline-none focus:border-dorado/50"
                  />

                      <button
                        type="submit"
                        disabled={enviandoRegistro}
                        className={`rounded-xl px-5 py-2.5 text-sm font-semibold transition sm:text-base ${
                          enviandoRegistro ? 'bg-grisMedio/40 text-claro/50' : 'bg-dorado text-oscuro hover:bg-doradoClaro'
                        }`}
                      >
                        {enviandoRegistro ? 'Creando...' : 'Crear cuenta'}
                      </button>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export function IniciarSesion() {
  return <ApartadoAutenticacion modoInicial="login" />
}
