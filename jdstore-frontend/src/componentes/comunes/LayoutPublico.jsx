import { Outlet } from 'react-router-dom'
import { Encabezado } from './Encabezado'
import { PieDePagina } from './PieDePagina'

export function LayoutPublico() {
  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,rgba(212,175,55,0.08),transparent_24%),linear-gradient(180deg,#090909_0%,#070707_100%)] text-claro flex flex-col">
      <Encabezado />
      <main className="relative flex-1">
        <Outlet />
      </main>
      <PieDePagina />
    </div>
  )
}

