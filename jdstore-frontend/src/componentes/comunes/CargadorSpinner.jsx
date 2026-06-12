export function CargadorSpinner({ texto = 'Cargando...' }) {
  return (
    <div className="min-h-[40vh] grid place-items-center">
      <div className="flex items-center gap-3 text-claro/70">
        <div className="h-4 w-4 rounded-full border-2 border-dorado border-t-transparent animate-spin" />
        <span className="text-sm">{texto}</span>
      </div>
    </div>
  )
}

