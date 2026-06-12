import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import toast from 'react-hot-toast'
import { usarAutenticacion } from '../../hooks/usarAutenticacion'
import { usarPedidos } from '../../hooks/usarPedidos'
import { CargadorSpinner } from '../../componentes/comunes/CargadorSpinner'
import { formatearMoneda } from '../../utilidades/formatearMoneda'
import { listarMensajesCliente, marcarMensajeLeidoCliente } from '../../servicios/mensajeServicio'
import { rutas } from '../../constantes/rutas'
import { actualizarPerfil, cambiarPassword } from '../../servicios/autenticacionServicio'
import { usarFavoritos } from '../../hooks/usarFavoritos'
import { TarjetaProducto } from '../../componentes/comunes/TarjetaProducto'
import { SeguimientoPedido } from '../../componentes/cliente/SeguimientoPedido'
import { listarNotificaciones, marcarNotificacionLeida } from '../../servicios/notificacionServicio'

function extraerPrimerError(error, fallback) {
  const data = error?.response?.data
  const primerCampo = data?.errors ? Object.keys(data.errors)[0] : null
  const primerError = primerCampo ? data.errors[primerCampo]?.[0] : null
  return typeof primerError === 'string' ? primerError : fallback
}

function obtenerClaseEstadoPago(estadoPago) {
  if (estadoPago === 'aprobado') {
    return 'border-emerald-500/30 bg-emerald-500/10 text-emerald-200'
  }

  if (['rechazado', 'anulado', 'error'].includes(estadoPago)) {
    return 'border-red-500/30 bg-red-500/10 text-red-200'
  }

  return 'border-dorado/30 bg-dorado/10 text-doradoClaro'
}

function capitalizarEstado(valor) {
  return String(valor || '')
    .replaceAll('_', ' ')
    .replace(/\b\w/g, (letra) => letra.toUpperCase())
}

export function Perfil() {
  const { usuario, actualizarUsuario } = usarAutenticacion()
  const { favoritos } = usarFavoritos()
  const { cargando, pedidos } = usarPedidos()
  const [cargandoMensajes, setCargandoMensajes] = useState(true)
  const [mensajes, setMensajes] = useState([])
  const [cargandoNotificaciones, setCargandoNotificaciones] = useState(true)
  const [notificaciones, setNotificaciones] = useState([])
  const [formPassword, setFormPassword] = useState({ password_actual: '', password: '', password_confirmation: '' })
  const [guardandoPassword, setGuardandoPassword] = useState(false)
  const [editandoPerfil, setEditandoPerfil] = useState(false)
  const [guardandoPerfil, setGuardandoPerfil] = useState(false)
  const [nuevaDireccionGuardada, setNuevaDireccionGuardada] = useState('')
  const [formPerfil, setFormPerfil] = useState({
    nombre_completo: '',
    email: '',
    telefono: '',
    direccion: '',
    direcciones_guardadas: [],
  })

  useEffect(() => {
    setFormPerfil({
      nombre_completo: usuario?.nombre_completo || '',
      email: usuario?.email || '',
      telefono: usuario?.telefono || '',
      direccion: usuario?.direccion || '',
      direcciones_guardadas: Array.isArray(usuario?.direcciones_guardadas) ? usuario.direcciones_guardadas : [],
    })
  }, [usuario])

  const favoritosRecientes = useMemo(() => favoritos.slice(0, 5), [favoritos])

  useEffect(() => {
    let activo = true

    async function cargarMensajes() {
      setCargandoMensajes(true)
      try {
        const datos = await listarMensajesCliente()
        if (activo) setMensajes(datos.mensajes?.data || [])
      } catch {
        toast.error('No se pudieron cargar los mensajes')
      } finally {
        if (activo) setCargandoMensajes(false)
      }
    }

    cargarMensajes()
    return () => {
      activo = false
    }
  }, [])

  useEffect(() => {
    let activo = true

    async function cargarNotificaciones() {
      setCargandoNotificaciones(true)
      try {
        const datos = await listarNotificaciones()
        if (activo) setNotificaciones(datos.notificaciones?.data || [])
      } catch {
        if (activo) setNotificaciones([])
      } finally {
        if (activo) setCargandoNotificaciones(false)
      }
    }

    cargarNotificaciones()

    return () => {
      activo = false
    }
  }, [])

  async function marcarNotificacion(n) {
    if (n.leido_en) return
    try {
      const datos = await marcarNotificacionLeida(n.id)
      setNotificaciones((actual) => actual.map((x) => (x.id === n.id ? datos.notificacion : x)))
    } catch {
      null
    }
  }

  async function marcarLeido(m) {
    if (m.leido_cliente) return
    try {
      await marcarMensajeLeidoCliente(m.id)
      setMensajes((actual) => actual.map((x) => (x.id === m.id ? { ...x, leido_cliente: true } : x)))
    } catch {
      null
    }
  }

  async function guardarPassword(e) {
    e.preventDefault()
    if (formPassword.password.length < 8) {
      toast.error('La contraseña debe tener mínimo 8 caracteres')
      return
    }
    if (formPassword.password !== formPassword.password_confirmation) {
      toast.error('Las contraseñas no coinciden')
      return
    }
    setGuardandoPassword(true)
    try {
      await cambiarPassword(formPassword)
      toast.success('Contraseña actualizada')
      setFormPassword({ password_actual: '', password: '', password_confirmation: '' })
    } catch (e2) {
      toast.error(extraerPrimerError(e2, 'No se pudo actualizar la contraseña'))
    } finally {
      setGuardandoPassword(false)
    }
  }

  async function guardarPerfil(e) {
    e.preventDefault()

    if (!/^[A-Za-zÁÉÍÓÚÜÑáéíóúüñ\s]+$/u.test(formPerfil.nombre_completo.trim())) {
      toast.error('El nombre solo puede contener letras')
      return
    }

    if (formPerfil.telefono && !/^\d{10}$/.test(formPerfil.telefono)) {
      toast.error('El teléfono debe tener 10 dígitos')
      return
    }

    if (formPerfil.direccion.trim().length < 8) {
      toast.error('Ingresa una dirección válida')
      return
    }

    setGuardandoPerfil(true)
    try {
      const respuesta = await actualizarPerfil({
        ...formPerfil,
        nombre_completo: formPerfil.nombre_completo.trim(),
        email: formPerfil.email.trim(),
        direccion: formPerfil.direccion.trim(),
        direcciones_guardadas: Array.from(new Set([formPerfil.direccion.trim(), ...(formPerfil.direcciones_guardadas || [])])),
      })
      actualizarUsuario(respuesta.usuario)
      setEditandoPerfil(false)
      toast.success('Perfil actualizado')
    } catch (error) {
      toast.error(extraerPrimerError(error, 'No se pudo actualizar el perfil'))
    } finally {
      setGuardandoPerfil(false)
    }
  }

  function agregarDireccionGuardada() {
    const direccion = nuevaDireccionGuardada.trim()

    if (direccion.length < 8) {
      toast.error('Ingresa una dirección válida')
      return
    }

    setFormPerfil((actual) => ({
      ...actual,
      direcciones_guardadas: Array.from(new Set([...(actual.direcciones_guardadas || []), direccion])).slice(0, 10),
    }))
    setNuevaDireccionGuardada('')
  }

  function quitarDireccionGuardada(direccion) {
    setFormPerfil((actual) => ({
      ...actual,
      direcciones_guardadas: (actual.direcciones_guardadas || []).filter((item) => item !== direccion),
    }))
  }

  return (
    <div className="section-shell py-12">
      <div className="surface-panel p-6 sm:p-7">
        <div className="section-kicker">Perfil</div>
        <h1 className="mt-2 font-urbana text-4xl tracking-wide sm:text-5xl">Tu cuenta</h1>
        <p className="mt-3 max-w-3xl text-sm leading-7 text-claro/65 sm:text-base">
          Administra tus datos, direcciones, pedidos, notificaciones, mensajes y favoritos desde un solo lugar.
        </p>
      </div>

      <div className="mt-8 grid gap-6 xl:grid-cols-[390px_minmax(0,1fr)]">
        <div className="grid gap-6 h-fit">
          <div className="surface-panel p-7 lg:p-8">
            <div className="flex items-center justify-between gap-3">
              <div className="text-sm font-semibold text-dorado">Datos</div>
              <button
                type="button"
                onClick={() => setEditandoPerfil((valor) => !valor)}
                className="rounded-xl border border-grisOscuro bg-oscuro/40 px-4 py-2 text-xs text-claro/70 transition hover:border-dorado/40 hover:text-doradoClaro"
              >
                {editandoPerfil ? 'Cancelar' : 'Editar perfil'}
              </button>
            </div>

            {editandoPerfil ? (
              <form onSubmit={guardarPerfil} className="mt-4 grid gap-3">
                <input
                  value={formPerfil.nombre_completo}
                  onChange={(e) => setFormPerfil((actual) => ({ ...actual, nombre_completo: e.target.value }))}
                  placeholder="Nombre completo"
                  className="rounded-xl border border-grisOscuro bg-oscuro/40 px-4 py-3 text-sm text-claro placeholder:text-claro/40 focus:border-dorado/50 focus:outline-none"
                  required
                />
                <input
                  value={formPerfil.email}
                  onChange={(e) => setFormPerfil((actual) => ({ ...actual, email: e.target.value }))}
                  placeholder="Correo"
                  type="email"
                  className="rounded-xl border border-grisOscuro bg-oscuro/40 px-4 py-3 text-sm text-claro placeholder:text-claro/40 focus:border-dorado/50 focus:outline-none"
                  required
                />
                <input
                  value={formPerfil.telefono}
                  onChange={(e) =>
                    setFormPerfil((actual) => ({ ...actual, telefono: e.target.value.replace(/\D/g, '').slice(0, 10) }))
                  }
                  placeholder="Teléfono"
                  inputMode="numeric"
                  className="rounded-xl border border-grisOscuro bg-oscuro/40 px-4 py-3 text-sm text-claro placeholder:text-claro/40 focus:border-dorado/50 focus:outline-none"
                />
                <textarea
                  value={formPerfil.direccion}
                  onChange={(e) => setFormPerfil((actual) => ({ ...actual, direccion: e.target.value }))}
                  placeholder="Dirección"
                  rows={3}
                  className="rounded-xl border border-grisOscuro bg-oscuro/40 px-4 py-3 text-sm text-claro placeholder:text-claro/40 focus:border-dorado/50 focus:outline-none"
                  required
                />
                <div className="rounded-2xl border border-grisOscuro bg-oscuro/30 p-4">
                  <div className="text-xs text-claro/50">Direcciones guardadas</div>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {(formPerfil.direcciones_guardadas || []).map((direccion) => (
                      <div key={direccion} className="inline-flex items-center gap-2 rounded-full border border-grisOscuro bg-oscuro/40 px-3 py-2 text-xs text-claro/75">
                        <button
                          type="button"
                          onClick={() => setFormPerfil((actual) => ({ ...actual, direccion }))}
                          className="hover:text-doradoClaro"
                        >
                          {direccion}
                        </button>
                        <button type="button" onClick={() => quitarDireccionGuardada(direccion)} className="text-claro/45 hover:text-red-300">
                          Quitar
                        </button>
                      </div>
                    ))}
                  </div>
                  <div className="mt-3 flex flex-wrap gap-3">
                    <input
                      value={nuevaDireccionGuardada}
                      onChange={(e) => setNuevaDireccionGuardada(e.target.value)}
                      placeholder="Agregar otra dirección"
                      className="min-w-[220px] flex-1 rounded-xl border border-grisOscuro bg-oscuro/40 px-4 py-3 text-sm text-claro placeholder:text-claro/40 focus:border-dorado/50 focus:outline-none"
                    />
                    <button
                      type="button"
                      onClick={agregarDireccionGuardada}
                      className="rounded-xl border border-grisOscuro bg-oscuro/40 px-4 py-3 text-sm text-claro/75 transition hover:border-dorado/40 hover:text-doradoClaro"
                    >
                      Agregar
                    </button>
                  </div>
                </div>
                <button
                  type="submit"
                  disabled={guardandoPerfil}
                  className={`rounded-xl px-5 py-3 font-semibold transition ${
                    guardandoPerfil ? 'bg-grisMedio/40 text-claro/50' : 'bg-dorado text-oscuro hover:bg-doradoClaro'
                  }`}
                >
                  {guardandoPerfil ? 'Guardando...' : 'Guardar perfil'}
                </button>
              </form>
            ) : (
              <div className="mt-4 space-y-2 text-sm text-claro/75">
                <div>
                  <span className="text-claro/50">Nombre:</span> {usuario?.nombre_completo}
                </div>
                <div>
                  <span className="text-claro/50">Correo:</span> {usuario?.email}
                </div>
                <div>
                  <span className="text-claro/50">Teléfono:</span> {usuario?.telefono || '—'}
                </div>
                <div>
                  <span className="text-claro/50">Dirección:</span> {usuario?.direccion || '—'}
                </div>
                <div>
                  <span className="text-claro/50">Direcciones guardadas:</span>{' '}
                  {(usuario?.direcciones_guardadas || []).length > 0
                    ? (usuario?.direcciones_guardadas || []).join(' | ')
                    : '—'}
                </div>
              </div>
            )}
          </div>

          <form onSubmit={guardarPassword} className="surface-panel p-7 lg:p-8">
            <div className="text-sm text-dorado font-semibold">Cambiar contraseña</div>
            {usuario?.password_temporal ? (
              <div className="mt-3 text-sm text-claro/70">
                Tienes una contraseña temporal. Cámbiala lo antes posible.
              </div>
            ) : null}
            <div className="mt-4 grid gap-3">
              <input
                value={formPassword.password_actual}
                onChange={(e) => setFormPassword((f) => ({ ...f, password_actual: e.target.value }))}
                placeholder="Contraseña actual"
                type="password"
                className="rounded-xl border border-grisOscuro bg-oscuro/40 px-4 py-3 text-sm text-claro placeholder:text-claro/40 focus:outline-none focus:border-dorado/50"
                required
              />
              <input
                value={formPassword.password}
                onChange={(e) => setFormPassword((f) => ({ ...f, password: e.target.value }))}
                placeholder="Nueva contraseña (mín. 8)"
                type="password"
                className="rounded-xl border border-grisOscuro bg-oscuro/40 px-4 py-3 text-sm text-claro placeholder:text-claro/40 focus:outline-none focus:border-dorado/50"
                required
              />
              <input
                value={formPassword.password_confirmation}
                onChange={(e) => setFormPassword((f) => ({ ...f, password_confirmation: e.target.value }))}
                placeholder="Confirmar nueva contraseña"
                type="password"
                className="rounded-xl border border-grisOscuro bg-oscuro/40 px-4 py-3 text-sm text-claro placeholder:text-claro/40 focus:outline-none focus:border-dorado/50"
                required
              />
              <button
                type="submit"
                disabled={guardandoPassword}
                className={`rounded-xl px-5 py-3 font-semibold transition ${
                  guardandoPassword ? 'bg-grisMedio/40 text-claro/50' : 'bg-dorado text-oscuro hover:bg-doradoClaro'
                }`}
              >
                {guardandoPassword ? 'Guardando...' : 'Actualizar contraseña'}
              </button>
            </div>
          </form>
        </div>

        <div className="grid gap-6">
          <div className="surface-panel p-7 lg:p-8">
            <div className="flex items-center justify-between gap-4">
              <div>
                <div className="text-sm font-semibold text-dorado">Productos favoritos</div>
                <div className="mt-1 text-sm text-claro/60">Guarda tus prendas preferidas para encontrarlas rápido.</div>
              </div>
              <Link to={rutas.catalogo} className="text-sm text-claro/70 hover:text-doradoClaro">
                Explorar
              </Link>
            </div>

            {favoritos.length === 0 ? (
              <div className="mt-5 text-sm text-claro/70">Aún no tienes productos favoritos.</div>
            ) : (
              <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-5">
                {favoritosRecientes.map((producto) => (
                  <TarjetaProducto key={producto.id} producto={producto} />
                ))}
              </div>
            )}
          </div>

          <div className="surface-panel p-7 lg:p-8">
            <div className="text-sm text-dorado font-semibold">Historial de pedidos</div>
            {cargando ? (
              <CargadorSpinner />
            ) : (
              <div className="mt-5 grid gap-4">
                {pedidos.length === 0 ? (
                  <div className="text-sm text-claro/70">Aún no tienes pedidos.</div>
                ) : (
                  pedidos.map((p) => (
                    <div key={p.id} className="rounded-2xl border border-grisOscuro bg-grisOscuro/40 p-5">
                      {(() => {
                        const estadoPago = p.estado_pago || (p.proveedor_pago === 'wompi' ? 'pendiente' : null)
                        const checkoutResultado = `${rutas.checkoutResultado}?pedido_id=${p.id}`
                        const puedeContinuarPago =
                          p.proveedor_pago === 'wompi' && estadoPago === 'pendiente' && typeof p.wompi_checkout_url === 'string'

                        return (
                          <>
                      <div className="flex flex-wrap items-center justify-between gap-3">
                        <div className="text-sm text-claro/80">
                          Pedido <span className="text-claro font-semibold">#{p.id}</span>
                        </div>
                        <div className="text-xs rounded-full px-3 py-1 bg-dorado/15 text-dorado border border-dorado/30">
                          {p.estado}
                        </div>
                      </div>
                      <div className="mt-3 text-sm text-claro/70">
                        Total: <span className="text-dorado font-semibold">{formatearMoneda(p.total)}</span>
                      </div>
                      {Number(p.descuento_total || 0) > 0 ? (
                        <div className="mt-1 text-xs text-emerald-300">
                          Cupón {p.cupon_codigo}: -{formatearMoneda(p.descuento_total)}
                        </div>
                      ) : null}
                      {estadoPago ? (
                        <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-claro/70">
                          <span className="text-claro/50">Pago</span>
                          <span className={`rounded-full border px-3 py-1 font-semibold ${obtenerClaseEstadoPago(estadoPago)}`}>
                            {capitalizarEstado(estadoPago)}
                          </span>
                          <span className="text-claro/50">{p.metodo_pago || 'Wompi'}</span>
                        </div>
                      ) : null}
                      <div className="mt-4">
                        <SeguimientoPedido estado={p.estado} />
                      </div>
                      <div className="mt-4 flex flex-wrap gap-3">
                        {p.proveedor_pago === 'wompi' ? (
                          <Link
                            to={checkoutResultado}
                            className="inline-flex items-center justify-center rounded-xl border border-grisOscuro bg-oscuro/40 px-4 py-2 text-sm text-claro/70 hover:border-dorado/40 hover:text-doradoClaro transition"
                          >
                            Ver estado del pago
                          </Link>
                        ) : null}
                        {puedeContinuarPago ? (
                          <a
                            href={p.wompi_checkout_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center justify-center rounded-xl bg-dorado px-4 py-2 text-sm font-semibold text-oscuro transition hover:bg-doradoClaro"
                          >
                            Continuar pago
                          </a>
                        ) : null}
                        <Link
                          to={rutas.recibo(p.id)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center justify-center rounded-xl border border-grisOscuro bg-oscuro/40 px-4 py-2 text-sm text-claro/70 hover:border-dorado/40 hover:text-doradoClaro transition"
                        >
                          Imprimir recibo
                        </Link>
                      </div>
                      <div className="mt-4 grid gap-2 text-sm text-claro/70">
                        {(p.detalles || []).map((d) => (
                          <div key={d.id} className="flex justify-between gap-4">
                            <span className="truncate">{d.producto?.nombre} × {d.cantidad}</span>
                            <span className="text-claro/90 font-semibold">
                              {formatearMoneda(Number(d.precio_unitario) * d.cantidad)}
                            </span>
                          </div>
                        ))}
                      </div>
                          </>
                        )
                      })()}
                    </div>
                  ))
                )}
              </div>
            )}
          </div>

          <div className="surface-panel p-7 lg:p-8">
            <div className="flex items-center justify-between gap-4">
              <div className="text-sm text-dorado font-semibold">Notificaciones</div>
              <button
                type="button"
                onClick={async () => {
                  setCargandoNotificaciones(true)
                  try {
                    const datos = await listarNotificaciones()
                    setNotificaciones(datos.notificaciones?.data || [])
                  } catch {
                    toast.error('No se pudieron cargar las notificaciones')
                  } finally {
                    setCargandoNotificaciones(false)
                  }
                }}
                className="text-sm text-claro/70 hover:text-doradoClaro"
              >
                Recargar
              </button>
            </div>

            {cargandoNotificaciones ? (
              <CargadorSpinner />
            ) : notificaciones.length === 0 ? (
              <div className="mt-5 text-sm text-claro/70">Aún no tienes notificaciones.</div>
            ) : (
              <div className="mt-5 grid gap-3">
                {notificaciones.slice(0, 8).map((n) => (
                  <button
                    key={n.id}
                    type="button"
                    onClick={() => marcarNotificacion(n)}
                    className={`text-left rounded-2xl border px-4 py-4 transition ${
                      n.leido_en ? 'border-grisOscuro bg-oscuro/30 text-claro/65' : 'border-dorado/30 bg-dorado/10 text-claro/85'
                    }`}
                  >
                    <div className="font-semibold">{n.titulo}</div>
                    {n.cuerpo ? <div className="mt-1 text-sm text-claro/70">{n.cuerpo}</div> : null}
                    <div className="mt-2 text-xs text-claro/50">{n.leido_en ? 'Leída' : 'Nueva'}</div>
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="surface-panel p-7 lg:p-8">
            <div className="flex items-center justify-between gap-4">
              <div className="text-sm text-dorado font-semibold">Mensajes</div>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={async () => {
                    setCargandoMensajes(true)
                    try {
                      const datos = await listarMensajesCliente()
                      setMensajes(datos.mensajes?.data || [])
                    } catch {
                      toast.error('No se pudieron cargar los mensajes')
                    } finally {
                      setCargandoMensajes(false)
                    }
                  }}
                  className="text-sm text-claro/70 hover:text-doradoClaro"
                >
                  Recargar
                </button>
                <Link to={rutas.contacto} className="text-sm text-claro/70 hover:text-doradoClaro">
                  Enviar mensaje
                </Link>
              </div>
            </div>

            {cargandoMensajes ? (
              <CargadorSpinner />
            ) : mensajes.length === 0 ? (
              <div className="mt-5 text-sm text-claro/70">Aún no tienes mensajes.</div>
            ) : (
              <div className="mt-5 grid gap-4">
                {mensajes.map((m) => (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => marcarLeido(m)}
                    className="text-left rounded-2xl border border-grisOscuro bg-grisOscuro/40 p-5 hover:border-dorado/40 transition"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <div className="text-sm text-claro/80">
                        Mensaje <span className="text-claro font-semibold">#{m.id}</span>
                      </div>
                      {m.respuesta ? (
                        <div
                          className={`text-xs rounded-full px-3 py-1 border ${
                            m.leido_cliente ? 'bg-oscuro/40 text-claro/60 border-grisOscuro' : 'bg-dorado/15 text-doradoClaro border-dorado/30'
                          }`}
                        >
                          {m.leido_cliente ? 'Respondido' : 'Nueva respuesta'}
                        </div>
                      ) : (
                        <div className="text-xs rounded-full px-3 py-1 border bg-oscuro/40 text-claro/60 border-grisOscuro">
                          Enviado
                        </div>
                      )}
                    </div>

                    <div className="mt-3 text-sm text-claro/70 whitespace-pre-wrap">{m.mensaje}</div>

                    {m.respuesta ? (
                      <div className="mt-4 rounded-2xl border border-grisOscuro bg-oscuro/40 p-4">
                        <div className="text-xs text-claro/50">Respuesta</div>
                        <div className="mt-2 text-sm text-claro/80 whitespace-pre-wrap">{m.respuesta}</div>
                      </div>
                    ) : (
                      <div className="mt-4 text-xs text-claro/50">Aún no hay respuesta.</div>
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
