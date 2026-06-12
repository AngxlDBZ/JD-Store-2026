import { useEffect, useMemo, useState } from 'react'
import toast from 'react-hot-toast'
import { usarProductos } from '../../hooks/usarProductos'
import { listarCategorias } from '../../servicios/categoriaServicio'
import {
  actualizarProducto,
  crearProducto,
  eliminarProducto,
  eliminarProductoPermanentemente,
} from '../../servicios/productoServicio'
import { formatearMoneda } from '../../utilidades/formatearMoneda'
import { ModalConfirmacion } from '../../componentes/comunes/ModalConfirmacion'
import { PaginacionProductos } from '../../componentes/comunes/PaginacionProductos'

const formatosPermitidos = ['image/avif', 'image/webp', 'image/jpeg', 'image/jpg', 'image/png']

function crearVariante(talla = '', stock = 0, id = null) {
  return {
    id,
    talla,
    stock,
    clave: `${id || 'nueva'}-${Math.random().toString(36).slice(2, 9)}`,
  }
}

function crearFormInicial() {
  return {
    id: null,
    sku: '',
    nombre: '',
    descripcion: '',
    precio: '',
    categoria_id: '',
    estado: 'activo',
    variantes: [crearVariante()],
    imagen: null,
    imagen_url: '',
  }
}

function extraerPrimerError(error, fallback) {
  const data = error?.response?.data
  const primerCampo = data?.errors ? Object.keys(data.errors)[0] : null
  const primerError = primerCampo ? data.errors[primerCampo]?.[0] : null
  return typeof primerError === 'string' ? primerError : fallback
}

function normalizarClaveTalla(valor) {
  return String(valor || '').trim().toLowerCase()
}

function adaptarVariantesProducto(producto) {
  if (Array.isArray(producto.variantes) && producto.variantes.length > 0) {
    return producto.variantes.map((variante) => crearVariante(variante.talla || '', Number(variante.stock || 0), variante.id))
  }

  const tallas = Array.isArray(producto.tallas)
    ? producto.tallas
    : typeof producto.tallas === 'string'
      ? producto.tallas
          .split(',')
          .map((talla) => talla.trim())
          .filter(Boolean)
      : []

  if (tallas.length === 0) {
    return [crearVariante('Unica', Number(producto.stock || 0))]
  }

  return tallas.map((talla, indice) => crearVariante(talla, indice === 0 ? Number(producto.stock || 0) : 0))
}

function resumirTallas(producto) {
  const tallas = Array.isArray(producto.variantes) && producto.variantes.length > 0
    ? producto.variantes.map((variante) => variante.talla).filter(Boolean)
    : Array.isArray(producto.tallas)
      ? producto.tallas
      : []

  if (tallas.length === 0) return 'Sin tallas'
  if (tallas.length <= 3) return tallas.join(', ')
  return `${tallas.slice(0, 3).join(', ')} +${tallas.length - 3}`
}

export function GestionProductos() {
  const [buscar, setBuscar] = useState('')
  const [categorias, setCategorias] = useState([])
  const [productoActivo, setProductoActivo] = useState(crearFormInicial())
  const [confirmarEliminar, setConfirmarEliminar] = useState(null)
  const [confirmarEliminarPermanente, setConfirmarEliminarPermanente] = useState(null)
  const [guardando, setGuardando] = useState(false)
  const [recarga, setRecarga] = useState(0)
  const [pagina, setPagina] = useState(1)

  useEffect(() => {
    let activo = true

    async function cargar() {
      try {
        const datos = await listarCategorias()
        if (!activo) return
        setCategorias(datos.categorias || [])
      } catch {
        toast.error('No se pudieron cargar las categorías')
      }
    }

    cargar()
    return () => {
      activo = false
    }
  }, [])

  useEffect(() => {
    setPagina(1)
  }, [buscar])

  const parametros = useMemo(
    () => ({
      solo_activos: false,
      buscar: buscar || undefined,
      recarga,
      page: pagina,
    }),
    [buscar, pagina, recarga]
  )

  const { cargando, productos, paginacion } = usarProductos(parametros)

  const stockTotal = useMemo(
    () => productoActivo.variantes.reduce((acc, variante) => acc + Number(variante.stock || 0), 0),
    [productoActivo.variantes]
  )

  function limpiarFormulario() {
    setProductoActivo(crearFormInicial())
  }

  function seleccionarProducto(producto) {
    setProductoActivo({
      id: producto.id,
      sku: producto.sku || '',
      nombre: producto.nombre || '',
      descripcion: producto.descripcion || '',
      precio: producto.precio || '',
      categoria_id: producto.categoria_id || producto.categoria?.id || '',
      estado: producto.estado || 'activo',
      variantes: adaptarVariantesProducto(producto),
      imagen: null,
      imagen_url: producto.imagen_url || '',
    })
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  function manejarCambioImagen(evento) {
    const archivo = evento.target.files?.[0] || null
    if (!archivo) {
      setProductoActivo((actual) => ({ ...actual, imagen: null }))
      return
    }

    if (!formatosPermitidos.includes(archivo.type)) {
      toast.error('Solo se permiten imagenes AVIF, WEBP, JPEG, JPG y PNG')
      evento.target.value = ''
      return
    }

    setProductoActivo((actual) => ({ ...actual, imagen: archivo }))
  }

  function actualizarVariante(clave, campo, valor) {
    setProductoActivo((actual) => ({
      ...actual,
      variantes: actual.variantes.map((variante) =>
        variante.clave === clave
          ? {
              ...variante,
              [campo]: campo === 'stock' ? Math.max(0, Number(valor || 0)) : valor,
            }
          : variante
      ),
    }))
  }

  function agregarVariante() {
    setProductoActivo((actual) => ({
      ...actual,
      variantes: [...actual.variantes, crearVariante()],
    }))
  }

  function eliminarVariante(clave) {
    setProductoActivo((actual) => {
      const siguientes = actual.variantes.filter((variante) => variante.clave !== clave)
      return {
        ...actual,
        variantes: siguientes.length > 0 ? siguientes : [crearVariante()],
      }
    })
  }

  async function guardar(evento) {
    evento.preventDefault()

    if (productoActivo.nombre.trim().length < 3) {
      toast.error('El nombre debe tener al menos 3 caracteres')
      return
    }

    if (Number(productoActivo.precio) <= 0) {
      toast.error('Ingresa un precio válido')
      return
    }

    const variantesLimpias = productoActivo.variantes
      .map((variante) => ({
        id: variante.id || null,
        talla: variante.talla.trim(),
        stock: Number(variante.stock || 0),
      }))
      .filter((variante) => variante.talla)

    if (variantesLimpias.length === 0) {
      toast.error('Agrega al menos una talla con stock')
      return
    }

    const claves = variantesLimpias.map((variante) => normalizarClaveTalla(variante.talla))
    if (new Set(claves).size !== claves.length) {
      toast.error('No repitas tallas dentro del mismo producto')
      return
    }

    if (variantesLimpias.some((variante) => variante.stock < 0)) {
      toast.error('El stock por talla no puede ser negativo')
      return
    }

    const formData = new FormData()
    formData.append('sku', productoActivo.sku.trim())
    formData.append('nombre', productoActivo.nombre.trim())
    formData.append('descripcion', productoActivo.descripcion.trim())
    formData.append('precio', String(productoActivo.precio))
    formData.append('stock', String(variantesLimpias.reduce((acc, variante) => acc + variante.stock, 0)))
    formData.append('categoria_id', String(productoActivo.categoria_id))
    formData.append('estado', productoActivo.estado)
    formData.append('variantes_json', JSON.stringify(variantesLimpias))
    if (productoActivo.imagen) formData.append('imagen', productoActivo.imagen)

    setGuardando(true)
    try {
      if (productoActivo.id) {
        await actualizarProducto(productoActivo.id, formData)
        toast.success('Producto actualizado')
      } else {
        await crearProducto(formData)
        toast.success('Producto creado')
      }

      limpiarFormulario()
      setRecarga((valor) => valor + 1)
      setPagina(1)
    } catch (error) {
      toast.error(extraerPrimerError(error, 'No se pudo guardar el producto'))
    } finally {
      setGuardando(false)
    }
  }

  async function confirmarEliminacion() {
    if (!confirmarEliminar) return

    try {
      await eliminarProducto(confirmarEliminar.id)
      toast.success('Producto desactivado')
      setRecarga((valor) => valor + 1)
    } catch {
      toast.error('No se pudo desactivar el producto')
    } finally {
      setConfirmarEliminar(null)
    }
  }

  async function confirmarBorradoPermanente() {
    if (!confirmarEliminarPermanente) return

    try {
      await eliminarProductoPermanentemente(confirmarEliminarPermanente.id)
      toast.success('Producto eliminado')
      if (productoActivo.id === confirmarEliminarPermanente.id) {
        limpiarFormulario()
      }
      setRecarga((valor) => valor + 1)
    } catch {
      toast.error('No se pudo eliminar el producto')
    } finally {
      setConfirmarEliminarPermanente(null)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <div className="text-xs uppercase tracking-widest text-claro/50">Admin</div>
          <h1 className="mt-2 font-urbana text-3xl tracking-wide text-claro/90 sm:text-4xl">Productos</h1>
        </div>
        <input
          value={buscar}
          onChange={(e) => setBuscar(e.target.value)}
          placeholder="Buscar por nombre, SKU o categoria..."
          className="w-full max-w-sm rounded-xl border border-grisOscuro bg-oscuro/40 px-4 py-3 text-sm text-claro/80 placeholder:text-claro/40 focus:border-dorado/60 focus:outline-none"
        />
      </div>

      <div className="grid gap-6 xl:grid-cols-[1fr_460px]">
        <div className="rounded-2xl border border-grisOscuro bg-grisOscuro/40 overflow-hidden">
          <div className="flex items-center justify-between gap-3 border-b border-grisOscuro px-5 py-4">
            <div className="text-sm font-semibold text-claro/80">Listado</div>
            <div className="text-xs text-claro/50">{paginacion ? `${paginacion.total} productos` : ''}</div>
          </div>

          <div className="hidden overflow-auto md:block">
            <table className="w-full text-sm">
              <thead className="bg-oscuro/60 text-claro/60">
                <tr>
                  <th className="px-4 py-3 text-left">Nombre</th>
                  <th className="px-4 py-3 text-left">SKU</th>
                  <th className="px-4 py-3 text-left">Precio</th>
                  <th className="px-4 py-3 text-left">Tallas</th>
                  <th className="px-4 py-3 text-left">Stock</th>
                  <th className="px-4 py-3 text-left">Estado</th>
                  <th className="px-4 py-3 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {cargando ? (
                  <tr>
                    <td colSpan={7} className="px-4 py-6 text-center text-claro/50">
                      Cargando...
                    </td>
                  </tr>
                ) : (
                  productos.map((producto) => (
                    <tr key={producto.id} className="border-t border-grisOscuro transition hover:bg-oscuro/40">
                      <td className="px-4 py-3 text-claro/85">{producto.nombre}</td>
                      <td className="px-4 py-3 text-claro/60">{producto.sku}</td>
                      <td className="px-4 py-3 text-claro/85">{formatearMoneda(producto.precio)}</td>
                      <td className="px-4 py-3 text-claro/60">{resumirTallas(producto)}</td>
                      <td className="px-4 py-3 text-claro/85">{producto.stock}</td>
                      <td className="px-4 py-3">
                        <span
                          className={`rounded-full border px-3 py-1 text-xs ${
                            producto.estado === 'activo'
                              ? 'border-emerald-500/20 bg-emerald-500/15 text-emerald-300'
                              : 'border-rose-500/20 bg-rose-500/15 text-rose-300'
                          }`}
                        >
                          {producto.estado}
                        </span>
                      </td>
                      <td className="space-x-2 px-4 py-3 text-right">
                        <button
                          type="button"
                          onClick={() => seleccionarProducto(producto)}
                          className="rounded-lg border border-grisOscuro bg-oscuro/40 px-3 py-1 text-xs text-claro/70 transition hover:border-dorado/40 hover:text-doradoClaro"
                        >
                          Editar
                        </button>
                        <button
                          type="button"
                          onClick={() => setConfirmarEliminar(producto)}
                          className="rounded-lg border border-grisOscuro bg-oscuro/40 px-3 py-1 text-xs text-claro/70 transition hover:border-dorado/40 hover:text-doradoClaro"
                        >
                          Desactivar
                        </button>
                        <button
                          type="button"
                          onClick={() => setConfirmarEliminarPermanente(producto)}
                          className="rounded-lg border border-rose-500/30 bg-rose-500/10 px-3 py-1 text-xs text-rose-200 transition hover:bg-rose-500/20"
                        >
                          Eliminar
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          <div className="grid gap-4 p-4 md:hidden">
            {cargando ? <div className="text-center text-sm text-claro/50">Cargando...</div> : null}
            {!cargando &&
              productos.map((producto) => (
                <div key={producto.id} className="rounded-2xl border border-grisOscuro bg-oscuro/40 p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="font-semibold text-claro/90">{producto.nombre}</div>
                      <div className="mt-1 text-xs text-claro/50">{producto.sku}</div>
                    </div>
                    <span
                      className={`rounded-full border px-3 py-1 text-xs ${
                        producto.estado === 'activo'
                          ? 'border-emerald-500/20 bg-emerald-500/15 text-emerald-300'
                          : 'border-rose-500/20 bg-rose-500/15 text-rose-300'
                      }`}
                    >
                      {producto.estado}
                    </span>
                  </div>
                  <div className="mt-3 grid gap-1 text-sm text-claro/70">
                    <div>Precio: <span className="font-semibold text-claro/90">{formatearMoneda(producto.precio)}</span></div>
                    <div>Tallas: <span className="font-semibold text-claro/90">{resumirTallas(producto)}</span></div>
                    <div>Stock: <span className="font-semibold text-claro/90">{producto.stock}</span></div>
                  </div>
                  <div className="mt-4 flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() => seleccionarProducto(producto)}
                      className="rounded-lg border border-grisOscuro bg-oscuro/40 px-3 py-2 text-xs text-claro/70 transition hover:border-dorado/40 hover:text-doradoClaro"
                    >
                      Editar
                    </button>
                    <button
                      type="button"
                      onClick={() => setConfirmarEliminar(producto)}
                      className="rounded-lg border border-grisOscuro bg-oscuro/40 px-3 py-2 text-xs text-claro/70 transition hover:border-dorado/40 hover:text-doradoClaro"
                    >
                      Desactivar
                    </button>
                    <button
                      type="button"
                      onClick={() => setConfirmarEliminarPermanente(producto)}
                      className="rounded-lg border border-rose-500/30 bg-rose-500/10 px-3 py-2 text-xs text-rose-200 transition hover:bg-rose-500/20"
                    >
                      Eliminar
                    </button>
                  </div>
                </div>
              ))}
          </div>

          <div className="border-t border-grisOscuro px-4 py-4">
            <PaginacionProductos paginacion={paginacion} onCambiarPagina={setPagina} />
          </div>
        </div>

        <form onSubmit={guardar} className="space-y-4 rounded-2xl border border-grisOscuro bg-grisOscuro/40 p-5">
          <div className="flex items-center justify-between gap-3">
            <div className="text-sm font-semibold text-claro/80">{productoActivo.id ? 'Editar producto' : 'Nuevo producto'}</div>
            <div className="rounded-full border border-dorado/30 bg-dorado/10 px-3 py-1 text-xs font-semibold text-doradoClaro">
              Stock total: {stockTotal}
            </div>
          </div>

          <input
            value={productoActivo.sku}
            onChange={(e) => setProductoActivo((actual) => ({ ...actual, sku: e.target.value }))}
            placeholder="SKU base"
            className="w-full rounded-xl border border-grisOscuro bg-oscuro/40 px-4 py-3 text-sm text-claro/80 placeholder:text-claro/40 focus:border-dorado/60 focus:outline-none"
            required
          />
          <input
            value={productoActivo.nombre}
            onChange={(e) => setProductoActivo((actual) => ({ ...actual, nombre: e.target.value }))}
            placeholder="Nombre"
            className="w-full rounded-xl border border-grisOscuro bg-oscuro/40 px-4 py-3 text-sm text-claro/80 placeholder:text-claro/40 focus:border-dorado/60 focus:outline-none"
            required
          />
          <textarea
            value={productoActivo.descripcion}
            onChange={(e) => setProductoActivo((actual) => ({ ...actual, descripcion: e.target.value }))}
            placeholder="Descripcion"
            rows={4}
            className="w-full rounded-xl border border-grisOscuro bg-oscuro/40 px-4 py-3 text-sm text-claro/80 placeholder:text-claro/40 focus:border-dorado/60 focus:outline-none"
          />

          <div className="grid gap-3 sm:grid-cols-2">
            <input
              value={productoActivo.precio}
              onChange={(e) => setProductoActivo((actual) => ({ ...actual, precio: e.target.value }))}
              placeholder="Precio"
              type="number"
              min={0}
              step="0.01"
              className="w-full rounded-xl border border-grisOscuro bg-oscuro/40 px-4 py-3 text-sm text-claro/80 placeholder:text-claro/40 focus:border-dorado/60 focus:outline-none"
              required
            />

            <select
              value={productoActivo.estado}
              onChange={(e) => setProductoActivo((actual) => ({ ...actual, estado: e.target.value }))}
              className="w-full rounded-xl border border-grisOscuro bg-oscuro/40 px-4 py-3 text-sm text-claro/80 focus:border-dorado/60 focus:outline-none"
            >
              <option value="activo">Activo</option>
              <option value="inactivo">Inactivo</option>
            </select>
          </div>

          <select
            value={productoActivo.categoria_id}
            onChange={(e) => setProductoActivo((actual) => ({ ...actual, categoria_id: e.target.value }))}
            className="w-full rounded-xl border border-grisOscuro bg-oscuro/40 px-4 py-3 text-sm text-claro/80 focus:border-dorado/60 focus:outline-none"
            required
          >
            <option value="" disabled>
              Categoria
            </option>
            {categorias.map((categoria) => (
              <option key={categoria.id} value={categoria.id}>
                {categoria.nombre}
              </option>
            ))}
          </select>

          <div className="rounded-2xl border border-grisOscuro bg-oscuro/30 p-4">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <div className="text-sm font-semibold text-claro/85">Tallas y stock</div>
                <div className="mt-1 text-xs text-claro/50">
                  Cada fila representa una variante real del producto.
                </div>
              </div>
              <button
                type="button"
                onClick={agregarVariante}
                className="w-full rounded-lg border border-grisOscuro bg-oscuro/40 px-3 py-2 text-xs text-claro/70 transition hover:border-dorado/40 hover:text-doradoClaro sm:w-auto"
              >
                Agregar talla
              </button>
            </div>

            <div className="mt-4 grid gap-3">
              {productoActivo.variantes.map((variante, indice) => (
                <div key={variante.clave} className="grid min-w-0 gap-3 rounded-2xl border border-grisOscuro bg-oscuro/30 p-3 md:grid-cols-[minmax(0,1fr)_120px_auto] md:items-center">
                  <input
                    value={variante.talla}
                    onChange={(e) => actualizarVariante(variante.clave, 'talla', e.target.value)}
                    placeholder={indice === 0 ? 'Ej: S' : 'Talla'}
                    className="min-w-0 w-full rounded-xl border border-grisOscuro bg-oscuro/40 px-4 py-3 text-sm text-claro/80 placeholder:text-claro/40 focus:border-dorado/60 focus:outline-none"
                  />
                  <input
                    value={variante.stock}
                    onChange={(e) => actualizarVariante(variante.clave, 'stock', e.target.value)}
                    placeholder="Stock"
                    type="number"
                    min={0}
                    className="w-full rounded-xl border border-grisOscuro bg-oscuro/40 px-4 py-3 text-sm text-claro/80 placeholder:text-claro/40 focus:border-dorado/60 focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => eliminarVariante(variante.clave)}
                    className="w-full rounded-xl border border-grisOscuro bg-oscuro/40 px-4 py-3 text-sm text-claro/70 transition hover:border-rose-500/40 hover:text-rose-200 md:w-auto"
                  >
                    Quitar
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-dashed border-grisOscuro bg-oscuro/30 p-4 text-sm text-claro/70">
            <div className="font-semibold text-claro/85">Imagen del producto</div>
            <div className="mt-1 text-xs text-claro/50">Formatos permitidos: .avif, .webp, .jpeg, .jpg y .png</div>
            {productoActivo.imagen_url ? (
              <div className="mt-2 text-xs text-claro/60">Imagen actual cargada</div>
            ) : null}
            <input
              type="file"
              accept=".avif,.webp,.jpeg,.jpg,.png,image/avif,image/webp,image/jpeg,image/png"
              onChange={manejarCambioImagen}
              className="mt-3 w-full text-sm"
            />
          </div>

          <div className="flex flex-wrap gap-2 pt-2">
            <button
              type="submit"
              disabled={guardando}
              className={`flex-1 rounded-xl px-4 py-3 text-sm font-semibold transition ${
                guardando ? 'bg-grisMedio/40 text-claro/50' : 'bg-dorado text-oscuro hover:bg-doradoClaro'
              }`}
            >
              {guardando ? 'Guardando...' : productoActivo.id ? 'Actualizar' : 'Guardar'}
            </button>
            <button
              type="button"
              onClick={limpiarFormulario}
              className="rounded-xl border border-grisOscuro bg-oscuro/40 px-4 py-3 text-sm text-claro/70 transition hover:border-dorado/40 hover:text-doradoClaro"
            >
              Limpiar
            </button>
          </div>
        </form>
      </div>

      <ModalConfirmacion
        abierto={Boolean(confirmarEliminar)}
        titulo="Desactivar producto"
        descripcion="El producto quedará como inactivo y ya no saldrá en el catálogo."
        confirmarTexto="Desactivar"
        onCancelar={() => setConfirmarEliminar(null)}
        onConfirmar={confirmarEliminacion}
      />

      <ModalConfirmacion
        abierto={Boolean(confirmarEliminarPermanente)}
        titulo="Eliminar producto"
        descripcion="Esta acción elimina el producto y su imagen de forma permanente."
        confirmarTexto="Eliminar"
        onCancelar={() => setConfirmarEliminarPermanente(null)}
        onConfirmar={confirmarBorradoPermanente}
      />
    </div>
  )
}

