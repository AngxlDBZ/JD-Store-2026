import { clienteHttp } from './clienteHttp'

export async function obtenerResumenDashboard() {
  const respuesta = await clienteHttp.get('admin/reportes/dashboard')
  return respuesta.data
}

export async function obtenerVentasPorPeriodo(desde, hasta) {
  const respuesta = await clienteHttp.get('admin/reportes/ventas', { params: { desde, hasta } })
  return respuesta.data
}

export async function obtenerReporteDiario(fecha) {
  const respuesta = await clienteHttp.get('admin/reportes/diario', { params: { fecha } })
  return respuesta.data
}

export async function obtenerProductosMasVendidos(parametros = {}) {
  const respuesta = await clienteHttp.get('admin/reportes/productos-mas-vendidos', { params: parametros })
  return respuesta.data
}

export async function obtenerClientesFrecuentes(parametros = {}) {
  const respuesta = await clienteHttp.get('admin/reportes/clientes-frecuentes', { params: parametros })
  return respuesta.data
}
