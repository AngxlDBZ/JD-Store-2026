import { clienteHttp } from './clienteHttp'

export async function listarNotificaciones() {
  const respuesta = await clienteHttp.get('cliente/notificaciones')
  return respuesta.data
}

export async function marcarNotificacionLeida(id) {
  const respuesta = await clienteHttp.patch(`cliente/notificaciones/${id}/leida`)
  return respuesta.data
}
