import { useEffect, useMemo, useState } from 'react'
import { TarjetaProducto } from '../../componentes/comunes/TarjetaProducto'
import { CargadorSpinner } from '../../componentes/comunes/CargadorSpinner'
import { MensajeError } from '../../componentes/comunes/MensajeError'
import { PaginacionProductos } from '../../componentes/comunes/PaginacionProductos'
import { FiltrosCatalogoAvanzados } from '../../componentes/comunes/FiltrosCatalogoAvanzados'
import { usarProductos } from '../../hooks/usarProductos'
import { listarCategorias } from '../../servicios/categoriaServicio'

function EsqueletoCatalogo() {
  return (
    <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5">
      {Array.from({ length: 10 }).map((_, indice) => (
        <div key={`catalogo-skeleton-${indice}`} className="surface-soft skeleton-shimmer overflow-hidden">
          <div className="aspect-[4/5] bg-white/[0.05]" />
          <div className="space-y-3 p-4">
            <div className="h-3 w-16 rounded-full bg-white/[0.06]" />
            <div className="h-4 w-4/5 rounded-full bg-white/[0.08]" />
            <div className="h-4 w-1/2 rounded-full bg-dorado/15" />
            <div className="h-3 w-1/3 rounded-full bg-white/[0.06]" />
          </div>
        </div>
      ))}
    </div>
  )
}

export function Catalogo() {
  const [buscar, setBuscar] = useState('')
  const [categoriaId, setCategoriaId] = useState('')
  const [precioMin, setPrecioMin] = useState('')
  const [precioMax, setPrecioMax] = useState('')
  const [talla, setTalla] = useState('')
  const [soloDisponibles, setSoloDisponibles] = useState(false)
  const [orden, setOrden] = useState('recientes')
  const [categorias, setCategorias] = useState([])
  const [cargandoCategorias, setCargandoCategorias] = useState(true)
  const [pagina, setPagina] = useState(1)
  const [semillaAleatoria] = useState(() => `${Date.now()}-${Math.random().toString(36).slice(2)}`)

  useEffect(() => {
    let activo = true
    async function cargar() {
      setCargandoCategorias(true)
      try {
        const datos = await listarCategorias()
        if (activo) setCategorias(datos.categorias || [])
      } finally {
        if (activo) setCargandoCategorias(false)
      }
    }
    cargar()
    return () => {
      activo = false
    }
  }, [])

  useEffect(() => {
    setPagina(1)
  }, [buscar, categoriaId, precioMin, precioMax, talla, soloDisponibles, orden])

  const mostrandoTodos =
    buscar.trim() === '' &&
    categoriaId === '' &&
    precioMin === '' &&
    precioMax === '' &&
    talla === '' &&
    !soloDisponibles &&
    orden === 'recientes'

  const parametros = useMemo(
    () => ({
      solo_activos: true,
      per_page: 15,
      buscar: buscar || undefined,
      categoria_id: categoriaId ? Number(categoriaId) : undefined,
      precio_min: precioMin ? Number(precioMin) : undefined,
      precio_max: precioMax ? Number(precioMax) : undefined,
      talla: talla || undefined,
      solo_disponibles: soloDisponibles || undefined,
      orden,
      aleatorio: mostrandoTodos || undefined,
      semilla: mostrandoTodos ? semillaAleatoria : undefined,
      page: pagina,
    }),
    [buscar, categoriaId, precioMin, precioMax, talla, soloDisponibles, orden, mostrandoTodos, pagina, semillaAleatoria]
  )

  const { cargando, error, productos, paginacion } = usarProductos(parametros)
  const categoriaSeleccionada = categorias.find((c) => String(c.id) === String(categoriaId))

  return (
    <div className="section-shell py-10 lg:py-12">
      <div className="surface-panel overflow-hidden p-6 sm:p-7">
        <div className="section-kicker">Catálogo</div>
        <h1 className="mt-2 font-urbana text-4xl tracking-wide sm:text-5xl">Explora tu próxima pinta</h1>
        <p className="mt-3 max-w-3xl text-sm leading-7 text-claro/65 sm:text-base">
          Descubre las prendas con el estilo de JD Store, filtra por talla, precio o disponibilidad y encuentra más rápido lo que quieres llevar.
        </p>
        {categoriaSeleccionada ? (
          <div className="mt-4 inline-flex rounded-full border border-dorado/20 bg-dorado/8 px-4 py-2 text-sm text-claro/70">
            Filtrando por: <span className="ml-2 font-semibold text-doradoClaro">{categoriaSeleccionada.nombre}</span>
          </div>
        ) : null}
      </div>

      <div className="mt-6">
        <FiltrosCatalogoAvanzados
          buscar={buscar}
          onBuscar={setBuscar}
          categoriaId={categoriaId}
          onCategoriaId={setCategoriaId}
          categorias={categorias}
          cargandoCategorias={cargandoCategorias}
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
          onLimpiar={() => {
            setBuscar('')
            setCategoriaId('')
            setPrecioMin('')
            setPrecioMax('')
            setTalla('')
            setSoloDisponibles(false)
            setOrden('recientes')
          }}
        />
      </div>

      {error ? (
        <div className="mt-8">
          <MensajeError detalle="No se pudo cargar el catálogo. Verifica que el backend esté encendido." />
        </div>
      ) : null}

      {!error && !cargando ? (
        <div className="surface-soft mt-6 flex flex-wrap items-center justify-between gap-3 px-4 py-4 text-sm text-claro/60">
          <div>
            Mostrando <span className="font-semibold text-claro/85">{productos.length}</span> productos
            {paginacion?.total ? (
              <>
                {' '}
                de <span className="font-semibold text-claro/85">{paginacion.total}</span>
              </>
            ) : null}
          </div>
          {paginacion?.current_page && paginacion?.last_page ? (
            <div>
              Página <span className="font-semibold text-claro/85">{paginacion.current_page}</span> de{' '}
              <span className="font-semibold text-claro/85">{paginacion.last_page}</span>
            </div>
          ) : null}
        </div>
      ) : null}

      {cargando ? (
        productos.length ? (
          <>
            <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 content-auto">
              {productos.map((p, indice) => (
                <TarjetaProducto key={p.id} producto={p} prioridadImagen={indice < 4} />
              ))}
            </div>
            <div className="mt-6">
              <CargadorSpinner texto="Actualizando catálogo..." />
            </div>
          </>
        ) : (
          <EsqueletoCatalogo />
        )
      ) : (
        <>
            <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 content-auto">
            {productos.map((p, indice) => (
              <TarjetaProducto key={p.id} producto={p} prioridadImagen={indice < 5} />
            ))}
          </div>
          <PaginacionProductos paginacion={paginacion} onCambiarPagina={setPagina} />
        </>
      )}
    </div>
  )
}

