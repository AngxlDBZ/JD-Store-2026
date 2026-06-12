import { useContext } from 'react'
import { ContextoFavoritos } from '../contextos/ContextoFavoritos'

export function usarFavoritos() {
  const contexto = useContext(ContextoFavoritos)
  if (!contexto) {
    throw new Error('ContextoFavoritos no está disponible')
  }
  return contexto
}
