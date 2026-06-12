import { clienteHttp } from './clienteHttp'

export async function consultarInventarioPorSku(sku) {
  const respuesta = await clienteHttp.get(`inventario/sku/${encodeURIComponent(sku)}`)
  return respuesta.data
}
