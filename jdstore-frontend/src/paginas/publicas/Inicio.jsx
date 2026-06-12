import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi'
import { rutas } from '../../constantes/rutas'
import { logoTiendaSrc, mosaicoTiendaRecursos } from '../../constantes/recursosTienda'
import { TarjetaProducto } from '../../componentes/comunes/TarjetaProducto'
import { CargadorSpinner } from '../../componentes/comunes/CargadorSpinner'
import { listarProductos } from '../../servicios/productoServicio'
import { listarBanners } from '../../servicios/bannerServicio'
import { listarDestacados } from '../../servicios/destacadoServicio'

const CLAVE_CACHE_INICIO = 'jdstore-home-cache-v3'
const DURACION_CACHE_INICIO = 1000 * 60 * 5
const animacionesCarrusel = new WeakMap()

function leerCacheInicio() {
  if (typeof window === 'undefined') return null

  try {
    const cacheCrudo = window.sessionStorage.getItem(CLAVE_CACHE_INICIO)
    if (!cacheCrudo) return null

    const cache = JSON.parse(cacheCrudo)
    if (!cache?.guardadoEn || Date.now() - cache.guardadoEn > DURACION_CACHE_INICIO) {
      window.sessionStorage.removeItem(CLAVE_CACHE_INICIO)
      return null
    }

    return cache
  } catch {
    return null
  }
}

function guardarCacheInicio(cacheRef, cambios) {
  if (typeof window === 'undefined') return

  const siguienteCache = {
    ...(cacheRef.current || {}),
    ...cambios,
    guardadoEn: Date.now(),
  }

  cacheRef.current = siguienteCache

  try {
    window.sessionStorage.setItem(CLAVE_CACHE_INICIO, JSON.stringify(siguienteCache))
  } catch {
    // Ignora errores de almacenamiento para no bloquear la carga del inicio.
  }
}

function easeInOutCubic(progreso) {
  return progreso < 0.5
    ? 4 * progreso * progreso * progreso
    : 1 - Math.pow(-2 * progreso + 2, 3) / 2
}

function desplazarCarruselSuave(referencia, direccion, proporcion = 0.92, duracion = 440) {
  const elemento = referencia.current
  if (!elemento) return

  const desplazamientoPrevio = animacionesCarrusel.get(elemento)
  if (desplazamientoPrevio) {
    cancelAnimationFrame(desplazamientoPrevio)
  }

  const distancia = Math.max(280, elemento.clientWidth * proporcion)
  const inicio = elemento.scrollLeft
  const maximo = Math.max(0, elemento.scrollWidth - elemento.clientWidth)
  const destino = Math.max(0, Math.min(maximo, inicio + direccion * distancia))

  if (Math.abs(destino - inicio) < 2) return

  const snapPrevio = elemento.style.scrollSnapType
  const inicioAnimacion = performance.now()

  elemento.style.scrollSnapType = 'none'

  const animar = (tiempoActual) => {
    const progreso = Math.min((tiempoActual - inicioAnimacion) / duracion, 1)
    const avance = easeInOutCubic(progreso)
    elemento.scrollLeft = inicio + (destino - inicio) * avance

    if (progreso < 1) {
      animacionesCarrusel.set(elemento, requestAnimationFrame(animar))
      return
    }

    elemento.scrollLeft = destino
    elemento.style.scrollSnapType = snapPrevio || ''
    animacionesCarrusel.delete(elemento)
  }

  animacionesCarrusel.set(elemento, requestAnimationFrame(animar))
}

function CarruselFila({
  productos,
  referencia,
  alMoverIzquierda,
  alMoverDerecha,
  etiquetaAnterior = 'Ver productos anteriores',
  etiquetaSiguiente = 'Ver productos siguientes',
}) {
  if (!productos.length) return null

  return (
    <>
      <div className="hidden md:flex items-center gap-4">
        <button
          type="button"
          onClick={alMoverIzquierda}
          aria-label={etiquetaAnterior}
          className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-grisOscuro bg-grisOscuro/50 text-claro/80 transition duration-200 active:scale-95 hover:border-dorado/40 hover:text-doradoClaro"
        >
          <FiChevronLeft className="text-xl" />
        </button>

        <div className="relative min-w-0 flex-1">
          <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-14 bg-gradient-to-r from-oscuro via-oscuro/35 to-transparent opacity-75" />
          <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-14 bg-gradient-to-l from-oscuro via-oscuro/35 to-transparent opacity-75" />
          <div
            ref={referencia}
            className="sin-scrollbar flex min-w-0 snap-x snap-mandatory gap-5 overflow-x-auto scroll-smooth px-1 py-1"
          >
            {productos.map((producto, indice) => (
              <div key={`fila-${producto.id}`} className="w-[220px] shrink-0 snap-start lg:w-[230px] xl:w-[240px]">
                <TarjetaProducto producto={producto} prioridadImagen={indice < 3} />
              </div>
            ))}
          </div>
        </div>

        <button
          type="button"
          onClick={alMoverDerecha}
          aria-label={etiquetaSiguiente}
          className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-grisOscuro bg-grisOscuro/50 text-claro/80 transition duration-200 active:scale-95 hover:border-dorado/40 hover:text-doradoClaro"
        >
          <FiChevronRight className="text-xl" />
        </button>
      </div>

      <div className="md:hidden">
        <div className="relative px-1">
          <div className="pointer-events-none absolute inset-y-0 left-1 z-10 w-8 bg-gradient-to-r from-oscuro via-oscuro/30 to-transparent opacity-65" />
          <div className="pointer-events-none absolute inset-y-0 right-1 z-10 w-8 bg-gradient-to-l from-oscuro via-oscuro/30 to-transparent opacity-65" />
          <div className="sin-scrollbar flex snap-x snap-mandatory gap-4 overflow-x-auto px-0 pb-2 pt-1 [scrollbar-width:none] touch-pan-x">
            <div aria-hidden="true" className="w-2 shrink-0" />
            {productos.map((producto, indice) => (
              <div key={`fila-mobile-${producto.id}`} className="w-[80vw] max-w-[272px] shrink-0 snap-start">
                <TarjetaProducto producto={producto} prioridadImagen={indice < 2} />
              </div>
            ))}
            <div aria-hidden="true" className="w-2 shrink-0" />
          </div>
        </div>
      </div>
    </>
  )
}

function EncabezadoSeccion({ etiqueta, titulo, descripcion, enlaceTo, enlaceTexto }) {
  return (
    <div className="flex items-end justify-between gap-4">
      <div className="motion-fade-up">
        <div className="section-kicker">{etiqueta}</div>
        <h2 className="mt-2 font-urbana text-3xl tracking-wide">{titulo}</h2>
        {descripcion ? <p className="mt-2 max-w-3xl text-sm text-claro/65">{descripcion}</p> : null}
      </div>
      {enlaceTo && enlaceTexto ? (
        <Link to={enlaceTo} className="text-sm text-claro/70 transition hover:text-doradoClaro">
          {enlaceTexto}
        </Link>
      ) : null}
    </div>
  )
}

export function Inicio() {
  const [cacheInicial] = useState(() => leerCacheInicio())
  const [productosDestacados, setProductosDestacados] = useState(() => cacheInicial?.productosDestacados || [])
  const [productosNuevos, setProductosNuevos] = useState(() => cacheInicial?.productosNuevos || [])
  const [masVendidos, setMasVendidos] = useState(() => cacheInicial?.masVendidos || [])
  const [banners, setBanners] = useState(() => cacheInicial?.banners || [])
  const [cargandoDestacados, setCargandoDestacados] = useState(() => !cacheInicial?.productosDestacados?.length)
  const [cargandoNuevos, setCargandoNuevos] = useState(() => !cacheInicial?.productosNuevos?.length)
  const [cargandoMasVendidos, setCargandoMasVendidos] = useState(() => !cacheInicial?.masVendidos?.length)
  const [semillaAleatoria] = useState(() => `${Date.now()}-${Math.random().toString(36).slice(2)}`)
  const carruselDestacadosRef = useRef(null)
  const carruselNuevosRef = useRef(null)
  const cacheInicioRef = useRef(cacheInicial || null)
  const mosaicoRef = useRef(null)
  const [mostrarMosaico, setMostrarMosaico] = useState(false)

  useEffect(() => {
    const objetivo = mosaicoRef.current
    if (!objetivo || mostrarMosaico || typeof IntersectionObserver === 'undefined') {
      return undefined
    }

    const observador = new IntersectionObserver(
      (entradas) => {
        if (entradas.some((entrada) => entrada.isIntersecting)) {
          setMostrarMosaico(true)
          observador.disconnect()
        }
      },
      { rootMargin: '240px 0px' }
    )

    observador.observe(objetivo)

    return () => observador.disconnect()
  }, [mostrarMosaico])

  useEffect(() => {
    let activo = true
    const limiteDestacados = 20
    const limiteNuevos = 15
    const limiteMasVendidos = 10

    async function cargarBanner() {
      try {
        const respuestaBanners = await listarBanners()
        if (!activo) return

        const nuevosBanners = respuestaBanners.banners || []
        setBanners(nuevosBanners)
        guardarCacheInicio(cacheInicioRef, { banners: nuevosBanners })
      } catch {
        // Mantiene el banner cacheado o el contenido de respaldo si la petición falla.
      }
    }

    async function cargarDestacadosInicio() {
      setCargandoDestacados(productosDestacados.length === 0)

      try {
        const respuestaDestacadosAdmin = await listarDestacados()
        if (!activo) return

        let destacados = respuestaDestacadosAdmin.productos || []

        if (!destacados.length) {
          const respuestaFallbackDestacados = await listarProductos({
            solo_activos: true,
            aleatorio: true,
            semilla: semillaAleatoria,
            per_page: limiteDestacados,
            page: 1,
          })

          if (!activo) return
          destacados = respuestaFallbackDestacados.productos?.data || []
        }

        setProductosDestacados(destacados)
        guardarCacheInicio(cacheInicioRef, { productosDestacados: destacados })
      } catch {
        // Conserva los datos cacheados si están disponibles.
      } finally {
        if (activo) {
          setCargandoDestacados(false)
        }
      }
    }

    async function cargarNuevosInicio() {
      setCargandoNuevos(productosNuevos.length === 0)

      try {
        const respuestaNuevos = await listarProductos({
          solo_activos: true,
          per_page: limiteNuevos,
          page: 1,
        })

        if (!activo) return

        const nuevosProductos = respuestaNuevos.productos?.data || []
        setProductosNuevos(nuevosProductos)
        guardarCacheInicio(cacheInicioRef, { productosNuevos: nuevosProductos })
      } catch {
        // Conserva los datos cacheados si están disponibles.
      } finally {
        if (activo) {
          setCargandoNuevos(false)
        }
      }
    }

    async function cargarMasVendidosInicio() {
      setCargandoMasVendidos(masVendidos.length === 0)

      try {
        const respuestaMasVendidos = await listarProductos({
          solo_activos: true,
          per_page: limiteMasVendidos,
          page: 1,
          orden: 'mas_vendidos',
        })

        if (!activo) return

        const productosMasVendidos = respuestaMasVendidos.productos?.data || []
        setMasVendidos(productosMasVendidos)
        guardarCacheInicio(cacheInicioRef, { masVendidos: productosMasVendidos })
      } catch {
        // Conserva los datos cacheados si están disponibles.
      } finally {
        if (activo) {
          setCargandoMasVendidos(false)
        }
      }
    }

    cargarBanner()
    cargarDestacadosInicio()
    cargarNuevosInicio()
    cargarMasVendidosInicio()

    return () => {
      activo = false
    }
  }, [semillaAleatoria])

  return (
    <div>
      <section className="relative overflow-hidden border-b border-grisOscuro bg-gradient-to-b from-[#0b0b0b] to-oscuro">
        {banners?.[0]?.imagen_url ? (
          <>
            <img
              src={banners[0].imagen_url}
              alt={banners[0].titulo || 'Banner principal'}
              className="absolute inset-0 h-full w-full object-cover opacity-38"
              loading="eager"
              fetchPriority="high"
              decoding="async"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/65 via-black/45 to-black/25" />
          </>
        ) : null}

        <div className="section-shell relative grid items-center gap-10 py-14 sm:py-16 md:grid-cols-2">
          <div className="motion-fade-up">
            <div className="section-kicker">Inicio</div>
            {(() => {
              const banner = banners?.[0]
              const titulo = banner?.titulo || 'Streetwear premium'
              const subtitulo = banner?.subtitulo || 'para tu flow'

              return (
                <h1 className="mt-2 font-urbana text-4xl leading-none tracking-wide sm:text-5xl md:text-6xl">
                  {titulo}
                  <span className="block text-dorado">{subtitulo}</span>
                </h1>
              )
            })()}
            <p className="mt-4 max-w-xl text-claro/70 sm:text-lg">
              Moda urbana masculina en Ibagué. Prendas con actitud, diseño y calidad para elevar tu estilo.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Link
                to={rutas.catalogo}
                className="rounded-xl bg-dorado px-5 py-3 font-semibold text-oscuro transition duration-200 hover:-translate-y-0.5 hover:bg-doradoClaro"
              >
                Ver catálogo
              </Link>
              {banners?.[0]?.enlace_url ? (
                <a
                  href={banners[0].enlace_url}
                  className="rounded-xl border border-grisMedio px-5 py-3 text-claro/80 transition duration-200 hover:-translate-y-0.5 hover:border-dorado/40"
                >
                  Ver promoción
                </a>
              ) : (
              <Link
                to={rutas.quienesSomos}
                className="rounded-xl border border-grisMedio px-5 py-3 text-claro/80 transition duration-200 hover:-translate-y-0.5 hover:border-dorado/40"
              >
                Conócenos
              </Link>
              )}
            </div>
            <div className="mt-6 flex flex-wrap gap-3 text-xs text-claro/60">
              <span className="rounded-full border border-dorado/20 bg-dorado/8 px-3 py-1">Compra segura</span>
              <span className="rounded-full border border-grisOscuro bg-grisOscuro/35 px-3 py-1">Estilo urbano</span>
              <span className="rounded-full border border-grisOscuro bg-grisOscuro/35 px-3 py-1">Atención personalizada</span>
            </div>
          </div>

          <div className="surface-panel motion-fade-up-delay p-5 transition duration-300 hover:-translate-y-1 sm:p-7">
            <div className="flex items-center gap-3">
              <img src={logoTiendaSrc} alt="JD Store" className="h-16 w-16 shrink-0 object-contain sm:h-20 sm:w-20" />
              <div>
                <div className="font-urbana text-xl tracking-wide text-claro sm:text-2xl">JD Store</div>
                <div className="text-xs text-doradoClaro/80 sm:text-sm">Moda urbana masculina</div>
              </div>
            </div>
            <div className="mt-4 font-urbana text-2xl tracking-wide sm:text-3xl">En JD Store vestimos tu actitud</div>
            <div className="mt-4 grid gap-3 text-sm text-claro/70">
              <div className="rounded-2xl border border-grisOscuro bg-oscuro/40 p-4 transition duration-200 hover:border-dorado/30 hover:bg-oscuro/60">
                Centro Comercial La 14, Local 128 (Piso 1)
              </div>
              <div className="rounded-2xl border border-grisOscuro bg-oscuro/40 p-4 transition duration-200 hover:border-dorado/30 hover:bg-oscuro/60">
                WhatsApp: +57 318 326 0720
              </div>
              <div className="rounded-2xl border border-grisOscuro bg-oscuro/40 p-4 transition duration-200 hover:border-dorado/30 hover:bg-oscuro/60">
                Instagram: @jd.store_12
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section-shell py-10">
        <EncabezadoSeccion
          etiqueta="Destacados"
          titulo="Productos para hoy"
          descripcion="Una selección dinámica del home para mostrar primero lo que más conviene destacar en la tienda."
          enlaceTo={rutas.catalogo}
          enlaceTexto="Ver todo"
        />

        {cargandoDestacados && !productosDestacados.length ? (
          <CargadorSpinner />
        ) : (
          <div className="mt-8 motion-fade-up">
            <CarruselFila
              productos={productosDestacados}
              referencia={carruselDestacadosRef}
              alMoverIzquierda={() => desplazarCarruselSuave(carruselDestacadosRef, -1, 0.86)}
              alMoverDerecha={() => desplazarCarruselSuave(carruselDestacadosRef, 1, 0.86)}
              etiquetaAnterior="Ver productos destacados anteriores"
              etiquetaSiguiente="Ver productos destacados siguientes"
            />
          </div>
        )}

        <div className="mt-12">
          <EncabezadoSeccion
            etiqueta="Nuevos"
            titulo="Productos nuevos"
            descripcion="Lo último que se ha agregado al catálogo para que encuentres referencias frescas sin perder tiempo."
            enlaceTo={rutas.catalogo}
            enlaceTexto="Ver catálogo"
          />
        </div>

        {cargandoNuevos && !productosNuevos.length ? (
          <CargadorSpinner />
        ) : (
          <div className="mt-8 motion-fade-up">
            <CarruselFila
              productos={productosNuevos}
              referencia={carruselNuevosRef}
              alMoverIzquierda={() => desplazarCarruselSuave(carruselNuevosRef, -1, 0.86)}
              alMoverDerecha={() => desplazarCarruselSuave(carruselNuevosRef, 1, 0.86)}
            />
          </div>
        )}

        <div className="mt-12">
          <EncabezadoSeccion
            etiqueta="Más vendidos"
            titulo="Lo que más se está moviendo"
            descripcion="Una selección basada en los productos con mayor rotación en la tienda."
            enlaceTo={rutas.catalogo}
            enlaceTexto="Ver catálogo"
          />

          {cargandoMasVendidos && !masVendidos.length ? (
            <CargadorSpinner />
          ) : (
            <div className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5">
              {masVendidos.map((producto, indice) => (
                <TarjetaProducto key={`mas-vendido-${producto.id}`} producto={producto} prioridadImagen={indice < 5} />
              ))}
            </div>
          )}
        </div>
        <div ref={mosaicoRef} className="mt-12">
          <EncabezadoSeccion
            etiqueta="Nuestra tienda"
            titulo="Así se vive JD Store"
            descripcion="Una vista más panorámica del exterior, el ambiente y la experiencia visual de JD Store."
          />
          <div className="mt-5 grid auto-rows-[minmax(135px,_auto)] gap-4 lg:grid-cols-6 xl:auto-rows-[minmax(145px,_auto)]">
            {mostrarMosaico
              ? mosaicoTiendaRecursos.map((item) => (
                  <div
                    key={item.src}
                    className={`group relative overflow-hidden rounded-3xl border border-grisOscuro bg-grisOscuro/40 ${item.clase}`}
                  >
                    {item.tipo === 'video' ? (
                      <video
                        src={item.src}
                        className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.02]"
                        autoPlay
                        muted
                        loop
                        playsInline
                        preload="none"
                      />
                    ) : (
                      <img
                        src={item.src}
                        alt={item.alt}
                        className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.02]"
                        loading="lazy"
                        decoding="async"
                      />
                    )}

                    <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
                    <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-5">
                      <div className="text-[10px] uppercase tracking-[0.25em] text-doradoClaro/80">JD Store</div>
                      <div className="mt-1 font-urbana text-xl tracking-wide text-white sm:text-2xl">{item.titulo}</div>
                    </div>
                  </div>
                ))
              : mosaicoTiendaRecursos.map((item) => (
                  <div
                    key={item.src}
                    className={`animate-pulse rounded-3xl border border-grisOscuro bg-grisOscuro/30 ${item.clase}`}
                  />
                ))}
          </div>
        </div>
      </section>
    </div>
  )
}
