import { useEffect, useState } from 'react'
import { listarProductos } from '../servicios/productoServicio'

const CACHE_PRODUCTOS = new Map()

export function usarProductos(parametros) {
  const claveParametros = JSON.stringify(parametros || {})
  const cacheInicial = CACHE_PRODUCTOS.get(claveParametros)
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState(null)
  const [productos, setProductos] = useState(() => cacheInicial?.productos || [])
  const [paginacion, setPaginacion] = useState(() => cacheInicial?.paginacion || null)

  useEffect(() => {
    let activo = true

    async function cargar() {
      const cache = CACHE_PRODUCTOS.get(claveParametros)
      setCargando(!cache)
      setError(null)
      try {
        const datos = await listarProductos(parametros)
        if (activo) {
          const productosNuevos = datos.productos?.data || []
          const paginacionNueva = datos.productos || null
          CACHE_PRODUCTOS.set(claveParametros, {
            productos: productosNuevos,
            paginacion: paginacionNueva,
            guardadoEn: Date.now(),
          })
          setProductos(productosNuevos)
          setPaginacion(paginacionNueva)
        }
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
  }, [claveParametros, parametros])

  return { cargando, error, productos, paginacion }
}
