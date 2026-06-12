import { useEffect, useMemo, useState } from 'react'
import { useParams } from 'react-router-dom'
import { CargadorSpinner } from '../../componentes/comunes/CargadorSpinner'
import { FiltrosCatalogoAvanzados } from '../../componentes/comunes/FiltrosCatalogoAvanzados'
import { MensajeError } from '../../componentes/comunes/MensajeError'
import { TarjetaProducto } from '../../componentes/comunes/TarjetaProducto'
import { usarProductos } from '../../hooks/usarProductos'
import { listarCategorias } from '../../servicios/categoriaServicio'

const mapaCategorias = {
  camisas: 'Camisas',
  camisetas: 'Camisetas',
  sacos: 'Sacos',
  jeans: 'Jeans',
  pantalonetas: 'Pantalonetas',
  polos: 'Polos',
  chaquetas: 'Chaquetas',
}

export function Categoria() {
  const { slug } = useParams()
  const nombre = mapaCategorias[slug]

  const [categoriaId, setCategoriaId] = useState(null)
  const [cargandoCategoria, setCargandoCategoria] = useState(true)
  const [buscar, setBuscar] = useState('')
  const [precioMin, setPrecioMin] = useState('')
  const [precioMax, setPrecioMax] = useState('')
  const [talla, setTalla] = useState('')
  const [soloDisponibles, setSoloDisponibles] = useState(false)
  const [orden, setOrden] = useState('recientes')

  useEffect(() => {
    let activo = true
    async function cargar() {
      setCargandoCategoria(true)
      try {
        const datos = await listarCategorias()
        if (activo) {
          const categoria = (datos.categorias || []).find((c) => c.nombre === nombre)
          setCategoriaId(categoria?.id || null)
        }
      } catch {
        if (activo) setCategoriaId(null)
      } finally {
        if (activo) setCargandoCategoria(false)
      }
    }
    cargar()
    return () => {
      activo = false
    }
  }, [nombre])

  const parametros = useMemo(
    () => ({
      solo_activos: true,
      buscar: buscar || undefined,
      categoria_id: categoriaId || undefined,
      precio_min: precioMin ? Number(precioMin) : undefined,
      precio_max: precioMax ? Number(precioMax) : undefined,
      talla: talla || undefined,
      solo_disponibles: soloDisponibles || undefined,
      orden,
    }),
    [buscar, categoriaId, precioMin, precioMax, talla, soloDisponibles, orden]
  )

  const { cargando, productos } = usarProductos(parametros)

  if (!nombre) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-10">
        <MensajeError titulo="Categoría no válida" detalle="Revisa la URL de la categoría." />
      </div>
    )
  }

  if (cargandoCategoria) {
    return <CargadorSpinner texto="Cargando categoría..." />
  }

  return (
    <div className="mx-auto max-w-[1440px] px-4 py-10 sm:px-6 lg:px-8">
      <div className="text-dorado text-xs tracking-widest">CATEGORÍA</div>
      <h1 className="mt-2 font-urbana text-4xl tracking-wide">{nombre}</h1>
      <div className="mt-6">
        <FiltrosCatalogoAvanzados
          buscar={buscar}
          onBuscar={setBuscar}
          precioMin={precioMin}
          onPrecioMin={setPrecioMin}
          precioMax={precioMax}
          onPrecioMax={setPrecioMax}
          talla={talla}
          onTalla={setTalla}
          soloDisponibles={soloDisponibles}
          onSoloDisponibles={setSoloDisponibles}
          orden={orden}
          onOrden={setOrden}
          ocultarCategoria
          onLimpiar={() => {
            setBuscar('')
            setPrecioMin('')
            setPrecioMax('')
            setTalla('')
            setSoloDisponibles(false)
            setOrden('recientes')
          }}
        />
      </div>

      {cargando ? (
        <CargadorSpinner />
      ) : (
        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5">
          {productos.map((p) => (
            <TarjetaProducto key={p.id} producto={p} />
          ))}
        </div>
      )}
    </div>
  )
}

