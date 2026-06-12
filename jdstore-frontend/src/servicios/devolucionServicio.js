import { clienteHttp } from './clienteHttp'

export async function listarDevoluciones() {
  const respuesta = await clienteHttp.get('devoluciones')
  return respuesta.data
}

export async function crearDevolucion(datos) {
  const respuesta = await clienteHttp.post('devoluciones', datos)
  return respuesta.data
}
