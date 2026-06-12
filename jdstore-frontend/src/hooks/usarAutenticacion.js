import { useContext } from 'react'
import { ContextoAutenticacion } from '../contextos/ContextoAutenticacion'

export function usarAutenticacion() {
  const contexto = useContext(ContextoAutenticacion)
  if (!contexto) {
    throw new Error('ContextoAutenticacion no está disponible')
  }
  return contexto
}

