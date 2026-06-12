import { clienteHttp } from './clienteHttp'

export async function validarCupon(datos) {
  const respuesta = await clienteHttp.post('cliente/cupones/validar', datos)
  return respuesta.data
}

export async function listarCuponesAdmin(parametros = {}) {
  const respuesta = await clienteHttp.get('admin/cupones', { params: parametros })
  return respuesta.data
}

export async function crearCupon(datos) {
  const respuesta = await clienteHttp.post('admin/cupones', datos)
  return respuesta.data
}

export async function actualizarCupon(id, datos) {
  const respuesta = await clienteHttp.patch(`admin/cupones/${id}`, datos)
  return respuesta.data
}

export async function eliminarCupon(id) {
  const respuesta = await clienteHttp.delete(`admin/cupones/${id}`)
  return respuesta.data
}
