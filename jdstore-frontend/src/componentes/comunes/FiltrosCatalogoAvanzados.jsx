import { tallasDisponibles } from '../../constantes/tallas'

export function FiltrosCatalogoAvanzados({
  buscar,
  onBuscar,
  categoriaId = '',
  onCategoriaId,
  categorias = [],
  cargandoCategorias = false,
  precioMin = '',
  onPrecioMin,
  precioMax = '',
  onPrecioMax,
  talla = '',
  onTalla,
  soloDisponibles = false,
  onSoloDisponibles,
  orden = 'recientes',
  onOrden,
  onLimpiar,
  ocultarCategoria = false,
}) {
  return (
    <section className="surface-panel w-full p-5 sm:p-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <div className="section-kicker">Filtros</div>
          <p className="mt-1 text-sm text-claro/60">Encuentra más rápido por nombre, precio, talla y disponibilidad.</p>
        </div>

        <button
          type="button"
          onClick={onLimpiar}
          className="inline-flex items-center justify-center rounded-xl border border-grisOscuro bg-oscuro/40 px-4 py-3 text-sm text-claro/75 transition hover:border-dorado/40 hover:text-doradoClaro"
        >
          Limpiar filtros
        </button>
      </div>

      <div className="mt-5 grid gap-4 xl:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)_minmax(0,1fr)]">
        <div className="space-y-2">
          <label className="block text-xs font-semibold uppercase tracking-[0.18em] text-claro/45">Búsqueda</label>
          <input
            value={buscar}
            onChange={(e) => onBuscar(e.target.value)}
            placeholder="Buscar por nombre, categoría o SKU..."
            className="w-full rounded-2xl border border-grisOscuro bg-grisOscuro/40 px-4 py-3 text-sm text-claro placeholder:text-claro/40 focus:border-dorado/45 focus:outline-none"
          />
        </div>

        {!ocultarCategoria ? (
          <div className="space-y-2">
            <label className="block text-xs font-semibold uppercase tracking-[0.18em] text-claro/45">Categoría</label>
            <select
              value={categoriaId}
              onChange={(e) => onCategoriaId(e.target.value)}
              disabled={cargandoCategorias}
              className="w-full rounded-2xl border border-grisOscuro bg-grisOscuro/40 px-4 py-3 text-sm text-claro focus:border-dorado/45 focus:outline-none"
            >
              <option value="">Todas las categorías</option>
              {categorias.map((categoria) => (
                <option key={categoria.id} value={categoria.id}>
                  {categoria.nombre}
                </option>
              ))}
            </select>
          </div>
        ) : null}

        <div className="space-y-2">
          <label className="block text-xs font-semibold uppercase tracking-[0.18em] text-claro/45">Ordenar por</label>
          <select
            value={orden}
            onChange={(e) => onOrden(e.target.value)}
            className="w-full rounded-2xl border border-grisOscuro bg-grisOscuro/40 px-4 py-3 text-sm text-claro focus:border-dorado/45 focus:outline-none"
          >
            <option value="recientes">Más recientes</option>
            <option value="precio_asc">Precio: menor a mayor</option>
            <option value="precio_desc">Precio: mayor a menor</option>
            <option value="mas_vendidos">Más vendidos</option>
          </select>
        </div>
      </div>

      <div className="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)_minmax(0,1.1fr)]">
        <div className="space-y-2">
          <label className="block text-xs font-semibold uppercase tracking-[0.18em] text-claro/45">Rango de precio</label>
          <div className="grid grid-cols-2 gap-3">
            <input
              value={precioMin}
              onChange={(e) => onPrecioMin(e.target.value.replace(/[^\d]/g, ''))}
              placeholder="Mínimo"
              inputMode="numeric"
              className="w-full rounded-2xl border border-grisOscuro bg-grisOscuro/40 px-4 py-3 text-sm text-claro placeholder:text-claro/40 focus:border-dorado/45 focus:outline-none"
            />
            <input
              value={precioMax}
              onChange={(e) => onPrecioMax(e.target.value.replace(/[^\d]/g, ''))}
              placeholder="Máximo"
              inputMode="numeric"
              className="w-full rounded-2xl border border-grisOscuro bg-grisOscuro/40 px-4 py-3 text-sm text-claro placeholder:text-claro/40 focus:border-dorado/45 focus:outline-none"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="block text-xs font-semibold uppercase tracking-[0.18em] text-claro/45">Talla</label>
          <select
            value={talla}
            onChange={(e) => onTalla(e.target.value)}
            className="w-full rounded-2xl border border-grisOscuro bg-grisOscuro/40 px-4 py-3 text-sm text-claro focus:border-dorado/45 focus:outline-none"
          >
            <option value="">Todas las tallas</option>
            {tallasDisponibles.map((valorTalla) => (
              <option key={valorTalla} value={valorTalla}>
                {valorTalla}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-2">
          <label className="block text-xs font-semibold uppercase tracking-[0.18em] text-claro/45">Disponibilidad</label>
          <label className="flex min-h-[50px] items-center gap-3 rounded-2xl border border-grisOscuro bg-grisOscuro/30 px-4 py-3 text-sm text-claro/75">
            <input
              type="checkbox"
              checked={soloDisponibles}
              onChange={(e) => onSoloDisponibles(e.target.checked)}
              className="h-4 w-4 accent-[#d4af37]"
            />
            Mostrar solo productos disponibles
          </label>
        </div>
      </div>
    </section>
  )
}
