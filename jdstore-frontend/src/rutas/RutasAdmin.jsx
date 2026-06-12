import { Route } from 'react-router-dom'
import { PanelAdmin } from '../paginas/admin/PanelAdmin'
import { GestionProductos } from '../paginas/admin/GestionProductos'
import { GestionPedidos } from '../paginas/admin/GestionPedidos'
import { GestionMensajes } from '../paginas/admin/GestionMensajes'
import { Reportes } from '../paginas/admin/Reportes'

export function RutasAdmin() {
  return (
    <>
      <Route index element={<PanelAdmin />} />
      <Route path="productos" element={<GestionProductos />} />
      <Route path="pedidos" element={<GestionPedidos />} />
      <Route path="mensajes" element={<GestionMensajes />} />
      <Route path="reportes" element={<Reportes />} />
    </>
  )
}

