import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { listarUsuarios } from '../../servicios/usuarioServicio'

export function GestionUsuarios() {
  const [buscar, setBuscar] = useState('')
  const [cargando, setCargando] = useState(true)
  const [usuarios, setUsuarios] = useState([])
  const [total, setTotal] = useState(0)

  async function cargar(busqueda = buscar) {
    setCargando(true)
    try {
      const datos = await listarUsuarios({ buscar: busqueda || undefined })
      setUsuarios(datos.usuarios?.data || [])
      setTotal(datos.usuarios?.total || 0)
    } catch {
      toast.error('No se pudieron cargar los usuarios')
    } finally {
      setCargando(false)
    }
  }

  useEffect(() => {
    cargar('')
  }, [])

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <div className="text-xs uppercase tracking-widest text-claro/50">Admin</div>
          <h1 className="mt-2 font-urbana text-3xl tracking-wide text-claro/90 sm:text-4xl">Usuarios</h1>
        </div>
        <div className="flex w-full max-w-xl gap-3">
          <input
            value={buscar}
            onChange={(e) => setBuscar(e.target.value)}
            placeholder="Buscar por nombre, correo o telefono..."
            className="w-full rounded-xl border border-grisOscuro bg-oscuro/40 px-4 py-3 text-sm text-claro/80 placeholder:text-claro/40 focus:border-dorado/60 focus:outline-none"
          />
          <button
            type="button"
            onClick={() => cargar()}
            className="rounded-xl bg-dorado px-4 py-3 text-sm font-semibold text-oscuro transition hover:bg-doradoClaro"
          >
            Buscar
          </button>
        </div>
      </div>

      <div className="rounded-2xl border border-grisOscuro bg-grisOscuro/40 p-5">
        <div className="text-sm font-semibold text-claro/80">Usuarios registrados</div>
        <div className="mt-1 text-xs text-claro/50">{total} usuarios encontrados</div>
      </div>

      <div className="overflow-hidden rounded-2xl border border-grisOscuro bg-grisOscuro/40">
        <div className="hidden overflow-auto md:block">
          <table className="w-full text-sm">
            <thead className="bg-oscuro/60 text-claro/60">
              <tr>
                <th className="px-4 py-3 text-left">Nombre</th>
                <th className="px-4 py-3 text-left">Correo</th>
                <th className="px-4 py-3 text-left">Telefono</th>
                <th className="px-4 py-3 text-left">Rol</th>
                <th className="px-4 py-3 text-left">Estado</th>
              </tr>
            </thead>
            <tbody>
              {cargando ? (
                <tr>
                  <td colSpan={5} className="px-4 py-6 text-center text-claro/50">
                    Cargando...
                  </td>
                </tr>
              ) : (
                usuarios.map((usuario) => (
                  <tr key={usuario.id} className="border-t border-grisOscuro transition hover:bg-oscuro/40">
                    <td className="px-4 py-3 text-claro/85">{usuario.nombre_completo}</td>
                    <td className="px-4 py-3 text-claro/70">{usuario.email}</td>
                    <td className="px-4 py-3 text-claro/70">{usuario.telefono || '—'}</td>
                    <td className="px-4 py-3 text-claro/70">{usuario.rol}</td>
                    <td className="px-4 py-3 text-claro/70">{usuario.estado}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="grid gap-4 p-4 md:hidden">
          {cargando ? <div className="text-center text-sm text-claro/50">Cargando...</div> : null}
          {!cargando &&
            usuarios.map((usuario) => (
              <div key={usuario.id} className="rounded-2xl border border-grisOscuro bg-oscuro/40 p-4">
                <div className="font-semibold text-claro/90">{usuario.nombre_completo}</div>
                <div className="mt-2 text-sm text-claro/70">{usuario.email}</div>
                <div className="mt-1 text-sm text-claro/60">Telefono: {usuario.telefono || '—'}</div>
                <div className="mt-1 text-sm text-claro/60">Rol: {usuario.rol}</div>
                <div className="mt-1 text-sm text-claro/60">Estado: {usuario.estado}</div>
              </div>
            ))}
        </div>
      </div>
    </div>
  )
}
