import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { ContextoAutenticacion } from './ContextoAutenticacion'

export const ContextoCarrito = createContext(null)
const claveCarritoInvitado = 'jdstore_carrito_guest'

function normalizarTalla(talla) {
  if (typeof talla !== 'string') return null
  const v = talla.trim()
  return v ? v : null
}

function leerCarrito(clave) {
  try {
    const raw = localStorage.getItem(clave)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

function obtenerClaveCarrito(usuarioId) {
  return usuarioId ? `jdstore_carrito_usuario_${usuarioId}` : claveCarritoInvitado
}

function normalizarSeleccion(seleccion) {
  if (!seleccion) {
    return { variante_id: null, talla: null }
  }

  if (typeof seleccion === 'string') {
    return { variante_id: null, talla: normalizarTalla(seleccion) }
  }

  return {
    variante_id: Number(seleccion.id || seleccion.variante_id || 0) || null,
    talla: normalizarTalla(seleccion.talla),
  }
}

function coincideItem(item, productoId, varianteId, talla) {
  if (item.producto.id !== productoId) return false
  if (varianteId !== null) return Number(item.variante_id || 0) === varianteId
  return normalizarTalla(item.talla) === talla
}

function obtenerStockDisponible(producto, varianteId = null, talla = null) {
  const variantes = Array.isArray(producto?.variantes) ? producto.variantes : []

  if (varianteId !== null) {
    const variante = variantes.find((item) => Number(item.id) === Number(varianteId))
    return Math.max(0, Number(variante?.stock || 0))
  }

  const tallaNormalizada = normalizarTalla(talla)
  if (tallaNormalizada) {
    const variante = variantes.find((item) => normalizarTalla(item.talla) === tallaNormalizada)
    return Math.max(0, Number(variante?.stock || 0))
  }

  return Math.max(0, Number(producto?.stock || 0))
}

function fusionarCarritos(base, extra) {
  const resultado = [...base]

  for (const item of extra) {
    const indice = resultado.findIndex((actual) =>
      coincideItem(actual, item.producto.id, item.variante_id || null, normalizarTalla(item.talla))
    )
    const stockDisponible = obtenerStockDisponible(item.producto, item.variante_id || null, item.talla)

    if (stockDisponible <= 0) {
      continue
    }

    if (indice >= 0) {
      resultado[indice] = {
        ...resultado[indice],
        cantidad: Math.min(resultado[indice].cantidad + item.cantidad, stockDisponible),
      }
    } else {
      resultado.push({
        ...item,
        cantidad: Math.min(item.cantidad, stockDisponible),
      })
    }
  }

  return resultado
}

export function ProveedorCarrito({ children }) {
  const autenticacion = useContext(ContextoAutenticacion)
  const usuario = autenticacion?.usuario || null
  const claveCarrito = useMemo(() => obtenerClaveCarrito(usuario?.id), [usuario?.id])
  const [items, setItems] = useState([])
  const [sincronizado, setSincronizado] = useState(false)

  useEffect(() => {
    const carritoActual = leerCarrito(claveCarrito)

    if (usuario?.id) {
      const carritoInvitado = leerCarrito(claveCarritoInvitado)
      const carritoFusionado = fusionarCarritos(carritoActual, carritoInvitado)
      setItems(carritoFusionado)
      localStorage.setItem(claveCarrito, JSON.stringify(carritoFusionado))
      if (carritoInvitado.length > 0) {
        localStorage.removeItem(claveCarritoInvitado)
      }
    } else {
      setItems(carritoActual)
    }

    setSincronizado(true)
  }, [claveCarrito, usuario?.id])

  useEffect(() => {
    if (!sincronizado) return
    localStorage.setItem(claveCarrito, JSON.stringify(items))
  }, [claveCarrito, items, sincronizado])

  function agregarProducto(producto, cantidad = 1, seleccion = null) {
    const { variante_id: varianteId, talla } = normalizarSeleccion(seleccion)
    const stockDisponible = obtenerStockDisponible(producto, varianteId, talla)

    setItems((actual) => {
      if (stockDisponible <= 0) {
        return actual
      }

      const existente = actual.find((i) => coincideItem(i, producto.id, varianteId, talla))

      if (existente) {
        const cantidadSiguiente = Math.min(existente.cantidad + cantidad, stockDisponible)
        return actual.map((i) =>
          coincideItem(i, producto.id, varianteId, talla)
            ? { ...i, cantidad: cantidadSiguiente }
            : i
        )
      }

      return [...actual, { producto, cantidad: Math.min(cantidad, stockDisponible), variante_id: varianteId, talla }]
    })
  }

  function actualizarCantidad(productoId, varianteId, talla, cantidad) {
    setItems((actual) =>
      actual
        .map((i) =>
          coincideItem(i, productoId, varianteId, normalizarTalla(talla))
            ? {
                ...i,
                cantidad: Math.min(
                  Math.max(0, Number(cantidad || 0)),
                  obtenerStockDisponible(i.producto, varianteId, talla)
                ),
              }
            : i
        )
        .filter((i) => i.cantidad > 0)
    )
  }

  function eliminarProducto(productoId, varianteId = null, talla = null) {
    const tallaNormalizada = normalizarTalla(talla)

    setItems((actual) =>
      actual.filter((i) => !coincideItem(i, productoId, varianteId, tallaNormalizada))
    )
  }

  function limpiarCarrito() {
    setItems([])
  }

  const resumen = useMemo(() => {
    const subtotal = items.reduce((acc, item) => acc + Number(item.producto.precio_final || item.producto.precio) * item.cantidad, 0)
    const cantidadTotal = items.reduce((acc, item) => acc + item.cantidad, 0)

    return { subtotal, total: subtotal, cantidadTotal }
  }, [items])

  const valor = useMemo(
    () => ({
      items,
      ...resumen,
      agregarProducto,
      actualizarCantidad,
      eliminarProducto,
      limpiarCarrito,
      obtenerStockDisponible,
    }),
    [items, resumen]
  )

  return <ContextoCarrito.Provider value={valor}>{children}</ContextoCarrito.Provider>
}
