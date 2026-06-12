import { clienteHttp } from './clienteHttp'

export async function crearPedido(datos) {
  const respuesta = await clienteHttp.post('cliente/pedidos', datos)
  return respuesta.data
}

export async function crearCheckoutWompi(datos) {
  const respuesta = await clienteHttp.post('cliente/pagos/wompi/checkout', datos)
  return respuesta.data
}

export async function sincronizarPedidoWompi(id, transactionId) {
  const respuesta = await clienteHttp.get(`cliente/pagos/wompi/pedidos/${id}`, {
    params: transactionId ? { transaction_id: transactionId } : {},
  })
  return respuesta.data
}

export async function listarMisPedidos() {
  const respuesta = await clienteHttp.get('cliente/pedidos')
  return respuesta.data
}

export async function obtenerPedidoCliente(id) {
  const respuesta = await clienteHttp.get(`cliente/pedidos/${id}`)
  return respuesta.data
}

export async function listarPedidosAdmin(parametros = {}) {
  const respuesta = await clienteHttp.get('admin/pedidos', { params: parametros })
  return respuesta.data
}

export async function actualizarEstadoPedido(id, estado) {
  const respuesta = await clienteHttp.patch(`admin/pedidos/${id}/estado`, { estado })
  return respuesta.data
}
