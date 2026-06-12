import { createContext, useEffect, useMemo, useState } from 'react'
import { usarAutenticacion } from '../hooks/usarAutenticacion'

export const ContextoFavoritos = createContext(null)

function obtenerClave(usuario) {
  return `jdstore_favoritos_${usuario?.id ?? 'anon'}`
}

function leerFavoritos(clave) {
  try {
    const raw = localStorage.getItem(clave)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

export function ProveedorFavoritos({ children }) {
  const { usuario } = usarAutenticacion()
  const [favoritos, setFavoritos] = useState([])

  useEffect(() => {
    setFavoritos(leerFavoritos(obtenerClave(usuario)))
  }, [usuario?.id])

  useEffect(() => {
    localStorage.setItem(obtenerClave(usuario), JSON.stringify(favoritos))
  }, [favoritos, usuario?.id])

  function alternarFavorito(producto) {
    setFavoritos((actual) => {
      const existe = actual.some((item) => item.id === producto.id)
      if (existe) return actual.filter((item) => item.id !== producto.id)
      return [producto, ...actual]
    })
  }

  function esFavorito(productoId) {
    return favoritos.some((item) => item.id === productoId)
  }

  const valor = useMemo(
    () => ({
      favoritos,
      alternarFavorito,
      esFavorito,
    }),
    [favoritos]
  )

  return <ContextoFavoritos.Provider value={valor}>{children}</ContextoFavoritos.Provider>
}
