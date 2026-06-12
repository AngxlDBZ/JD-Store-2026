import { NavLink } from 'react-router-dom'
import { rutas } from '../../constantes/rutas'

const enlaces = [
  { to: rutas.vendedor, texto: 'Caja' },
  { to: rutas.vendedorInventario, texto: 'Inventario' },
  { to: rutas.vendedorDevoluciones, texto: 'Devoluciones' },
]

export function BarraLateralVendedor({ onNavigate }) {
  return (
    <aside className="h-full w-72 shrink-0 border-r border-grisOscuro bg-[#101012] text-claro">
      <div className="border-b border-white/10 p-5">
        <div className="font-urbana text-2xl tracking-wide text-dorado">JD Seller</div>
        <div className="text-xs text-claro/60">Panel de vendedor</div>
      </div>

      <nav className="grid gap-1 p-3">
        {enlaces.map((enlace) => (
          <NavLink
            key={enlace.to}
            to={enlace.to}
            end={enlace.to === rutas.vendedor}
            onClick={onNavigate}
            className={({ isActive }) =>
              `rounded-xl px-3 py-2 text-sm transition ${
                isActive ? 'bg-dorado text-oscuro font-semibold' : 'text-claro/80 hover:bg-oscuro/40'
              }`
            }
          >
            {enlace.texto}
          </NavLink>
        ))}
      </nav>
    </aside>
  )
}
