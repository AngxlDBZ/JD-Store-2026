import { useEffect, useState } from 'react'
import { listarMisPedidos } from '../servicios/pedidoServicio'

export function usarPedidos() {
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState(null)
  const [pedidos, setPedidos] = useState([])

  useEffect(() => {
    let activo = true

    async function cargar() {
      setCargando(true)
      setError(null)
      try {
        const datos = await listarMisPedidos()
        if (activo) setPedidos(datos.pedidos?.data || [])
      } catch (e) {
        if (activo) setError(e)
      } finally {
        if (activo) setCargando(false)
      }
    }

    cargar()

    return () => {
      activo = false
    }
  }, [])

  return { cargando, error, pedidos }
}
