import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { actualizarCupon, crearCupon, eliminarCupon, listarCuponesAdmin } from '../../servicios/cuponServicio'

function extraerError(error, fallback) {
  const data = error?.response?.data
  const primerCampo = data?.errors ? Object.keys(data.errors)[0] : null
  const primerError = primerCampo ? data.errors[primerCampo]?.[0] : null
  return typeof primerError === 'string' ? primerError : data?.mensaje || fallback
}

function capitalizar(valor) {
  return String(valor || '—')
    .replaceAll('_', ' ')
    .replace(/\b\w/g, (letra) => letra.toUpperCase())
}

export function GestionCupones() {
  const [cargando, setCargando] = useState(true)
  const [guardando, setGuardando] = useState(false)
  const [cupones, setCupones] = useState([])
  const [form, setForm] = useState({
    codigo: '',
    tipo: 'porcentaje',
    valor: '10',
    monto_minimo: '',
    uso_maximo: '',
    activo: true,
    fecha_inicio: '',
    fecha_fin: '',
  })

  async function cargar() {
    setCargando(true)
    try {
      const datos = await listarCuponesAdmin()
      setCupones(datos.cupones?.data || [])
    } catch {
      toast.error('No se pudieron cargar los cupones')
    } finally {
      setCargando(false)
    }
  }

  useEffect(() => {
    cargar()
  }, [])

  async function guardar(e) {
    e.preventDefault()
    setGuardando(true)
    try {
      await crearCupon({
        codigo: form.codigo.trim().toUpperCase(),
        tipo: form.tipo,
        valor: Number(form.valor || 0),
        monto_minimo: form.monto_minimo ? Number(form.monto_minimo) : undefined,
        uso_maximo: form.uso_maximo ? Number(form.uso_maximo) : undefined,
        activo: Boolean(form.activo),
        fecha_inicio: form.fecha_inicio || undefined,
        fecha_fin: form.fecha_fin || undefined,
      })
      toast.success('Cupón creado')
      setForm({
        codigo: '',
        tipo: 'porcentaje',
        valor: '10',
        monto_minimo: '',
        uso_maximo: '',
        activo: true,
        fecha_inicio: '',
        fecha_fin: '',
      })
      await cargar()
    } catch (error) {
      toast.error(extraerError(error, 'No se pudo crear el cupón'))
    } finally {
      setGuardando(false)
    }
  }

  async function alternarActivo(cupon) {
    try {
      await actualizarCupon(cupon.id, {
        codigo: cupon.codigo,
        tipo: cupon.tipo,
        valor: Number(cupon.valor || 0),
        monto_minimo: cupon.monto_minimo !== null ? Number(cupon.monto_minimo) : undefined,
        uso_maximo: cupon.uso_maximo !== null ? Number(cupon.uso_maximo) : undefined,
        activo: !cupon.activo,
        fecha_inicio: cupon.fecha_inicio || undefined,
        fecha_fin: cupon.fecha_fin || undefined,
      })
      toast.success(!cupon.activo ? 'Cupón activado' : 'Cupón desactivado')
      await cargar()
    } catch (error) {
      toast.error(extraerError(error, 'No se pudo actualizar el cupón'))
    }
  }

  async function borrar(cupon) {
    try {
      await eliminarCupon(cupon.id)
      toast.success('Cupón eliminado')
      await cargar()
    } catch {
      toast.error('No se pudo eliminar el cupón')
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <div className="text-xs uppercase tracking-widest text-claro/50">Admin</div>
        <h1 className="mt-2 font-urbana text-4xl tracking-wide text-claro/90">Cupones</h1>
        <p className="mt-3 max-w-3xl text-sm text-claro/60">
          Crea códigos de descuento para campañas, compras mínimas o usos limitados. Se aplican en checkout cuando el cliente escribe el código.
        </p>
      </div>

      <form onSubmit={guardar} className="rounded-2xl border border-grisOscuro bg-grisOscuro/40 p-5">
        <div className="text-sm font-semibold text-claro/80">Nuevo cupón</div>
        <div className="mt-4 grid gap-3 md:grid-cols-2">
          <input
            value={form.codigo}
            onChange={(e) => setForm((actual) => ({ ...actual, codigo: e.target.value.toUpperCase().replace(/\s+/g, '') }))}
            placeholder="Código del cupón"
            className="rounded-xl border border-grisOscuro bg-oscuro/40 px-4 py-3 text-sm text-claro placeholder:text-claro/40 focus:border-dorado/50 focus:outline-none"
            required
          />

          <div className="grid grid-cols-2 gap-3">
            <select
              value={form.tipo}
              onChange={(e) => setForm((actual) => ({ ...actual, tipo: e.target.value }))}
              className="rounded-xl border border-grisOscuro bg-oscuro/40 px-4 py-3 text-sm text-claro focus:border-dorado/50 focus:outline-none"
            >
              <option value="porcentaje">Porcentaje</option>
              <option value="fijo">Valor fijo</option>
            </select>
            <input
              value={form.valor}
              onChange={(e) => setForm((actual) => ({ ...actual, valor: e.target.value.replace(/[^\d.]/g, '') }))}
              placeholder="Valor"
              inputMode="decimal"
              className="rounded-xl border border-grisOscuro bg-oscuro/40 px-4 py-3 text-sm text-claro placeholder:text-claro/40 focus:border-dorado/50 focus:outline-none"
              required
            />
          </div>

          <input
            value={form.monto_minimo}
            onChange={(e) => setForm((actual) => ({ ...actual, monto_minimo: e.target.value.replace(/[^\d.]/g, '') }))}
            placeholder="Monto mínimo (opcional)"
            inputMode="decimal"
            className="rounded-xl border border-grisOscuro bg-oscuro/40 px-4 py-3 text-sm text-claro placeholder:text-claro/40 focus:border-dorado/50 focus:outline-none"
          />

          <input
            value={form.uso_maximo}
            onChange={(e) => setForm((actual) => ({ ...actual, uso_maximo: e.target.value.replace(/[^\d]/g, '') }))}
            placeholder="Uso máximo (opcional)"
            inputMode="numeric"
            className="rounded-xl border border-grisOscuro bg-oscuro/40 px-4 py-3 text-sm text-claro placeholder:text-claro/40 focus:border-dorado/50 focus:outline-none"
          />

          <label className="flex items-center gap-3 rounded-xl border border-grisOscuro bg-oscuro/40 px-4 py-3 text-sm text-claro/70">
            <input
              type="checkbox"
              checked={form.activo}
              onChange={(e) => setForm((actual) => ({ ...actual, activo: e.target.checked }))}
              className="h-4 w-4 accent-[#d4af37]"
            />
            Cupón activo
          </label>

          <div className="grid grid-cols-2 gap-3 md:col-span-2">
            <div>
              <div className="text-xs text-claro/50">Disponible desde</div>
              <input
                type="date"
                value={form.fecha_inicio}
                onChange={(e) => setForm((actual) => ({ ...actual, fecha_inicio: e.target.value }))}
                className="mt-1 w-full rounded-xl border border-grisOscuro bg-oscuro/40 px-4 py-3 text-sm text-claro/80 focus:border-dorado/50 focus:outline-none"
              />
            </div>
            <div>
              <div className="text-xs text-claro/50">Disponible hasta</div>
              <input
                type="date"
                value={form.fecha_fin}
                onChange={(e) => setForm((actual) => ({ ...actual, fecha_fin: e.target.value }))}
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
          {guardando ? 'Guardando...' : 'Crear cupón'}
        </button>
      </form>

      <div className="rounded-2xl border border-grisOscuro bg-grisOscuro/40 overflow-hidden">
        <div className="flex items-center justify-between border-b border-grisOscuro px-5 py-4">
          <div className="text-sm font-semibold text-claro/80">Cupones creados</div>
          <button
            type="button"
            onClick={cargar}
            className="rounded-lg border border-grisOscuro bg-oscuro/40 px-3 py-1 text-xs text-claro/70 transition hover:border-dorado/40 hover:text-doradoClaro"
          >
            Recargar
          </button>
        </div>

        <div className="divide-y divide-grisOscuro">
          {cargando ? (
            <div className="p-6 text-center text-claro/50">Cargando...</div>
          ) : cupones.length === 0 ? (
            <div className="p-6 text-center text-claro/50">Aún no hay cupones creados.</div>
          ) : (
            cupones.map((cupon) => (
              <div key={cupon.id} className="flex flex-col gap-4 p-5 lg:flex-row lg:items-center lg:justify-between">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <div className="font-semibold text-claro/90">{cupon.codigo}</div>
                    <div className={`rounded-full border px-3 py-1 text-xs ${cupon.activo ? 'border-emerald-500/20 bg-emerald-500/10 text-emerald-200' : 'border-grisOscuro bg-oscuro/40 text-claro/60'}`}>
                      {cupon.activo ? 'Activo' : 'Inactivo'}
                    </div>
                    <div className="rounded-full border border-grisOscuro bg-oscuro/40 px-3 py-1 text-xs text-claro/70">
                      {capitalizar(cupon.tipo)}: {cupon.valor}
                    </div>
                  </div>

                  <div className="mt-2 flex flex-wrap gap-x-4 gap-y-2 text-xs text-claro/50">
                    <span>Uso actual: {cupon.uso_actual ?? 0}</span>
                    <span>Uso máximo: {cupon.uso_maximo ?? 'Sin límite'}</span>
                    <span>Monto mínimo: {cupon.monto_minimo ?? 'No aplica'}</span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-3">
                  <button
                    type="button"
                    onClick={() => alternarActivo(cupon)}
                    className="rounded-lg border border-grisOscuro bg-oscuro/40 px-4 py-2 text-sm text-claro/70 transition hover:border-dorado/40 hover:text-doradoClaro"
                  >
                    {cupon.activo ? 'Desactivar' : 'Activar'}
                  </button>
                  <button
                    type="button"
                    onClick={() => borrar(cupon)}
                    className="rounded-lg border border-grisOscuro bg-oscuro/40 px-4 py-2 text-sm text-claro/70 transition hover:border-red-400/40 hover:text-red-300"
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
