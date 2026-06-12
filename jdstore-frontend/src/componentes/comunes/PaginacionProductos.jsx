export function PaginacionProductos({ paginacion, onCambiarPagina }) {
  if (!paginacion || (paginacion.last_page || 1) <= 1) return null

  return (
    <div className="mt-8 flex flex-wrap items-center justify-center gap-4 text-sm text-claro/70">
      <div>
        {paginacion.from || 0}-{paginacion.to || 0} de {paginacion.total || 0}
      </div>
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => onCambiarPagina(paginacion.current_page - 1)}
          disabled={!paginacion.prev_page_url}
          className={`grid h-10 w-10 place-items-center rounded-xl border transition ${
            paginacion.prev_page_url
              ? 'border-grisOscuro bg-oscuro/40 text-claro/80 hover:border-dorado/40 hover:text-doradoClaro'
              : 'border-grisOscuro bg-oscuro/20 text-claro/30'
          }`}
          aria-label="Página anterior"
        >
          ‹
        </button>
        <div className="min-w-20 text-center text-claro/80">
          {paginacion.current_page} / {paginacion.last_page}
        </div>
        <button
          type="button"
          onClick={() => onCambiarPagina(paginacion.current_page + 1)}
          disabled={!paginacion.next_page_url}
          className={`grid h-10 w-10 place-items-center rounded-xl border transition ${
            paginacion.next_page_url
              ? 'border-grisOscuro bg-oscuro/40 text-claro/80 hover:border-dorado/40 hover:text-doradoClaro'
              : 'border-grisOscuro bg-oscuro/20 text-claro/30'
          }`}
          aria-label="Página siguiente"
        >
          ›
        </button>
      </div>
    </div>
  )
}
