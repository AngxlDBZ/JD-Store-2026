import { clienteHttp } from './clienteHttp'

export async function listarUsuarios(parametros = {}) {
  const respuesta = await clienteHttp.get('admin/usuarios', { params: parametros })
  return respuesta.data
}
