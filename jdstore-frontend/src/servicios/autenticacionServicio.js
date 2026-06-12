import { clienteHttp } from './clienteHttp'

export async function registrarUsuario(datos) {
  const respuesta = await clienteHttp.post('auth/registro', datos)
  return respuesta.data
}

export async function iniciarSesion(datos) {
  const respuesta = await clienteHttp.post('auth/login', datos)
  return respuesta.data
}

export async function cerrarSesion() {
  const respuesta = await clienteHttp.post('auth/logout')
  return respuesta.data
}

export async function obtenerYo() {
  const respuesta = await clienteHttp.get('auth/yo')
  return respuesta.data
}

export async function enviarRecuperacionPassword(email) {
  const respuesta = await clienteHttp.post('auth/recuperar', { email })
  return respuesta.data
}

export async function cambiarPassword(datos) {
  const respuesta = await clienteHttp.post('auth/cambiar-password', datos)
  return respuesta.data
}

export async function actualizarPerfil(datos) {
  const respuesta = await clienteHttp.patch('auth/perfil', datos)
  return respuesta.data
}

