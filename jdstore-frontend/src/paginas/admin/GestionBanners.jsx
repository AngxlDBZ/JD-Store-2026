import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { actualizarBanner, crearBanner, eliminarBanner, listarBannersAdmin } from '../../servicios/bannerServicio'
import { resolverUrlImagen } from '../../utilidades/resolverUrlImagen'

function extraerError(error, fallback) {
  const data = error?.response?.data
  const primerCampo = data?.errors ? Object.keys(data.errors)[0] : null
  const primerError = primerCampo ? data.errors[primerCampo]?.[0] : null
  return typeof primerError === 'string' ? primerError : data?.mensaje || fallback
}

export function GestionBanners() {
  const [cargando, setCargando] = useState(true)
  const [banners, setBanners] = useState([])
  const [editando, setEditando] = useState(null)
  const [guardando, setGuardando] = useState(false)
  const [form, setForm] = useState({
    titulo: '',
    subtitulo: '',
    enlace_url: '',
    orden: '0',
    activo: true,
    fecha_inicio: '',
    fecha_fin: '',
    imagen: null,
    imagen_url: '',
  })

  async function cargar() {
    setCargando(true)
    try {
      const datos = await listarBannersAdmin()
      setBanners(datos.banners?.data || [])
    } catch {
      toast.error('No se pudieron cargar los banners')
    } finally {
      setCargando(false)
    }
  }

  useEffect(() => {
    cargar()
  }, [])

  function limpiarForm() {
    setEditando(null)
    setForm({
      titulo: '',
      subtitulo: '',
      enlace_url: '',
      orden: '0',
      activo: true,
      fecha_inicio: '',
      fecha_fin: '',
      imagen: null,
      imagen_url: '',
    })
  }

  function editar(banner) {
    setEditando(banner)
    setForm({
      titulo: banner.titulo || '',
      subtitulo: banner.subtitulo || '',
      enlace_url: banner.enlace_url || '',
      orden: String(banner.orden ?? 0),
      activo: Boolean(banner.activo),
      fecha_inicio: banner.fecha_inicio ? String(banner.fecha_inicio).slice(0, 10) : '',
      fecha_fin: banner.fecha_fin ? String(banner.fecha_fin).slice(0, 10) : '',
      imagen: null,
      imagen_url: banner.imagen_url || '',
    })
  }

  async function guardar(e) {
    e.preventDefault()
    if (form.titulo.trim().length < 3) {
      toast.error('Ingresa un título válido')
      return
    }

    setGuardando(true)
    try {
      const payload = new FormData()
      payload.append('titulo', form.titulo.trim())
      if (form.subtitulo.trim()) payload.append('subtitulo', form.subtitulo.trim())
      if (form.enlace_url.trim()) payload.append('enlace_url', form.enlace_url.trim())
      payload.append('orden', String(Number(form.orden || 0)))
      payload.append('activo', form.activo ? '1' : '0')
      if (form.fecha_inicio) payload.append('fecha_inicio', form.fecha_inicio)
      if (form.fecha_fin) payload.append('fecha_fin', form.fecha_fin)
      if (form.imagen instanceof File) payload.append('imagen', form.imagen)
      if (form.imagen_url.trim()) payload.append('imagen_url', form.imagen_url.trim())

      if (editando) {
        await actualizarBanner(editando.id, payload)
        toast.success('Banner actualizado')
      } else {
        await crearBanner(payload)
        toast.success('Banner creado')
      }

      limpiarForm()
      await cargar()
    } catch (error) {
      toast.error(extraerError(error, 'No se pudo guardar'))
    } finally {
      setGuardando(false)
    }
  }

  async function borrar(banner) {
    try {
      await eliminarBanner(banner.id)
      toast.success('Banner eliminado')
      await cargar()
    } catch {
      toast.error('No se pudo eliminar')
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <div className="text-xs uppercase tracking-widest text-claro/50">Admin</div>
        <h1 className="mt-2 font-urbana text-4xl tracking-wide text-claro/90">Banners</h1>
        <p className="mt-3 max-w-3xl text-sm text-claro/60">
          Este banner controla la imagen de fondo del bloque principal del inicio, además del título, subtítulo y botón de promoción.
        </p>
      </div>

      <form onSubmit={guardar} className="rounded-2xl border border-grisOscuro bg-grisOscuro/40 p-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="text-sm font-semibold text-claro/80">{editando ? `Editando #${editando.id}` : 'Nuevo banner'}</div>
          <div className="flex gap-2">
            {editando ? (
              <button
                type="button"
                onClick={limpiarForm}
                className="rounded-xl border border-grisOscuro bg-oscuro/40 px-4 py-2 text-sm text-claro/70 transition hover:border-dorado/40 hover:text-doradoClaro"
              >
                Cancelar
              </button>
            ) : null}
            <button
              type="submit"
              disabled={guardando}
              className={`rounded-xl px-4 py-2 text-sm font-semibold transition ${
                guardando ? 'bg-grisMedio/40 text-claro/50' : 'bg-dorado text-oscuro hover:bg-doradoClaro'
              }`}
            >
              {guardando ? 'Guardando...' : 'Guardar'}
            </button>
          </div>
        </div>

        <div className="mt-4 grid gap-3 md:grid-cols-2">
          <div>
            <div className="text-xs text-claro/50">Título principal</div>
            <input
              value={form.titulo}
              onChange={(e) => setForm((f) => ({ ...f, titulo: e.target.value }))}
              placeholder="Texto principal del banner"
              className="mt-1 rounded-xl border border-grisOscuro bg-oscuro/40 px-4 py-3 text-sm text-claro placeholder:text-claro/40 focus:border-dorado/50 focus:outline-none"
              required
            />
          </div>
          <div>
            <div className="text-xs text-claro/50">Subtítulo</div>
            <input
              value={form.subtitulo}
              onChange={(e) => setForm((f) => ({ ...f, subtitulo: e.target.value }))}
              placeholder="Texto secundario"
              className="mt-1 rounded-xl border border-grisOscuro bg-oscuro/40 px-4 py-3 text-sm text-claro placeholder:text-claro/40 focus:border-dorado/50 focus:outline-none"
            />
          </div>
          <div>
            <div className="text-xs text-claro/50">Enlace del botón</div>
            <input
              value={form.enlace_url}
              onChange={(e) => setForm((f) => ({ ...f, enlace_url: e.target.value }))}
              placeholder="URL opcional para la promoción"
              className="mt-1 rounded-xl border border-grisOscuro bg-oscuro/40 px-4 py-3 text-sm text-claro placeholder:text-claro/40 focus:border-dorado/50 focus:outline-none"
            />
          </div>
          <div>
            <div className="text-xs text-claro/50">Imagen por URL</div>
            <input
              value={form.imagen_url}
              onChange={(e) => setForm((f) => ({ ...f, imagen_url: e.target.value }))}
              placeholder="Pega una URL si no vas a subir archivo"
              className="mt-1 rounded-xl border border-grisOscuro bg-oscuro/40 px-4 py-3 text-sm text-claro placeholder:text-claro/40 focus:border-dorado/50 focus:outline-none"
            />
          </div>
          <div className="rounded-xl border border-grisOscuro bg-oscuro/40 px-4 py-3 text-sm text-claro/70">
            <div className="text-xs text-claro/50">Imagen del banner</div>
            <div className="mt-1 text-xs text-claro/45">Sube una imagen horizontal. Si subes archivo, este tendrá prioridad.</div>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setForm((f) => ({ ...f, imagen: e.target.files?.[0] || null }))}
              className="mt-3 w-full text-sm text-claro/70"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <div className="text-xs text-claro/50">Orden de prioridad</div>
              <input
                value={form.orden}
                onChange={(e) => setForm((f) => ({ ...f, orden: e.target.value.replace(/[^\d]/g, '') }))}
                placeholder="0"
                inputMode="numeric"
                className="mt-1 rounded-xl border border-grisOscuro bg-oscuro/40 px-4 py-3 text-sm text-claro placeholder:text-claro/40 focus:border-dorado/50 focus:outline-none"
              />
            </div>
            <div>
              <div className="text-xs text-claro/50">Estado del banner</div>
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
          ) : banners.length === 0 ? (
            <div className="p-6 text-center text-claro/50">Sin banners</div>
          ) : (
            banners.map((b) => (
              <div key={b.id} className="p-5 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                <div className="flex items-center gap-4 min-w-0">
                  <div className="h-14 w-24 rounded-xl overflow-hidden border border-grisOscuro bg-oscuro/40 shrink-0">
                    {b.imagen_url ? (
                      <img src={resolverUrlImagen(b.imagen_url)} alt={b.titulo} className="h-full w-full object-cover" />
                    ) : null}
                  </div>
                  <div className="min-w-0">
                    <div className="font-semibold text-claro/90 truncate">{b.titulo}</div>
                    <div className="text-xs text-claro/50 truncate">{b.subtitulo || '—'}</div>
                    <div className="mt-2 flex flex-wrap gap-2 text-xs">
                      <span className={`rounded-full border px-3 py-1 ${b.activo ? 'border-emerald-500/20 bg-emerald-500/10 text-emerald-200' : 'border-grisOscuro bg-oscuro/40 text-claro/60'}`}>
                        {b.activo ? 'Activo' : 'Inactivo'}
                      </span>
                      <span className="rounded-full border border-grisOscuro bg-oscuro/40 px-3 py-1 text-claro/60">Orden {b.orden ?? 0}</span>
                    </div>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => editar(b)}
                    className="rounded-lg bg-dorado px-4 py-2 text-sm font-semibold text-oscuro hover:bg-doradoClaro transition"
                  >
                    Editar
                  </button>
                  <button
                    type="button"
                    onClick={() => borrar(b)}
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

