import { clienteHttp } from './clienteHttp'

export async function enviarMensaje(datos) {
  const respuesta = await clienteHttp.post('mensajes', datos)
  return respuesta.data
}

export async function enviarMensajeCliente(mensaje) {
  const respuesta = await clienteHttp.post('cliente/mensajes', { mensaje })
  return respuesta.data
}

export async function listarMensajesCliente() {
  const respuesta = await clienteHttp.get('cliente/mensajes')
  return respuesta.data
}

export async function marcarMensajeLeidoCliente(id) {
  const respuesta = await clienteHttp.patch(`cliente/mensajes/${id}/leido`)
  return respuesta.data
}

export async function listarMensajesAdmin() {
  const respuesta = await clienteHttp.get('admin/mensajes')
  return respuesta.data
}

export async function marcarMensajeLeido(id) {
  const respuesta = await clienteHttp.patch(`admin/mensajes/${id}/leido`)
  return respuesta.data
}

export async function responderMensajeAdmin(id, respuestaTexto) {
  const respuesta = await clienteHttp.patch(`admin/mensajes/${id}/respuesta`, { respuesta: respuestaTexto })
  return respuesta.data
}

export async function eliminarMensaje(id) {
  const respuesta = await clienteHttp.delete(`admin/mensajes/${id}`)
  return respuesta.data
}
