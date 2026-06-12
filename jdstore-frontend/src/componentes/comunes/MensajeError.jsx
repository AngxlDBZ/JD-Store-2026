export function MensajeError({ titulo = 'Ocurrió un error', detalle }) {
  return (
    <div className="rounded-2xl border border-red-500/30 bg-red-500/10 p-4 text-left">
      <div className="font-semibold text-red-200">{titulo}</div>
      {detalle ? <div className="mt-1 text-sm text-red-200/70">{detalle}</div> : null}
    </div>
  )
}

