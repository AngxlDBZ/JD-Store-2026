import { clienteHttp } from './clienteHttp'

export async function listarDestacados() {
  const respuesta = await clienteHttp.get('destacados')
  return respuesta.data
}

export async function listarDestacadosAdmin(parametros = {}) {
  const respuesta = await clienteHttp.get('admin/destacados', { params: parametros })
  return respuesta.data
}

export async function crearDestacado(datos) {
  const respuesta = await clienteHttp.post('admin/destacados', datos)
  return respuesta.data
}

export async function actualizarDestacado(id, datos) {
  const respuesta = await clienteHttp.patch(`admin/destacados/${id}`, datos)
  return respuesta.data
}

export async function eliminarDestacado(id) {
  const respuesta = await clienteHttp.delete(`admin/destacados/${id}`)
  return respuesta.data
}
