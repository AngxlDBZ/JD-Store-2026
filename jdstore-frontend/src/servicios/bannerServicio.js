import { clienteHttp } from './clienteHttp'

export async function listarBanners() {
  const respuesta = await clienteHttp.get('banners')
  return respuesta.data
}

export async function listarBannersAdmin(parametros = {}) {
  const respuesta = await clienteHttp.get('admin/banners', { params: parametros })
  return respuesta.data
}

export async function crearBanner(formData) {
  const respuesta = await clienteHttp.post('admin/banners', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })
  return respuesta.data
}

export async function actualizarBanner(id, formData) {
  const respuesta = await clienteHttp.post(`admin/banners/${id}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })
  return respuesta.data
}

export async function eliminarBanner(id) {
  const respuesta = await clienteHttp.delete(`admin/banners/${id}`)
  return respuesta.data
}
