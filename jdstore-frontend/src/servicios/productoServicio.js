import { clienteHttp } from './clienteHttp'

export async function listarProductos(parametros = {}) {
  const respuesta = await clienteHttp.get('productos', { params: parametros })
  return respuesta.data
}

export async function obtenerProducto(id) {
  const respuesta = await clienteHttp.get(`productos/${id}`)
  return respuesta.data
}

export async function crearProducto(formData) {
  const respuesta = await clienteHttp.post('productos', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })
  return respuesta.data
}

export async function actualizarProducto(id, formData) {
  formData.append('_method', 'PUT')
  const respuesta = await clienteHttp.post(`productos/${id}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })
  return respuesta.data
}

export async function eliminarProducto(id) {
  const respuesta = await clienteHttp.delete(`productos/${id}`)
  return respuesta.data
}

export async function eliminarProductoPermanentemente(id) {
  const respuesta = await clienteHttp.delete(`productos/${id}/permanente`)
  return respuesta.data
}
