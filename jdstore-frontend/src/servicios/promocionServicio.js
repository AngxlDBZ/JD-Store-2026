import { clienteHttp } from './clienteHttp'

export async function listarPromociones(parametros = {}) {
  const respuesta = await clienteHttp.get('admin/promociones', { params: parametros })
  return respuesta.data
}

export async function crearPromocion(datos) {
  const respuesta = await clienteHttp.post('admin/promociones', datos)
  return respuesta.data
}

export async function actualizarPromocion(id, datos) {
  const respuesta = await clienteHttp.patch(`admin/promociones/${id}`, datos)
  return respuesta.data
}

export async function eliminarPromocion(id) {
  const respuesta = await clienteHttp.delete(`admin/promociones/${id}`)
  return respuesta.data
}
