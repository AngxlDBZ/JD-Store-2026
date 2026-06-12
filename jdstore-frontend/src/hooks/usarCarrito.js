import { useContext } from 'react'
import { ContextoCarrito } from '../contextos/ContextoCarrito'

export function usarCarrito() {
  const contexto = useContext(ContextoCarrito)
  if (!contexto) {
    throw new Error('ContextoCarrito no está disponible')
  }
  return contexto
}

