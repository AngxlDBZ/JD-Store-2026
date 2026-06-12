import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { actualizarEstadoPedido, listarPedidosAdmin } from '../../servicios/pedidoServicio'
import { formatearMoneda } from '../../utilidades/formatearMoneda'
import { TarjetaEstadistica } from '../../componentes/admin/TarjetaEstadistica'

const estados = ['pendiente', 'en_preparacion', 'enviado', 'completado', 'cancelado']

function crearFiltrosIniciales() {
  return {
    buscar: '',
    estado: '',
    desde: '',
    hasta: '',
  }
}

function extraerMensajeError(error, fallback) {
  const mensaje = error?.response?.data?.mensaje
  return typeof mensaje === 'string' && mensaje.trim() ? mensaje : fallback
}

function capitalizarEstado(valor) {
  return String(valor || '—')
    .replaceAll('_', ' ')
    .replace(/\b\w/g, (letra) => letra.toUpperCase())
}

function resolverEstadoPago(pedido) {
  if (pedido?.estado_pago) return pedido.estado_pago
  return pedido?.proveedor_pago ? 'pendiente' : 'aprobado'
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

function obtenerOpcionesEstadoPedido(pedido) {
  if (!pedido?.estado_pago || pedido.estado_pago === 'aprobado') {
    return estados
  }

  if (pedido.estado === 'cancelado') {
    return ['cancelado']
  }

  return Array.from(new Set([pedido.estado, 'cancelado']))
}

export function GestionPedidos() {
  const [cargando, setCargando] = useState(true)
  const [pedidos, setPedidos] = useState([])
  const [resumen, setResumen] = useState(null)
  const [filtros, setFiltros] = useState(crearFiltrosIniciales())

  async function cargar() {
    setCargando(true)
    try {
      const datos = await listarPedidosAdmin({
        buscar: filtros.buscar || undefined,
        estado: filtros.estado || undefined,
        desde: filtros.desde || undefined,
        hasta: filtros.hasta || undefined,
      })
      setPedidos(datos.pedidos?.data || [])
      setResumen(datos.resumen || null)
    } catch {
      toast.error('No se pudieron cargar los pedidos')
    } finally {
      setCargando(false)
    }
  }

  useEffect(() => {
    cargar()
  }, [])

  async function cambiarEstado(pedidoId, estado) {
    try {
      await actualizarEstadoPedido(pedidoId, estado)
      toast.success('Estado actualizado')
      await cargar()
    } catch (error) {
      toast.error(extraerMensajeError(error, 'No se pudo actualizar el estado'))
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <div className="text-xs uppercase tracking-widest text-claro/50">Admin</div>
        <h1 className="mt-2 font-urbana text-3xl tracking-wide text-claro/90 sm:text-4xl">Pedidos</h1>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <TarjetaEstadistica titulo="Total pedidos" valor={resumen?.total ?? '—'} />
        <TarjetaEstadistica titulo="Pendientes" valor={resumen?.pendientes ?? '—'} />
        <TarjetaEstadistica titulo="Pagos pendientes" valor={resumen?.pagos_pendientes ?? '—'} />
        <TarjetaEstadistica titulo="Pagos fallidos" valor={resumen?.pagos_fallidos ?? '—'} />
      </div>

      <div className="rounded-2xl border border-grisOscuro bg-grisOscuro/40 p-5">
        <div className="grid gap-3 lg:grid-cols-[2fr_repeat(3,1fr)_auto_auto]">
          <input
            value={filtros.buscar}
            onChange={(e) => setFiltros((actual) => ({ ...actual, buscar: e.target.value }))}
            placeholder="Buscar por id, cliente o correo..."
            className="w-full rounded-xl border border-grisOscuro bg-oscuro/40 px-4 py-3 text-sm text-claro/80 placeholder:text-claro/40 focus:border-dorado/60 focus:outline-none"
          />
          <select
            value={filtros.estado}
            onChange={(e) => setFiltros((actual) => ({ ...actual, estado: e.target.value }))}
            className="w-full rounded-xl border border-grisOscuro bg-oscuro/40 px-4 py-3 text-sm text-claro/80 focus:border-dorado/60 focus:outline-none"
          >
            <option value="">Todos los estados</option>
            {estados.map((estado) => (
              <option key={estado} value={estado}>
                {estado}
              </option>
            ))}
          </select>
          <input
            type="date"
            value={filtros.desde}
            onChange={(e) => setFiltros((actual) => ({ ...actual, desde: e.target.value }))}
            className="rounded-xl border border-grisOscuro bg-oscuro/40 px-4 py-3 text-sm text-claro/80 focus:border-dorado/60 focus:outline-none"
          />
          <input
            type="date"
            value={filtros.hasta}
            onChange={(e) => setFiltros((actual) => ({ ...actual, hasta: e.target.value }))}
            className="rounded-xl border border-grisOscuro bg-oscuro/40 px-4 py-3 text-sm text-claro/80 focus:border-dorado/60 focus:outline-none"
          />
          <button
            type="button"
            onClick={cargar}
            className="rounded-xl bg-dorado px-4 py-3 text-sm font-semibold text-oscuro transition hover:bg-doradoClaro"
          >
            Filtrar
          </button>
          <button
            type="button"
            onClick={() => {
              const filtrosLimpios = crearFiltrosIniciales()
              setFiltros(filtrosLimpios)
              setCargando(true)
              listarPedidosAdmin()
                .then((datos) => {
                  setPedidos(datos.pedidos?.data || [])
                  setResumen(datos.resumen || null)
                })
                .catch(() => {
                  toast.error('No se pudieron cargar los pedidos')
                })
                .finally(() => {
                  setCargando(false)
                })
            }}
            className="rounded-xl border border-grisOscuro bg-oscuro/40 px-4 py-3 text-sm text-claro/70 transition hover:border-dorado/40 hover:text-doradoClaro"
          >
            Limpiar
          </button>
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl border border-grisOscuro bg-grisOscuro/40">
        <div className="flex items-center justify-between gap-3 border-b border-grisOscuro px-5 py-4">
          <div className="text-sm font-semibold text-claro/80">Listado</div>
          <button
            type="button"
            onClick={cargar}
            className="rounded-lg border border-grisOscuro bg-oscuro/40 px-3 py-1 text-xs text-claro/70 transition hover:border-dorado/40 hover:text-doradoClaro"
          >
            Recargar
          </button>
        </div>

        <div className="hidden overflow-auto md:block">
          <table className="w-full text-sm">
            <thead className="bg-oscuro/60 text-claro/60">
              <tr>
                <th className="px-4 py-3 text-left">Pedido</th>
                <th className="px-4 py-3 text-left">Cliente</th>
                <th className="px-4 py-3 text-left">Dirección</th>
                <th className="px-4 py-3 text-left">Total</th>
                <th className="px-4 py-3 text-left">Pago</th>
                <th className="px-4 py-3 text-left">Método</th>
                <th className="px-4 py-3 text-left">Estado</th>
                <th className="px-4 py-3 text-right">Ítems</th>
              </tr>
            </thead>
            <tbody>
              {cargando ? (
                <tr>
                  <td colSpan={8} className="px-4 py-6 text-center text-claro/50">
                    Cargando...
                  </td>
                </tr>
              ) : (
                pedidos.map((pedido) => (
                  <tr key={pedido.id} className="border-t border-grisOscuro transition hover:bg-oscuro/40">
                    <td className="px-4 py-3 text-claro/80">#{pedido.id}</td>
                    <td className="px-4 py-3 text-claro/80">
                      <div>{pedido.cliente?.nombre_completo}</div>
                      <div className="text-xs text-claro/50">{pedido.cliente?.email}</div>
                    </td>
                    <td className="px-4 py-3 text-claro/70">{pedido.direccion_envio || '—'}</td>
                    <td className="px-4 py-3 text-claro/80">{formatearMoneda(pedido.total)}</td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex rounded-full border px-3 py-1 text-xs font-semibold ${obtenerClaseEstadoPago(
                          resolverEstadoPago(pedido)
                        )}`}
                      >
                        {capitalizarEstado(resolverEstadoPago(pedido))}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-claro/70">
                      <div>{pedido.metodo_pago || '—'}</div>
                      <div className="text-xs text-claro/50">{pedido.proveedor_pago || 'sin proveedor'}</div>
                    </td>
                    <td className="px-4 py-3">
                      <select
                        value={pedido.estado}
                        onChange={(e) => cambiarEstado(pedido.id, e.target.value)}
                        className="rounded-lg border border-grisOscuro bg-oscuro/40 px-3 py-2 text-sm text-claro/80 focus:border-dorado/50 focus:outline-none"
                      >
                        {obtenerOpcionesEstadoPedido(pedido).map((estado) => (
                          <option key={estado} value={estado}>
                            {capitalizarEstado(estado)}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="px-4 py-3 text-right text-xs text-claro/50">{(pedido.detalles || []).length} ítems</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="grid gap-4 p-4 md:hidden">
          {cargando ? <div className="text-center text-sm text-claro/50">Cargando...</div> : null}
          {!cargando &&
            pedidos.map((pedido) => (
              <div key={pedido.id} className="rounded-2xl border border-grisOscuro bg-oscuro/40 p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="font-semibold text-claro/90">Pedido #{pedido.id}</div>
                    <div className="mt-1 text-sm text-claro/60">{pedido.cliente?.nombre_completo}</div>
                    <div className="text-xs text-claro/50">{pedido.cliente?.email}</div>
                  </div>
                  <div className="text-sm font-semibold text-dorado">{formatearMoneda(pedido.total)}</div>
                </div>
                <div className="mt-3 text-sm text-claro/70">
                  Dirección: {pedido.direccion_envio || 'Sin dirección registrada'}
                </div>
                <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-claro/70">
                  <span className="text-claro/50">Pago</span>
                  <span className={`rounded-full border px-3 py-1 font-semibold ${obtenerClaseEstadoPago(resolverEstadoPago(pedido))}`}>
                    {capitalizarEstado(resolverEstadoPago(pedido))}
                  </span>
                  <span className="text-claro/50">{pedido.metodo_pago || pedido.proveedor_pago || '—'}</span>
                </div>
                <div className="mt-3 text-xs text-claro/50">{(pedido.detalles || []).length} ítems</div>
                <select
                  value={pedido.estado}
                  onChange={(e) => cambiarEstado(pedido.id, e.target.value)}
                  className="mt-4 w-full rounded-lg border border-grisOscuro bg-oscuro/40 px-3 py-2 text-sm text-claro/80 focus:border-dorado/50 focus:outline-none"
                >
                  {obtenerOpcionesEstadoPedido(pedido).map((estado) => (
                    <option key={estado} value={estado}>
                      {capitalizarEstado(estado)}
                    </option>
                  ))}
                </select>
              </div>
            ))}
        </div>
      </div>
    </div>
  )
}

