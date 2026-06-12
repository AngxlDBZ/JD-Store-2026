import { NavLink } from 'react-router-dom'
import { rutas } from '../../constantes/rutas'

const gruposEnlaces = [
  {
    titulo: 'General',
    enlaces: [
      { to: rutas.admin, texto: 'Resumen general', descripcion: 'Vista rápida del negocio' },
      { to: rutas.adminReportes, texto: 'Reportes', descripcion: 'PDF, Excel y métricas' },
    ],
  },
  {
    titulo: 'Tienda',
    enlaces: [
      { to: rutas.adminProductos, texto: 'Productos', descripcion: 'Inventario, precios y stock' },
      { to: rutas.adminPedidos, texto: 'Pedidos', descripcion: 'Compras y estado de pago' },
      { to: rutas.adminCupones, texto: 'Cupones', descripcion: 'Códigos de descuento' },
      { to: rutas.adminUsuarios, texto: 'Usuarios', descripcion: 'Clientes y cuentas' },
      { to: rutas.adminMensajes, texto: 'Mensajes', descripcion: 'Consultas del sitio' },
    ],
  },
  {
    titulo: 'Inicio Web',
    enlaces: [
      { to: rutas.adminBanners, texto: 'Banners', descripcion: 'Fondo principal y CTA' },
      { to: rutas.adminDestacados, texto: 'Destacados', descripcion: 'Productos del home' },
      { to: rutas.adminPromociones, texto: 'Promociones', descripcion: 'Descuentos activos' },
      { to: rutas.adminResenas, texto: 'Reseñas', descripcion: 'Moderación de opiniones' },
    ],
  },
]

export function BarraLateral({ onNavigate }) {
  return (
    <aside className="h-full w-72 shrink-0 border-r border-grisOscuro bg-[#0f0f10] text-claro">
      <div className="p-5 border-b border-white/10">
        <div className="font-urbana text-2xl tracking-wide text-dorado">JD Admin</div>
        <div className="text-xs text-claro/60">Panel de administración de JD Store</div>
      </div>

      <nav className="p-3 grid gap-4">
        {gruposEnlaces.map((grupo) => (
          <div key={grupo.titulo}>
            <div className="px-3 pb-2 text-[11px] font-semibold uppercase tracking-[0.22em] text-claro/35">{grupo.titulo}</div>
            <div className="grid gap-1">
              {grupo.enlaces.map((e) => (
                <NavLink
                  key={e.to}
                  to={e.to}
                  end={e.to === rutas.admin}
                  onClick={onNavigate}
                  className={({ isActive }) =>
                    `block rounded-2xl px-3 py-3 transition ${
                      isActive
                        ? 'bg-dorado text-oscuro'
                        : 'text-claro/80 hover:bg-oscuro/40'
                    }`
                  }
                >
                  {({ isActive }) => (
                    <>
                      <div className={`text-sm ${isActive ? 'font-semibold' : 'font-medium'}`}>{e.texto}</div>
                      <div className={`mt-1 text-xs ${isActive ? 'text-oscuro/70' : 'text-claro/45'}`}>{e.descripcion}</div>
                    </>
                  )}
                </NavLink>
              ))}
            </div>
          </div>
        ))}
      </nav>
    </aside>
  )
}
