import { useEffect, useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import toast from 'react-hot-toast'
import { obtenerPedidoCliente } from '../../servicios/pedidoServicio'
import { formatearMoneda } from '../../utilidades/formatearMoneda'
import { rutas } from '../../constantes/rutas'

function formatearFecha(valor) {
  const fecha = valor ? new Date(valor) : null
  if (!fecha || Number.isNaN(fecha.getTime())) return '—'
  return fecha.toLocaleString()
}

function capitalizarEstado(valor) {
  return String(valor || '—')
    .replaceAll('_', ' ')
    .replace(/\b\w/g, (letra) => letra.toUpperCase())
}

export function Recibo() {
  const { id } = useParams()
  const [cargando, setCargando] = useState(true)
  const [pedido, setPedido] = useState(null)

  useEffect(() => {
    let activo = true

    async function cargar() {
      setCargando(true)
      try {
        const datos = await obtenerPedidoCliente(id)
        if (activo) setPedido(datos.pedido || null)
      } catch {
        toast.error('No se pudo cargar el recibo')
      } finally {
        if (activo) setCargando(false)
      }
    }

    cargar()

    return () => {
      activo = false
    }
  }, [id])

  const detalles = useMemo(() => pedido?.detalles || [], [pedido])

  return (
    <div className="min-h-screen bg-white text-[#111]">
      <style>{`
        @page { margin: 12mm; }
        @media print {
          .no-imprimir { display: none !important; }
          body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
        }
      `}</style>

      <div className="no-imprimir border-b border-black/10 bg-white">
        <div className="mx-auto max-w-3xl px-4 py-4 flex items-center justify-between gap-4">
          <Link to={rutas.perfil} className="text-sm text-black/70 hover:text-black">
            Volver
          </Link>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => window.print()}
              className="rounded-xl bg-black px-4 py-2 text-sm font-semibold text-white hover:bg-black/90 transition"
            >
              Imprimir / Guardar PDF
            </button>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-3xl px-4 py-8">
        <div className="flex items-start justify-between gap-6">
          <div>
            <div className="text-xs tracking-widest text-black/60">RECIBO</div>
            <div className="mt-1 text-2xl font-semibold">JD Store</div>
            <div className="mt-2 text-sm text-black/70">Pedido #{id}</div>
          </div>
          <div className="text-right text-sm text-black/70">
            <div>Fecha: {formatearFecha(pedido?.fecha)}</div>
            <div className="mt-1">Estado: {capitalizarEstado(pedido?.estado)}</div>
          </div>
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <div className="rounded-2xl border border-black/10 p-4">
            <div className="text-xs font-semibold text-black/60">Entrega</div>
            <div className="mt-2 text-sm">
              <div className="text-black/80">{pedido?.direccion_envio || '—'}</div>
            </div>
          </div>
          <div className="rounded-2xl border border-black/10 p-4">
            <div className="text-xs font-semibold text-black/60">Pago</div>
            <div className="mt-2 text-sm text-black/80">{pedido?.metodo_pago || '—'}</div>
            {pedido?.estado_pago ? (
              <div className="mt-1 text-xs text-black/60">
                Estado del pago: <span className="font-semibold text-black/80">{capitalizarEstado(pedido.estado_pago)}</span>
              </div>
            ) : null}
          </div>
        </div>

        <div className="mt-6 rounded-2xl border border-black/10 overflow-hidden">
          <div className="bg-black/5 px-4 py-3 text-sm font-semibold text-black/70">Detalle de compra</div>
          {cargando ? (
            <div className="px-4 py-6 text-sm text-black/60">Cargando...</div>
          ) : detalles.length === 0 ? (
            <div className="px-4 py-6 text-sm text-black/60">Sin productos.</div>
          ) : (
            <div className="divide-y divide-black/10">
              {detalles.map((d) => (
                <div key={d.id} className="px-4 py-4 flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <div className="text-sm font-semibold text-black/90 truncate">{d.producto?.nombre || 'Producto'}</div>
                    <div className="mt-1 text-xs text-black/60">
                      Cantidad: <span className="text-black/80 font-semibold">{d.cantidad}</span>
                    </div>
                    {d.talla ? (
                      <div className="mt-1 text-xs text-black/60">
                        Talla: <span className="text-black/80 font-semibold">{d.talla}</span>
                      </div>
                    ) : null}
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-semibold text-black/90">
                      {formatearMoneda(Number(d.precio_unitario) * Number(d.cantidad))}
                    </div>
                    <div className="mt-1 text-xs text-black/60">{formatearMoneda(Number(d.precio_unitario))} c/u</div>
                  </div>
                </div>
              ))}
            </div>
          )}
          <div className="border-t border-black/10 bg-black/5 px-4 py-4">
            <div className="flex items-center justify-between text-sm text-black/70">
              <div>Subtotal</div>
              <div className="font-semibold text-black">{formatearMoneda(Number(pedido?.subtotal || pedido?.total || 0))}</div>
            </div>
            {Number(pedido?.descuento_total || 0) > 0 ? (
              <div className="mt-2 flex items-center justify-between text-sm text-black/70">
                <div>Descuento {pedido?.cupon_codigo ? `(${pedido.cupon_codigo})` : ''}</div>
                <div className="font-semibold text-black">- {formatearMoneda(Number(pedido?.descuento_total || 0))}</div>
              </div>
            ) : null}
            <div className="mt-3 flex items-center justify-between">
              <div className="text-sm text-black/70">Total</div>
              <div className="text-lg font-semibold text-black">{formatearMoneda(Number(pedido?.total || 0))}</div>
            </div>
          </div>
        </div>

        <div className="mt-6 text-xs text-black/50">
          Este recibo es un comprobante de compra. Para guardar en PDF, usa “Imprimir / Guardar PDF” y selecciona “Guardar como PDF”.
        </div>
      </div>
    </div>
  )
}
