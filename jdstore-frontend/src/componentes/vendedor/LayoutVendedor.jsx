import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import { BarraLateralVendedor } from './BarraLateralVendedor'
import { usarAutenticacion } from '../../hooks/usarAutenticacion'

export function LayoutVendedor() {
  const { usuario, cerrarSesion } = usarAutenticacion()
  const [menuAbierto, setMenuAbierto] = useState(false)

  return (
    <div className="min-h-screen bg-oscuro text-claro lg:flex">
      <div className="hidden lg:block">
        <BarraLateralVendedor />
      </div>

      {menuAbierto ? (
        <div className="fixed inset-0 z-40 bg-black/60 lg:hidden" onClick={() => setMenuAbierto(false)}>
          <div className="h-full w-72" onClick={(e) => e.stopPropagation()}>
            <BarraLateralVendedor onNavigate={() => setMenuAbierto(false)} />
          </div>
        </div>
      ) : null}

      <div className="min-w-0 flex-1">
        <header className="flex min-h-16 flex-wrap items-center justify-between gap-3 border-b border-grisOscuro bg-[#0c0c0c]/80 px-4 py-3 backdrop-blur sm:px-6">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setMenuAbierto(true)}
              className="rounded-xl border border-grisOscuro bg-oscuro/40 px-4 py-2 text-sm text-claro/80 transition hover:border-dorado/40 hover:text-doradoClaro lg:hidden"
            >
              Menu
            </button>
            <div className="text-sm text-claro/70">
              Turno: <span className="font-semibold text-claro/90">{usuario?.nombre_completo}</span>
            </div>
          </div>

          <button
            type="button"
            onClick={cerrarSesion}
            className="rounded-xl border border-dorado/30 bg-dorado/15 px-4 py-2 text-sm text-dorado transition hover:bg-dorado/20"
          >
            Cerrar sesión
          </button>
        </header>

        <main className="p-4 sm:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
