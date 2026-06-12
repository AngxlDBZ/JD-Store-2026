import { Navigate } from 'react-router-dom'
import { usarAutenticacion } from '../hooks/usarAutenticacion'
import { rutas } from '../constantes/rutas'

export function RutaProtegida({ children, requiereAdmin = false, requiereVendedor = false }) {
  const { cargando, estaAutenticado, esAdmin, esVendedor } = usarAutenticacion()

  if (cargando) {
    return (
      <div className="min-h-[60vh] grid place-items-center text-grisMedio">
        <div className="animate-pulse">Cargando...</div>
      </div>
    )
  }

  if (!estaAutenticado) {
    return <Navigate to={rutas.iniciarSesion} replace />
  }

  if (requiereAdmin && !esAdmin) {
    return <Navigate to={rutas.inicio} replace />
  }

  if (requiereVendedor && !esAdmin && !esVendedor) {
    return <Navigate to={rutas.inicio} replace />
  }

  return children
}
