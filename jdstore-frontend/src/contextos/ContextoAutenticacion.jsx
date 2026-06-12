import { createContext, useEffect, useMemo, useState } from 'react'
import toast from 'react-hot-toast'
import { cerrarSesion, iniciarSesion, obtenerYo, registrarUsuario } from '../servicios/autenticacionServicio'

export const ContextoAutenticacion = createContext(null)

export function ProveedorAutenticacion({ children }) {
  const [usuario, setUsuario] = useState(null)
  const [cargando, setCargando] = useState(true)

  const token = localStorage.getItem('jdstore_token')

  useEffect(() => {
    let activo = true

    async function cargarSesion() {
      if (!token) {
        setCargando(false)
        return
      }

      try {
        const datos = await obtenerYo()
        if (activo) setUsuario(datos.usuario || null)
      } catch {
        localStorage.removeItem('jdstore_token')
        if (activo) setUsuario(null)
      } finally {
        if (activo) setCargando(false)
      }
    }

    cargarSesion()

    return () => {
      activo = false
    }
  }, [token])

  async function accionRegistrar(datos) {
    const respuesta = await registrarUsuario(datos)
    if (respuesta.token) {
      localStorage.setItem('jdstore_token', respuesta.token)
      setUsuario(respuesta.usuario)
      toast.success('Cuenta creada')
    }
    return respuesta
  }

  async function accionIniciarSesion(datos) {
    const respuesta = await iniciarSesion(datos)
    if (respuesta.token) {
      localStorage.setItem('jdstore_token', respuesta.token)
      setUsuario(respuesta.usuario)
      toast.success('Sesión iniciada')
    }
    return respuesta
  }

  async function accionCerrarSesion() {
    try {
      await cerrarSesion()
    } finally {
      localStorage.removeItem('jdstore_token')
      setUsuario(null)
    }
  }

  function actualizarUsuario(datosUsuario) {
    setUsuario(datosUsuario)
  }

  const valor = useMemo(
    () => ({
      usuario,
      cargando,
      estaAutenticado: Boolean(usuario),
      esAdmin: usuario?.rol === 'admin',
      esVendedor: usuario?.rol === 'vendedor',
      esCliente: usuario?.rol === 'cliente',
      registrar: accionRegistrar,
      iniciarSesion: accionIniciarSesion,
      cerrarSesion: accionCerrarSesion,
      actualizarUsuario,
    }),
    [usuario, cargando]
  )

  return <ContextoAutenticacion.Provider value={valor}>{children}</ContextoAutenticacion.Provider>
}

