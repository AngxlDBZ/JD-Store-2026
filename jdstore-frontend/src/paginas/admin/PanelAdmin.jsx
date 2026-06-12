import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { TarjetaEstadistica } from '../../componentes/admin/TarjetaEstadistica'
import { rutas } from '../../constantes/rutas'
import { obtenerResumenDashboard, obtenerVentasPorPeriodo } from '../../servicios/reporteServicio'
import { formatearMoneda } from '../../utilidades/formatearMoneda'

export function PanelAdmin() {
  const [resumen, setResumen] = useState(null)
  const [ventas, setVentas] = useState([])
  const accesosRapidos = [
    { titulo: 'Banners', detalle: 'Cambia el fondo principal del inicio y el enlace del CTA.', to: rutas.adminBanners },
    { titulo: 'Destacados', detalle: 'Elige los productos que aparecen primero en el home.', to: rutas.adminDestacados },
    { titulo: 'Promociones', detalle: 'Activa descuentos globales, por producto o por categoría.', to: rutas.adminPromociones },
    { titulo: 'Cupones', detalle: 'Crea códigos de descuento para el checkout.', to: rutas.adminCupones },
    { titulo: 'Reseñas', detalle: 'Aprueba, rechaza o revisa comentarios de clientes.', to: rutas.adminResenas },
  ]

  useEffect(() => {
    let activo = true
    async function cargar() {
      const [r, v] = await Promise.all([obtenerResumenDashboard(), obtenerVentasPorPeriodo()])
      if (!activo) return
      setResumen(r.resumen)
      setVentas(v.ventas || [])
    }
    cargar()
    return () => {
      activo = false
    }
  }, [])

  return (
    <div className="space-y-6">
      <div className="surface-panel p-6 sm:p-7">
        <div className="section-kicker">Dashboard</div>
        <h1 className="mt-2 font-urbana text-3xl tracking-wide text-claro/90 sm:text-4xl">Resumen</h1>
        <p className="mt-3 max-w-3xl text-sm leading-7 text-claro/60">
          Desde aquí puedes ver el estado general de la tienda y entrar a los módulos principales del sitio con una guía clara y consistente.
        </p>
        <div className="mt-5 flex flex-wrap gap-3 text-xs text-claro/60">
          <span className="rounded-full border border-dorado/20 bg-dorado/8 px-3 py-1">Gestión centralizada</span>
          <span className="rounded-full border border-grisOscuro bg-grisOscuro/35 px-3 py-1">Pedidos y pagos</span>
          <span className="rounded-full border border-grisOscuro bg-grisOscuro/35 px-3 py-1">Home y campañas</span>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
        {accesosRapidos.map((item) => (
          <Link key={item.titulo} to={item.to} className="surface-panel p-5 transition hover:-translate-y-0.5 hover:border-dorado/35">
            <div className="text-sm font-semibold text-dorado">{item.titulo}</div>
            <div className="mt-2 text-sm text-claro/65">{item.detalle}</div>
          </Link>
        ))}
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4 2xl:grid-cols-7">
        <TarjetaEstadistica
          titulo="Ingresos totales"
          valor={resumen ? formatearMoneda(resumen.ingresos_totales) : '—'}
        />
        <TarjetaEstadistica titulo="Pedidos pendientes" valor={resumen ? resumen.pedidos_pendientes : '—'} />
        <TarjetaEstadistica titulo="Pagos aprobados" valor={resumen ? resumen.pagos_aprobados : '—'} />
        <TarjetaEstadistica titulo="Pagos pendientes" valor={resumen ? resumen.pagos_pendientes : '—'} />
        <TarjetaEstadistica titulo="Pagos fallidos" valor={resumen ? resumen.pagos_fallidos : '—'} />
        <TarjetaEstadistica titulo="Productos activos" valor={resumen ? resumen.productos_activos : '—'} />
        <TarjetaEstadistica titulo="Bajo stock" valor={resumen ? resumen.alertas_bajo_stock : '—'} />
      </div>

      <div className="surface-panel p-6">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <div className="section-kicker">Métricas</div>
            <div className="mt-2 text-sm font-semibold text-claro/80">Ventas (últimos días)</div>
          </div>
          <div className="text-xs text-claro/50">Lectura rápida del movimiento reciente</div>
        </div>
        <div className="mt-5 h-72">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={ventas}>
              <XAxis dataKey="fecha" tick={{ fontSize: 12, fill: '#ffffff' }} axisLine={{ stroke: '#3a3a3a' }} tickLine={{ stroke: '#3a3a3a' }} />
              <YAxis tick={{ fontSize: 12, fill: '#ffffff' }} axisLine={{ stroke: '#3a3a3a' }} tickLine={{ stroke: '#3a3a3a' }} />
              <Tooltip formatter={(value) => formatearMoneda(value)} contentStyle={{ background: '#111111', border: '1px solid #3a3a3a', borderRadius: 12, color: '#ffffff' }} />
              <Line type="monotone" dataKey="total" stroke="#c9a84c" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  )
}

