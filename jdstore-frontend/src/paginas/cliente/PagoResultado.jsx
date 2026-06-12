import { useEffect, useMemo, useRef, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import toast from 'react-hot-toast'
import { rutas } from '../../constantes/rutas'
import { usarCarrito } from '../../hooks/usarCarrito'
import { obtenerPedidoCliente, sincronizarPedidoWompi } from '../../servicios/pedidoServicio'
import { formatearMoneda } from '../../utilidades/formatearMoneda'

function obtenerDescripcionEstado(estadoPago, estadoPedido) {
  if (estadoPago === 'aprobado') {
    return {
      titulo: 'Pago aprobado',
      detalle: 'Tu pago fue confirmado y el pedido ya pasó a preparación.',
      clase: 'border-emerald-500/30 bg-emerald-500/10 text-emerald-200',
    }
  }

  if (['rechazado', 'anulado', 'error'].includes(estadoPago) || estadoPedido === 'cancelado') {
    return {
      titulo: 'Pago no completado',
      detalle: 'La transacción no quedó aprobada. Puedes volver al checkout e intentarlo otra vez.',
      clase: 'border-red-500/30 bg-red-500/10 text-red-200',
    }
  }

  return {
    titulo: 'Pago en proceso',
    detalle: 'Estamos confirmando el resultado de la transacción con Wompi.',
    clase: 'border-dorado/30 bg-dorado/10 text-doradoClaro',
  }
}

export function PagoResultado() {
  const [searchParams] = useSearchParams()
  const { limpiarCarrito } = usarCarrito()
  const [cargando, setCargando] = useState(true)
  const [pedido, setPedido] = useState(null)
  const limpioRef = useRef(false)

  const pedidoId = searchParams.get('pedido_id')
  const transactionId = searchParams.get('id')

  useEffect(() => {
    let activo = true
    let temporizador = null
    let intentos = 0

    async function cargarPedido() {
      if (!pedidoId) {
        if (activo) setCargando(false)
        return
      }

      try {
        const datos = transactionId
          ? await sincronizarPedidoWompi(pedidoId, transactionId)
          : await obtenerPedidoCliente(pedidoId)

        if (!activo) return

        const pedidoActual = datos?.pedido || null
        setPedido(pedidoActual)

        const siguePendiente =
          pedidoActual &&
          pedidoActual.proveedor_pago === 'wompi' &&
          !['aprobado', 'rechazado', 'anulado', 'error'].includes(pedidoActual.estado_pago)

        if (siguePendiente && intentos < 5) {
          intentos += 1
          temporizador = window.setTimeout(cargarPedido, 2500)
        }
      } catch {
        if (activo) toast.error('No se pudo validar el estado del pago')
      } finally {
        if (activo) setCargando(false)
      }
    }

    cargarPedido()

    return () => {
      activo = false
      if (temporizador) window.clearTimeout(temporizador)
    }
  }, [pedidoId, transactionId])

  useEffect(() => {
    if (!pedido || limpioRef.current) return
    if (pedido.estado_pago === 'aprobado') {
      limpiarCarrito()
      limpioRef.current = true
    }
  }, [limpiarCarrito, pedido])

  const estado = useMemo(
    () => obtenerDescripcionEstado(pedido?.estado_pago, pedido?.estado),
    [pedido?.estado, pedido?.estado_pago]
  )

  if (!pedidoId) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-12">
        <div className="rounded-3xl border border-grisOscuro bg-grisOscuro/40 p-8 text-claro/75">
          No encontramos el pedido asociado a este retorno de pago.
        </div>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-12">
      <div className="text-dorado text-xs tracking-widest">WOMPI</div>
      <h1 className="mt-2 font-urbana text-4xl tracking-wide">Resultado del pago</h1>

      <div className={`mt-8 rounded-3xl border p-6 ${estado.clase}`}>
        <div className="text-xl font-semibold">{estado.titulo}</div>
        <div className="mt-2 text-sm opacity-90">{estado.detalle}</div>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="rounded-3xl border border-grisOscuro bg-grisOscuro/40 p-6">
          <div className="text-sm font-semibold text-dorado">Pedido</div>
          {cargando ? (
            <div className="mt-4 text-sm text-claro/60">Consultando estado del pedido...</div>
          ) : (
            <div className="mt-4 grid gap-3 text-sm text-claro/75">
              <div className="flex justify-between gap-4">
                <span>Pedido</span>
                <span className="font-semibold text-claro">#{pedido?.id || pedidoId}</span>
              </div>
              <div className="flex justify-between gap-4">
                <span>Estado del pedido</span>
                <span className="font-semibold text-claro">{pedido?.estado || 'pendiente'}</span>
              </div>
              <div className="flex justify-between gap-4">
                <span>Estado del pago</span>
                <span className="font-semibold text-claro">{pedido?.estado_pago || 'pendiente'}</span>
              </div>
              <div className="flex justify-between gap-4">
                <span>Método</span>
                <span className="font-semibold text-claro">{pedido?.metodo_pago || 'Wompi'}</span>
              </div>
              <div className="flex justify-between gap-4">
                <span>Total</span>
                <span className="font-semibold text-dorado">{formatearMoneda(Number(pedido?.total || 0))}</span>
              </div>
            </div>
          )}
        </div>

        <div className="rounded-3xl border border-grisOscuro bg-oscuro/40 p-6">
          <div className="text-sm font-semibold text-dorado">Siguiente paso</div>
          <div className="mt-4 grid gap-3 text-sm text-claro/70">
            <Link
              to={rutas.perfil}
              className="rounded-2xl bg-dorado px-4 py-3 text-center font-semibold text-oscuro transition hover:bg-doradoClaro"
            >
              Ver mis pedidos
            </Link>
            {pedido?.estado_pago === 'aprobado' ? (
              <Link
                to={rutas.recibo(pedido?.id)}
                className="rounded-2xl border border-grisOscuro px-4 py-3 text-center font-semibold text-claro transition hover:border-dorado/40 hover:text-doradoClaro"
              >
                Ver recibo
              </Link>
            ) : (
              <Link
                to={rutas.checkout}
                className="rounded-2xl border border-grisOscuro px-4 py-3 text-center font-semibold text-claro transition hover:border-dorado/40 hover:text-doradoClaro"
              >
                Intentar de nuevo
              </Link>
            )}
            <Link
              to={rutas.carrito}
              className="rounded-2xl border border-grisOscuro px-4 py-3 text-center font-semibold text-claro/80 transition hover:border-dorado/40 hover:text-doradoClaro"
            >
              Volver al carrito
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
