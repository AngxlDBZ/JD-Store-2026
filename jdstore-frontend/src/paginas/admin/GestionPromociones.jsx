import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { listarCategorias } from '../../servicios/categoriaServicio'
import { crearPromocion, eliminarPromocion, listarPromociones } from '../../servicios/promocionServicio'

function capitalizarEstado(valor) {
  return String(valor || '—')
    .replaceAll('_', ' ')
    .replace(/\b\w/g, (letra) => letra.toUpperCase())
}

function extraerError(error, fallback) {
  const data = error?.response?.data
  const primerCampo = data?.errors ? Object.keys(data.errors)[0] : null
  const primerError = primerCampo ? data.errors[primerCampo]?.[0] : null
  return typeof primerError === 'string' ? primerError : data?.mensaje || fallback
}

export function GestionPromociones() {
  const [cargando, setCargando] = useState(true)
  const [promociones, setPromociones] = useState([])
  const [categorias, setCategorias] = useState([])
  const [guardando, setGuardando] = useState(false)
  const [form, setForm] = useState({
    titulo: '',
    tipo: 'porcentaje',
    valor: '10',
    producto_id: '',
    categoria_id: '',
    activo: true,
    fecha_inicio: '',
    fecha_fin: '',
  })

  async function cargar() {
    setCargando(true)
    try {
      const datos = await listarPromociones()
      setPromociones(datos.promociones?.data || [])
    } catch {
      toast.error('No se pudieron cargar las promociones')
    } finally {
      setCargando(false)
    }
  }

  useEffect(() => {
    let activo = true

    async function cargarCatalogos() {
      try {
        const datosCategorias = await listarCategorias()
        if (activo) setCategorias(datosCategorias.categorias || [])
      } catch {
        if (activo) setCategorias([])
      }
    }

    cargarCatalogos()
    cargar()

    return () => {
      activo = false
    }
  }, [])

  async function guardar(e) {
    e.preventDefault()
    setGuardando(true)
    try {
      const payload = {
        titulo: form.titulo.trim() || undefined,
        tipo: form.tipo,
        valor: Number(form.valor || 0),
        producto_id: form.producto_id ? Number(form.producto_id) : undefined,
        categoria_id: form.categoria_id ? Number(form.categoria_id) : undefined,
        activo: Boolean(form.activo),
        fecha_inicio: form.fecha_inicio || undefined,
        fecha_fin: form.fecha_fin || undefined,
      }
      await crearPromocion(payload)
      toast.success('Promoción creada')
      setForm({
        titulo: '',
        tipo: 'porcentaje',
        valor: '10',
        producto_id: '',
        categoria_id: '',
        activo: true,
        fecha_inicio: '',
        fecha_fin: '',
      })
      await cargar()
    } catch (error) {
      toast.error(extraerError(error, 'No se pudo crear la promoción'))
    } finally {
      setGuardando(false)
    }
  }

  async function borrar(promocion) {
    try {
      await eliminarPromocion(promocion.id)
      toast.success('Promoción eliminada')
      await cargar()
    } catch {
      toast.error('No se pudo eliminar')
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <div className="text-xs uppercase tracking-widest text-claro/50">Admin</div>
        <h1 className="mt-2 font-urbana text-4xl tracking-wide text-claro/90">Promociones</h1>
        <p className="mt-3 max-w-3xl text-sm text-claro/60">
          Crea descuentos por porcentaje o valor fijo. Puedes aplicarlos a toda la tienda, a una categoría o a un producto específico.
        </p>
      </div>

      <form onSubmit={guardar} className="rounded-2xl border border-grisOscuro bg-grisOscuro/40 p-5">
        <div className="text-sm font-semibold text-claro/80">Nueva promoción</div>
        <div className="mt-4 grid gap-3 md:grid-cols-2">
          <input
            value={form.titulo}
            onChange={(e) => setForm((f) => ({ ...f, titulo: e.target.value }))}
            placeholder="Título (opcional)"
            className="rounded-xl border border-grisOscuro bg-oscuro/40 px-4 py-3 text-sm text-claro placeholder:text-claro/40 focus:border-dorado/50 focus:outline-none"
          />
          <div className="grid grid-cols-2 gap-3">
            <select
              value={form.tipo}
              onChange={(e) => setForm((f) => ({ ...f, tipo: e.target.value }))}
              className="rounded-xl border border-grisOscuro bg-oscuro/40 px-4 py-3 text-sm text-claro focus:border-dorado/50 focus:outline-none"
            >
              <option value="porcentaje">Porcentaje</option>
              <option value="fijo">Fijo</option>
            </select>
            <input
              value={form.valor}
              onChange={(e) => setForm((f) => ({ ...f, valor: e.target.value.replace(/[^\d.]/g, '') }))}
              placeholder="Valor"
              inputMode="decimal"
              className="rounded-xl border border-grisOscuro bg-oscuro/40 px-4 py-3 text-sm text-claro placeholder:text-claro/40 focus:border-dorado/50 focus:outline-none"
              required
            />
          </div>

          <input
            value={form.producto_id}
            onChange={(e) => setForm((f) => ({ ...f, producto_id: e.target.value.replace(/[^\d]/g, '') }))}
            placeholder="producto_id (opcional)"
            inputMode="numeric"
            className="rounded-xl border border-grisOscuro bg-oscuro/40 px-4 py-3 text-sm text-claro placeholder:text-claro/40 focus:border-dorado/50 focus:outline-none"
          />

          <select
            value={form.categoria_id}
            onChange={(e) => setForm((f) => ({ ...f, categoria_id: e.target.value }))}
            className="rounded-xl border border-grisOscuro bg-oscuro/40 px-4 py-3 text-sm text-claro focus:border-dorado/50 focus:outline-none"
          >
            <option value="">Categoría (opcional)</option>
            {categorias.map((c) => (
              <option key={c.id} value={c.id}>
                {c.nombre}
              </option>
            ))}
          </select>

          <label className="flex items-center gap-3 rounded-xl border border-grisOscuro bg-oscuro/40 px-4 py-3 text-sm text-claro/70">
            <input
              type="checkbox"
              checked={form.activo}
              onChange={(e) => setForm((f) => ({ ...f, activo: e.target.checked }))}
              className="h-4 w-4 accent-[#d4af37]"
            />
            Activa
          </label>

          <div className="grid grid-cols-2 gap-3 md:col-span-2">
            <div>
              <div className="text-xs text-claro/50">Inicio</div>
              <input
                type="date"
                value={form.fecha_inicio}
                onChange={(e) => setForm((f) => ({ ...f, fecha_inicio: e.target.value }))}
                className="mt-1 w-full rounded-xl border border-grisOscuro bg-oscuro/40 px-4 py-3 text-sm text-claro/80 focus:border-dorado/50 focus:outline-none"
              />
            </div>
            <div>
              <div className="text-xs text-claro/50">Fin</div>
              <input
                type="date"
                value={form.fecha_fin}
                onChange={(e) => setForm((f) => ({ ...f, fecha_fin: e.target.value }))}
                className="mt-1 w-full rounded-xl border border-grisOscuro bg-oscuro/40 px-4 py-3 text-sm text-claro/80 focus:border-dorado/50 focus:outline-none"
              />
            </div>
          </div>
        </div>
        <button
          type="submit"
          disabled={guardando}
          className={`mt-4 rounded-xl px-4 py-3 text-sm font-semibold transition ${
            guardando ? 'bg-grisMedio/40 text-claro/50' : 'bg-dorado text-oscuro hover:bg-doradoClaro'
          }`}
        >
          {guardando ? 'Guardando...' : 'Crear promoción'}
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
          ) : promociones.length === 0 ? (
            <div className="p-6 text-center text-claro/50">Sin promociones</div>
          ) : (
            promociones.map((p) => (
              <div key={p.id} className="p-5 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <div className="font-semibold text-claro/90 truncate">{p.titulo || `Promoción #${p.id}`}</div>
                    <div className={`text-xs rounded-full px-3 py-1 border ${p.activo ? 'border-emerald-500/20 bg-emerald-500/10 text-emerald-200' : 'border-grisOscuro bg-oscuro/40 text-claro/60'}`}>
                      {p.activo ? 'Activa' : 'Inactiva'}
                    </div>
                    <div className="text-xs rounded-full px-3 py-1 border border-grisOscuro bg-oscuro/40 text-claro/70">
                      {capitalizarEstado(p.tipo)}: {p.valor}
                    </div>
                  </div>
                  <div className="mt-2 text-xs text-claro/50">
                    Alcance: {p.producto_id ? `Producto #${p.producto_id}` : p.categoria_id ? `Categoría #${p.categoria_id}` : 'Global'}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => borrar(p)}
                  className="rounded-lg border border-grisOscuro bg-oscuro/40 px-4 py-2 text-sm text-claro/70 hover:border-dorado/40 hover:text-doradoClaro transition"
                >
                  Eliminar
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}

