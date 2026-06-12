import { useEffect, useMemo, useState } from 'react'
import toast from 'react-hot-toast'
import { usarAutenticacion } from '../../hooks/usarAutenticacion'
import { usarCarrito } from '../../hooks/usarCarrito'
import { crearCheckoutWompi } from '../../servicios/pedidoServicio'
import { actualizarPerfil } from '../../servicios/autenticacionServicio'
import { validarCupon } from '../../servicios/cuponServicio'
import { formatearMoneda } from '../../utilidades/formatearMoneda'

function extraerMensaje(error, fallback) {
  const data = error?.response?.data
  const primerCampo = data?.errors ? Object.keys(data.errors)[0] : null
  const primerError = primerCampo ? data.errors[primerCampo]?.[0] : null
  if (typeof primerError === 'string') return primerError
  if (typeof data?.mensaje === 'string') return data.mensaje
  return fallback
}

export function Checkout() {
  const { usuario, actualizarUsuario } = usarAutenticacion()
  const { items, subtotal, obtenerStockDisponible } = usarCarrito()

  const [direccionEnvio, setDireccionEnvio] = useState(usuario?.direccion || '')
  const [enviando, setEnviando] = useState(false)
  const [guardarDireccion, setGuardarDireccion] = useState(false)
  const [cuponCodigo, setCuponCodigo] = useState('')
  const [cuponAplicado, setCuponAplicado] = useState(null)
  const [validandoCupon, setValidandoCupon] = useState(false)

  useEffect(() => {
    setDireccionEnvio(usuario?.direccion || '')
  }, [usuario?.direccion])

  useEffect(() => {
    setCuponAplicado(null)
  }, [subtotal, items.length])

  const direccionesGuardadas = useMemo(() => {
    const direcciones = Array.isArray(usuario?.direcciones_guardadas) ? usuario.direcciones_guardadas : []
    return direcciones.filter(Boolean)
  }, [usuario?.direcciones_guardadas])

  const descuentoAplicado = Number(cuponAplicado?.descuento || 0)
  const totalFinal = Math.max(0, subtotal - descuentoAplicado)

  async function aplicarCuponCheckout() {
    if (!cuponCodigo.trim()) {
      toast.error('Ingresa un cupón')
      return
    }

    setValidandoCupon(true)
    try {
      const datos = await validarCupon({
        codigo: cuponCodigo.trim(),
        subtotal,
      })
      setCuponAplicado(datos.cupon)
      setCuponCodigo(datos.cupon?.codigo || cuponCodigo.trim().toUpperCase())
      toast.success('Cupón aplicado')
    } catch (error) {
      setCuponAplicado(null)
      toast.error(extraerMensaje(error, 'No se pudo aplicar el cupón'))
    } finally {
      setValidandoCupon(false)
    }
  }

  async function iniciarPago() {
    if (items.length === 0) {
      toast.error('Tu carrito está vacío')
      return
    }

    const itemSinTalla = items.find((item) => {
      const variantes = Array.isArray(item.producto?.variantes) ? item.producto.variantes.filter((variante) => variante.estado !== 'inactivo') : []
      return variantes.length > 0 && !item.variante_id
    })

    if (itemSinTalla) {
      toast.error(`Selecciona una talla para ${itemSinTalla.producto.nombre}`)
      return
    }

    const itemSinStock = items.find(
      (item) => item.cantidad > obtenerStockDisponible(item.producto, item.variante_id || null, item.talla)
    )

    if (itemSinStock) {
      toast.error(`Ajusta la cantidad de ${itemSinStock.producto.nombre} antes de continuar`)
      return
    }

    if (direccionEnvio.trim().length < 8) {
      toast.error('La dirección de envío es obligatoria')
      return
    }

    setEnviando(true)
    try {
      const direccionNormalizada = direccionEnvio.trim()

      if (guardarDireccion && usuario) {
        const direccionesActuales = Array.isArray(usuario.direcciones_guardadas) ? usuario.direcciones_guardadas : []
        const direccionesGuardadasActualizadas = Array.from(new Set([direccionNormalizada, ...direccionesActuales])).slice(0, 10)
        const respuestaPerfil = await actualizarPerfil({
          nombre_completo: usuario.nombre_completo || '',
          email: usuario.email || '',
          telefono: usuario.telefono || '',
          direccion: direccionNormalizada,
          direcciones_guardadas: direccionesGuardadasActualizadas,
        })
        actualizarUsuario(respuestaPerfil.usuario)
      }

      const datos = await crearCheckoutWompi({
        direccion_envio: direccionNormalizada,
        cupon_codigo: cuponAplicado?.codigo || undefined,
        items: items.map((i) => ({
          producto_id: i.producto.id,
          variante_id: i.variante_id || undefined,
          cantidad: i.cantidad,
        })),
      })

      const checkoutUrl =
        datos?.checkout_url ||
        datos?.link_pago?.permalink ||
        datos?.link_pago?.url ||
        datos?.link_pago?.public_url ||
        (datos?.link_pago?.id ? `https://checkout.wompi.co/l/${datos.link_pago.id}` : null)

      if (!checkoutUrl) {
        toast.error('Wompi no devolvió un enlace de pago válido')
        return
      }

      window.location.href = checkoutUrl
    } catch (error) {
      toast.error(extraerMensaje(error, 'No se pudo iniciar el pago con Wompi'))
    } finally {
      setEnviando(false)
    }
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-12">
      <div className="text-dorado text-xs tracking-widest">CHECKOUT</div>
      <h1 className="mt-2 font-urbana text-4xl tracking-wide">Pagar con Wompi</h1>

      <div className="mt-10 grid gap-6 md:grid-cols-2">
        <div className="rounded-3xl border border-grisOscuro bg-grisOscuro/40 p-7">
          <div className="text-sm text-dorado font-semibold">Datos de envío</div>
          <div className="mt-4 grid gap-3">
            {direccionesGuardadas.length > 0 ? (
              <div className="rounded-2xl border border-grisOscuro bg-oscuro/30 p-4">
                <div className="text-xs text-claro/50">Direcciones guardadas</div>
                <div className="mt-3 flex flex-wrap gap-2">
                  {direccionesGuardadas.map((direccion) => (
                    <button
                      key={direccion}
                      type="button"
                      onClick={() => setDireccionEnvio(direccion)}
                      className={`rounded-xl border px-3 py-2 text-xs transition ${
                        direccionEnvio === direccion
                          ? 'border-dorado bg-dorado/10 text-doradoClaro'
                          : 'border-grisOscuro bg-oscuro/40 text-claro/70 hover:border-dorado/40 hover:text-doradoClaro'
                      }`}
                    >
                      {direccion}
                    </button>
                  ))}
                </div>
              </div>
            ) : null}
            <input
              value={direccionEnvio}
              onChange={(e) => setDireccionEnvio(e.target.value)}
              placeholder="Dirección de envío"
              className="rounded-xl border border-grisOscuro bg-oscuro/40 px-4 py-3 text-sm text-claro placeholder:text-claro/40 focus:outline-none focus:border-dorado/50"
              required
            />
            <label className="flex items-center gap-3 rounded-2xl border border-grisOscuro bg-oscuro/30 px-4 py-3 text-sm text-claro/70">
              <input
                type="checkbox"
                checked={guardarDireccion}
                onChange={(e) => setGuardarDireccion(e.target.checked)}
                className="h-4 w-4 accent-[#d4af37]"
              />
              Guardar esta dirección para próximas compras
            </label>
            <div className="rounded-2xl border border-grisOscuro bg-oscuro/30 p-4">
              <div className="text-xs text-claro/50">Cupón</div>
              <div className="mt-3 flex flex-wrap gap-3">
                <input
                  value={cuponCodigo}
                  onChange={(e) => setCuponCodigo(e.target.value.toUpperCase())}
                  placeholder="Código de cupón"
                  className="min-w-[220px] flex-1 rounded-xl border border-grisOscuro bg-oscuro/40 px-4 py-3 text-sm text-claro placeholder:text-claro/40 focus:outline-none focus:border-dorado/50"
                />
                <button
                  type="button"
                  onClick={aplicarCuponCheckout}
                  disabled={validandoCupon}
                  className={`rounded-xl px-4 py-3 text-sm font-semibold transition ${
                    validandoCupon ? 'bg-grisMedio/40 text-claro/50' : 'bg-dorado text-oscuro hover:bg-doradoClaro'
                  }`}
                >
                  {validandoCupon ? 'Validando...' : 'Aplicar'}
                </button>
              </div>
              {cuponAplicado ? (
                <div className="mt-3 rounded-xl border border-emerald-500/20 bg-emerald-500/10 px-3 py-2 text-xs text-emerald-200">
                  Cupón {cuponAplicado.codigo} aplicado: descuento de {formatearMoneda(cuponAplicado.descuento)}
                </div>
              ) : null}
            </div>
            <div className="rounded-3xl border border-dorado/20 bg-oscuro/50 p-5 text-sm text-claro/75">
              <div className="font-semibold text-claro">Método de pago</div>
              <div className="mt-2 text-claro/70">
                Serás redirigido al checkout seguro de Wompi para completar el pago con los métodos que tengas habilitados en tu cuenta.
              </div>
              <div className="mt-3 inline-flex rounded-full border border-dorado/30 bg-dorado/10 px-3 py-1 text-xs font-semibold text-doradoClaro">
                Contraentrega desactivado
              </div>
            </div>
            <div className="rounded-3xl border border-grisOscuro bg-oscuro/30 p-4 text-xs text-claro/60">
              Al iniciar el pago, el pedido queda creado en estado pendiente y el stock se reserva mientras completas la transacción.
            </div>
          </div>

          <button
            type="button"
            disabled={enviando}
            onClick={iniciarPago}
            className={`mt-6 w-full rounded-2xl px-5 py-4 font-semibold transition ${
              enviando ? 'bg-grisMedio/40 text-claro/50' : 'bg-dorado text-oscuro hover:bg-doradoClaro'
            }`}
          >
            {enviando ? 'Redirigiendo...' : 'Continuar con Wompi'}
          </button>
        </div>

        <div className="rounded-3xl border border-grisOscuro bg-oscuro/40 p-7">
          <div className="text-sm text-dorado font-semibold">Resumen</div>
          <div className="mt-4 grid gap-3 text-sm text-claro/75">
            {items.map((i) => {
              const precioFinalItem = Number(i.producto.precio_final || i.producto.precio || 0)

              return (
                <div key={`${i.producto.id}-${i.talla || 'sin-talla'}`} className="flex justify-between gap-4">
                  <span className="truncate">
                    {i.producto.nombre}
                    {i.talla ? ` (${i.talla})` : ''} × {i.cantidad}
                  </span>
                  <span className="text-claro/90 font-semibold">{formatearMoneda(precioFinalItem * i.cantidad)}</span>
                </div>
              )
            })}
          </div>
          <div className="mt-6 border-t border-grisOscuro pt-4 flex justify-between text-sm text-claro/70">
            <span>Subtotal</span>
            <span className="text-claro/90 font-semibold">{formatearMoneda(subtotal)}</span>
          </div>
          {descuentoAplicado > 0 ? (
            <div className="mt-3 flex justify-between text-sm text-claro/70">
              <span>Descuento</span>
              <span className="font-semibold text-emerald-300">- {formatearMoneda(descuentoAplicado)}</span>
            </div>
          ) : null}
          <div className="mt-3 border-t border-grisOscuro pt-4 flex justify-between text-sm text-claro/70">
            <span>Total</span>
            <span className="text-dorado font-semibold">{formatearMoneda(totalFinal)}</span>
          </div>
          <div className="mt-6 rounded-2xl border border-grisOscuro bg-grisOscuro/20 p-4 text-xs text-claro/60">
            Después del pago volverás automáticamente a la tienda para ver el resultado y el estado del pedido.
          </div>
        </div>
      </div>
    </div>
  )
}
