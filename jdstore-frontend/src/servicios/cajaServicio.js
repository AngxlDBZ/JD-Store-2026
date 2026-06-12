import { clienteHttp } from './clienteHttp'

export async function abrirCaja() {
  const respuesta = await clienteHttp.post('caja/abrir')
  return respuesta.data
}

export async function cerrarCaja(id) {
  const respuesta = await clienteHttp.patch(`caja/${id}/cerrar`)
  return respuesta.data
}

export async function listarCajas() {
  const respuesta = await clienteHttp.get('caja')
  return respuesta.data
}
