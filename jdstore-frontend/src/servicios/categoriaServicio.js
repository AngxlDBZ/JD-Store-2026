import { clienteHttp } from './clienteHttp'

export async function listarCategorias() {
  const respuesta = await clienteHttp.get('categorias')
  return respuesta.data
}
