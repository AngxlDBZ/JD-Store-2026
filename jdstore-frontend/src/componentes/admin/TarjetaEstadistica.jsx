export function TarjetaEstadistica({ titulo, valor }) {
  return (
    <div className="surface-panel p-5">
      <div className="text-xs uppercase tracking-[0.2em] text-claro/45">{titulo}</div>
      <div className="mt-2 text-2xl font-semibold text-claro/90">{valor}</div>
    </div>
  )
}

