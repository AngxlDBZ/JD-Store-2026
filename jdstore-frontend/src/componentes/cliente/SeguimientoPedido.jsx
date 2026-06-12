const pasos = [
  { clave: 'pendiente', etiqueta: 'Pedido creado' },
  { clave: 'en_preparacion', etiqueta: 'En preparación' },
  { clave: 'enviado', etiqueta: 'En camino' },
  { clave: 'completado', etiqueta: 'Entregado' },
]

const ordenEstado = {
  pendiente: 0,
  en_preparacion: 1,
  enviado: 2,
  completado: 3,
  cancelado: -1,
}

export function SeguimientoPedido({ estado }) {
  if (estado === 'cancelado') {
    return (
      <div className="rounded-2xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-xs text-red-200">
        Este pedido fue cancelado.
      </div>
    )
  }

  const indiceActual = ordenEstado[estado] ?? 0

  return (
    <div className="grid gap-2 sm:grid-cols-4">
      {pasos.map((paso, indice) => {
        const activo = indice <= indiceActual
        return (
          <div
            key={paso.clave}
            className={`rounded-2xl border px-3 py-3 text-xs ${
              activo
                ? 'border-dorado/30 bg-dorado/10 text-doradoClaro'
                : 'border-grisOscuro bg-oscuro/30 text-claro/45'
            }`}
          >
            <div className="font-semibold">{paso.etiqueta}</div>
          </div>
        )
      })}
    </div>
  )
}
