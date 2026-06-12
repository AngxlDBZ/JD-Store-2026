import { clienteHttp } from './clienteHttp'

export async function listarResenasProducto(productoId, parametros = {}) {
  const respuesta = await clienteHttp.get(`productos/${productoId}/resenas`, { params: parametros })
  return respuesta.data
}

export async function crearResena(productoId, datos) {
  const respuesta = await clienteHttp.post(`cliente/productos/${productoId}/resenas`, datos)
  return respuesta.data
}

export async function listarResenasAdmin(parametros = {}) {
  const respuesta = await clienteHttp.get('admin/resenas', { params: parametros })
  return respuesta.data
}

export async function actualizarEstadoResena(id, estado) {
  const respuesta = await clienteHttp.patch(`admin/resenas/${id}/estado`, { estado })
  return respuesta.data
}
