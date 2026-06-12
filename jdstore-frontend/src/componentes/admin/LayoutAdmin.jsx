import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import { BarraLateral } from './BarraLateral'
import { usarAutenticacion } from '../../hooks/usarAutenticacion'

export function LayoutAdmin() {
  const { usuario, cerrarSesion } = usarAutenticacion()
  const [menuAbierto, setMenuAbierto] = useState(false)

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,rgba(212,175,55,0.08),transparent_22%),linear-gradient(180deg,#090909_0%,#070707_100%)] text-claro lg:flex">
      <div className="hidden lg:block">
        <BarraLateral />
      </div>

      {menuAbierto ? (
        <div className="fixed inset-0 z-40 bg-black/60 lg:hidden" onClick={() => setMenuAbierto(false)}>
          <div className="h-full w-72" onClick={(e) => e.stopPropagation()}>
            <BarraLateral onNavigate={() => setMenuAbierto(false)} />
          </div>
        </div>
      ) : null}

      <div className="flex-1 min-w-0">
        <header className="sticky top-0 z-30 flex min-h-16 flex-wrap items-center justify-between gap-3 border-b border-grisOscuro bg-[#0c0c0c]/88 px-4 py-3 backdrop-blur-sm sm:px-6">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setMenuAbierto(true)}
              className="rounded-xl border border-grisOscuro bg-oscuro/40 px-4 py-2 text-sm text-claro/80 transition hover:border-dorado/40 hover:text-doradoClaro lg:hidden"
            >
              Menu
            </button>
            <div className="text-sm text-claro/70">
              Sesión: <span className="text-claro/90 font-semibold">{usuario?.nombre_completo}</span>
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

        <main className="p-4 sm:p-6 xl:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

