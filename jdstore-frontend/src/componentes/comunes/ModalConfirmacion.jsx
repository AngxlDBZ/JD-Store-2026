export function ModalConfirmacion({ abierto, titulo, descripcion, confirmarTexto = 'Confirmar', onCancelar, onConfirmar }) {
  if (!abierto) return null

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/60 p-4">
      <div className="w-full max-w-md rounded-2xl border border-grisOscuro bg-grisOscuro p-5">
        <div className="font-semibold text-claro">{titulo}</div>
        {descripcion ? <div className="mt-2 text-sm text-claro/70">{descripcion}</div> : null}
        <div className="mt-5 flex justify-end gap-2">
          <button
            type="button"
            onClick={onCancelar}
            className="rounded-xl border border-grisMedio bg-transparent px-4 py-2 text-sm text-claro/80 hover:border-dorado/40 transition"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={onConfirmar}
            className="rounded-xl bg-dorado px-4 py-2 text-sm font-semibold text-oscuro hover:bg-doradoClaro transition"
          >
            {confirmarTexto}
          </button>
        </div>
      </div>
    </div>
  )
}

