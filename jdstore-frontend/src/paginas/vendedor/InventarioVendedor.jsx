import { useState } from 'react'
import toast from 'react-hot-toast'
import { consultarInventarioPorSku } from '../../servicios/inventarioServicio'

function extraerMensaje(error, fallback) {
  const mensaje = error?.response?.data?.mensaje
  return typeof mensaje === 'string' && mensaje.trim() ? mensaje : fallback
}

export function InventarioVendedor() {
  const [sku, setSku] = useState('')
  const [cargando, setCargando] = useState(false)
  const [resultado, setResultado] = useState(null)

  async function consultar() {
    const skuNormalizado = sku.trim()
    if (!skuNormalizado) {
      toast.error('Ingresa un SKU')
      return
    }

    setCargando(true)
    try {
      const datos = await consultarInventarioPorSku(skuNormalizado)
      setResultado(datos)
    } catch (error) {
      setResultado(null)
      toast.error(extraerMensaje(error, 'No se pudo consultar el inventario'))
    } finally {
      setCargando(false)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <div className="text-xs uppercase tracking-widest text-claro/50">Vendedor</div>
        <h1 className="mt-2 font-urbana text-3xl tracking-wide text-claro/90 sm:text-4xl">Consulta de inventario</h1>
      </div>

      <div className="rounded-2xl border border-grisOscuro bg-grisOscuro/40 p-5">
        <div className="text-sm font-semibold text-dorado">Buscar por SKU</div>
        <div className="mt-4 flex flex-wrap gap-3">
          <input
            value={sku}
            onChange={(e) => setSku(e.target.value.toUpperCase())}
            placeholder="Ej: JD-CAM-001-M"
            className="min-w-[260px] flex-1 rounded-xl border border-grisOscuro bg-oscuro/40 px-4 py-3 text-sm text-claro/80 placeholder:text-claro/40 focus:border-dorado/60 focus:outline-none"
          />
          <button
            type="button"
            onClick={consultar}
            disabled={cargando}
            className={`rounded-xl px-4 py-3 text-sm font-semibold transition ${
              cargando ? 'bg-grisMedio/40 text-claro/50' : 'bg-dorado text-oscuro hover:bg-doradoClaro'
            }`}
          >
            {cargando ? 'Consultando...' : 'Consultar'}
          </button>
        </div>
      </div>

      <div className="rounded-2xl border border-grisOscuro bg-grisOscuro/40 p-5">
        <div className="text-sm font-semibold text-dorado">Resultado</div>
        {!resultado ? (
          <div className="mt-4 rounded-2xl border border-grisOscuro bg-oscuro/40 p-4 text-sm text-claro/60">
            Consulta un SKU para ver stock, talla y estado disponible.
          </div>
        ) : (
          <div className="mt-4 grid gap-3 text-sm text-claro/75 sm:grid-cols-2 xl:grid-cols-4">
            <div className="rounded-2xl border border-grisOscuro bg-oscuro/40 p-4">
              <div className="text-xs text-claro/50">SKU</div>
              <div className="mt-2 font-semibold text-claro">{resultado.sku || '—'}</div>
            </div>
            <div className="rounded-2xl border border-grisOscuro bg-oscuro/40 p-4">
              <div className="text-xs text-claro/50">Stock</div>
              <div className="mt-2 font-semibold text-dorado">{resultado.stock ?? 0}</div>
            </div>
            <div className="rounded-2xl border border-grisOscuro bg-oscuro/40 p-4">
              <div className="text-xs text-claro/50">Estado</div>
              <div className="mt-2 font-semibold text-claro">{resultado.estado || '—'}</div>
            </div>
            <div className="rounded-2xl border border-grisOscuro bg-oscuro/40 p-4">
              <div className="text-xs text-claro/50">Talla</div>
              <div className="mt-2 font-semibold text-claro">{resultado.talla || 'No aplica'}</div>
            </div>
            {'producto' in resultado ? (
              <div className="rounded-2xl border border-grisOscuro bg-oscuro/40 p-4 sm:col-span-2 xl:col-span-4">
                <div className="text-xs text-claro/50">Producto</div>
                <div className="mt-2 font-semibold text-claro">{resultado.producto || '—'}</div>
              </div>
            ) : null}
          </div>
        )}
      </div>
    </div>
  )
}
