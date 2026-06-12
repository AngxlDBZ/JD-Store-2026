import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { crearDestacado, eliminarDestacado, listarDestacadosAdmin, actualizarDestacado } from '../../servicios/destacadoServicio'
import { listarProductos } from '../../servicios/productoServicio'

export function GestionDestacados() {
  const [cargando, setCargando] = useState(true)
  const [destacados, setDestacados] = useState([])
  const [guardando, setGuardando] = useState(false)
  const [form, setForm] = useState({ producto_ref: '', orden: '0', activo: true })

  async function cargar() {
    setCargando(true)
    try {
      const datos = await listarDestacadosAdmin()
      setDestacados(datos.destacados?.data || [])
    } catch {
      toast.error('No se pudieron cargar los destacados')
    } finally {
      setCargando(false)
    }
  }

  useEffect(() => {
    cargar()
  }, [])

  async function resolverProductoId(referencia) {
    const valor = String(referencia || '').trim()
    if (!valor) return null

    if (/^\d+$/.test(valor)) {
      return Number(valor)
    }

    const datos = await listarProductos({ buscar: valor, per_page: 30 })
    const productos = datos?.productos?.data || []
    const coincidenciaExacta = productos.find((producto) => String(producto.sku || '').toLowerCase() === valor.toLowerCase())

    if (coincidenciaExacta) {
      return Number(coincidenciaExacta.id)
    }

    if (productos.length === 1) {
      return Number(productos[0].id)
    }

    return null
  }

  async function guardar(e) {
    e.preventDefault()
    const productoId = await resolverProductoId(form.producto_ref)
    if (!productoId) {
      toast.error('Escribe un ID numérico o el SKU exacto del producto')
      return
    }

    setGuardando(true)
    try {
      await crearDestacado({
        producto_id: productoId,
        orden: Number(form.orden || 0),
        activo: Boolean(form.activo),
      })
      toast.success('Destacado guardado')
      setForm({ producto_ref: '', orden: '0', activo: true })
      await cargar()
    } catch (error) {
      const data = error?.response?.data
      toast.error(data?.mensaje || 'No se pudo guardar')
    } finally {
      setGuardando(false)
    }
  }

  async function cambiar(destacado, cambios) {
    try {
      await actualizarDestacado(destacado.id, cambios)
      await cargar()
    } catch {
      toast.error('No se pudo actualizar')
    }
  }

  async function borrar(destacado) {
    try {
      await eliminarDestacado(destacado.id)
      toast.success('Eliminado')
      await cargar()
    } catch {
      toast.error('No se pudo eliminar')
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <div className="text-xs uppercase tracking-widest text-claro/50">Admin</div>
        <h1 className="mt-2 font-urbana text-4xl tracking-wide text-claro/90">Destacados</h1>
        <p className="mt-3 max-w-3xl text-sm text-claro/60">
          Aquí eliges los productos que se muestran primero en el inicio. Usa el orden para decidir cuál aparece antes.
        </p>
      </div>

      <form onSubmit={guardar} className="rounded-2xl border border-grisOscuro bg-grisOscuro/40 p-5">
        <div className="text-sm font-semibold text-claro/80">Agregar producto destacado</div>
        <p className="mt-2 max-w-2xl text-xs leading-6 text-claro/55">
          Puedes escribir el ID numérico del producto o su código único `SKU`. El orden define qué producto aparece primero.
        </p>
        <div className="mt-4 grid gap-3 md:grid-cols-3">
          <div>
            <div className="text-xs text-claro/50">Producto (ID o SKU)</div>
            <input
              value={form.producto_ref}
              onChange={(e) => setForm((f) => ({ ...f, producto_ref: e.target.value }))}
              placeholder="Ej: 15 o JD-TSHIRT-NEGRO"
              className="mt-1 rounded-xl border border-grisOscuro bg-oscuro/40 px-4 py-3 text-sm text-claro placeholder:text-claro/40 focus:border-dorado/50 focus:outline-none"
              required
            />
          </div>
          <div>
            <div className="text-xs text-claro/50">Orden de aparición</div>
            <input
              value={form.orden}
              onChange={(e) => setForm((f) => ({ ...f, orden: e.target.value.replace(/[^\d]/g, '') }))}
              placeholder="0"
              inputMode="numeric"
              className="mt-1 rounded-xl border border-grisOscuro bg-oscuro/40 px-4 py-3 text-sm text-claro placeholder:text-claro/40 focus:border-dorado/50 focus:outline-none"
            />
          </div>
          <div>
            <div className="text-xs text-claro/50">Estado del destacado</div>
            <label className="mt-1 flex items-center gap-3 rounded-xl border border-grisOscuro bg-oscuro/40 px-4 py-3 text-sm text-claro/70">
              <input
                type="checkbox"
                checked={form.activo}
                onChange={(e) => setForm((f) => ({ ...f, activo: e.target.checked }))}
                className="h-4 w-4 accent-[#d4af37]"
              />
              Mostrar en inicio
            </label>
          </div>
        </div>
        <button
          type="submit"
          disabled={guardando}
          className={`mt-4 rounded-xl px-4 py-3 text-sm font-semibold transition ${
            guardando ? 'bg-grisMedio/40 text-claro/50' : 'bg-dorado text-oscuro hover:bg-doradoClaro'
          }`}
        >
          {guardando ? 'Guardando...' : 'Guardar'}
        </button>
      </form>

      <div className="rounded-2xl border border-grisOscuro bg-grisOscuro/40 overflow-hidden">
        <div className="px-5 py-4 border-b border-grisOscuro flex items-center justify-between">
          <div className="text-sm font-semibold text-claro/80">Listado</div>
          <button
            type="button"
            onClick={cargar}
            className="text-xs rounded-lg border border-grisOscuro bg-oscuro/40 px-3 py-1 text-claro/70 hover:border-dorado/40 hover:text-doradoClaro transition"
          >
            Recargar
          </button>
        </div>
        <div className="divide-y divide-grisOscuro">
          {cargando ? (
            <div className="p-6 text-center text-claro/50">Cargando...</div>
          ) : destacados.length === 0 ? (
            <div className="p-6 text-center text-claro/50">Sin destacados</div>
          ) : (
            destacados.map((d) => (
              <div key={d.id} className="p-5 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                <div className="min-w-0">
                  <div className="font-semibold text-claro/90 truncate">{d.producto?.nombre || `Producto #${d.producto_id}`}</div>
                  <div className="text-xs text-claro/50">
                    {d.producto?.sku ? `SKU: ${d.producto.sku}` : `ID: ${d.producto_id}`}
                    {d.producto?.categoria?.nombre ? ` · ${d.producto.categoria.nombre}` : ''}
                  </div>
                  <div className="mt-2 flex flex-wrap gap-2 text-xs">
                    <span className="rounded-full border border-grisOscuro bg-oscuro/40 px-3 py-1 text-claro/60">Orden {d.orden ?? 0}</span>
                    <span className={`rounded-full border px-3 py-1 ${d.activo ? 'border-emerald-500/20 bg-emerald-500/10 text-emerald-200' : 'border-grisOscuro bg-oscuro/40 text-claro/60'}`}>
                      {d.activo ? 'Activo' : 'Inactivo'}
                    </span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => cambiar(d, { activo: !d.activo })}
                    className="rounded-lg bg-dorado px-4 py-2 text-sm font-semibold text-oscuro hover:bg-doradoClaro transition"
                  >
                    {d.activo ? 'Desactivar' : 'Activar'}
                  </button>
                  <button
                    type="button"
                    onClick={() => borrar(d)}
                    className="rounded-lg border border-grisOscuro bg-oscuro/40 px-4 py-2 text-sm text-claro/70 hover:border-dorado/40 hover:text-doradoClaro transition"
                  >
                    Eliminar
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}

