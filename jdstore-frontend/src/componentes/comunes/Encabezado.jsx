import { useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { FiMenu, FiShoppingBag, FiUser, FiX } from 'react-icons/fi'
import { rutas } from '../../constantes/rutas'
import { logoTiendaSrc } from '../../constantes/recursosTienda'
import { usarAutenticacion } from '../../hooks/usarAutenticacion'
import { usarCarrito } from '../../hooks/usarCarrito'

export function Encabezado() {
  const { estaAutenticado, esAdmin, esVendedor, cerrarSesion } = usarAutenticacion()
  const { cantidadTotal } = usarCarrito()
  const [menuMovilAbierto, setMenuMovilAbierto] = useState(false)
  const rutaPanel = esAdmin ? rutas.admin : esVendedor ? rutas.vendedor : rutas.perfil
  const textoPanel = esAdmin ? 'Admin' : esVendedor ? 'Vendedor' : 'Perfil'

  return (
    <header className="sticky top-0 z-40 border-b border-grisOscuro bg-[#0c0c0c]/88 backdrop-blur-sm supports-[backdrop-filter]:bg-[#0c0c0c]/78">
      <div className="mx-auto flex max-w-[1440px] items-center justify-between gap-3 px-4 py-3 sm:gap-4 sm:px-6 sm:py-4 xl:px-8">
        <Link to={rutas.inicio} className="flex min-w-0 items-center gap-3 transition-transform duration-200 hover:-translate-y-0.5">
          <img src={logoTiendaSrc} alt="JD Store" className="h-11 w-11 shrink-0 object-contain sm:h-13 sm:w-13" loading="eager" />
          <div className="leading-none">
            <div className="font-urbana text-xl tracking-[0.12em] text-claro sm:text-[1.75rem]">JD STORE</div>
            <div className="text-[10px] uppercase tracking-[0.22em] text-doradoClaro/80 sm:text-[11px]">Moda urbana masculina</div>
          </div>
        </Link>

        <nav className="hidden md:flex items-center gap-2 rounded-full border border-grisOscuro bg-oscuro/35 px-2 py-2 text-sm">
          <NavLink
            to={rutas.inicio}
            className={({ isActive }) =>
              `rounded-full px-4 py-2 transition ${isActive ? 'bg-dorado/12 text-doradoClaro' : 'text-claro/72 hover:bg-oscuro/40 hover:text-doradoClaro'}`
            }
          >
            Inicio
          </NavLink>
          <NavLink
            to={rutas.catalogo}
            className={({ isActive }) =>
              `rounded-full px-4 py-2 transition ${isActive ? 'bg-dorado/12 text-doradoClaro' : 'text-claro/72 hover:bg-oscuro/40 hover:text-doradoClaro'}`
            }
          >
            Catálogo
          </NavLink>
          <NavLink
            to={rutas.quienesSomos}
            className={({ isActive }) =>
              `rounded-full px-4 py-2 transition ${isActive ? 'bg-dorado/12 text-doradoClaro' : 'text-claro/72 hover:bg-oscuro/40 hover:text-doradoClaro'}`
            }
          >
            ¿Quiénes somos?
          </NavLink>
          <NavLink
            to={rutas.contacto}
            className={({ isActive }) =>
              `rounded-full px-4 py-2 transition ${isActive ? 'bg-dorado/12 text-doradoClaro' : 'text-claro/72 hover:bg-oscuro/40 hover:text-doradoClaro'}`
            }
          >
            Contacto
          </NavLink>
        </nav>

        <div className="flex shrink-0 items-center gap-2 sm:gap-3">
          <button
            type="button"
            className="md:hidden inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-grisOscuro bg-oscuro/40 text-claro/80 transition hover:border-dorado/35 hover:text-doradoClaro"
            onClick={() => setMenuMovilAbierto((v) => !v)}
            aria-label="Abrir menú"
            aria-controls="menu-movil"
            aria-expanded={menuMovilAbierto}
          >
            {menuMovilAbierto ? <FiX className="text-lg" /> : <FiMenu className="text-lg" />}
          </button>

          <Link
            to={rutas.carrito}
            className="relative hidden items-center gap-2 rounded-2xl border border-grisOscuro bg-oscuro/40 px-3 py-2 transition hover:-translate-y-0.5 hover:border-dorado/35 md:inline-flex"
          >
            <FiShoppingBag className="text-dorado" />
            <span className="text-sm text-claro/80">Carrito</span>
            {cantidadTotal > 0 ? (
              <span className="absolute -right-2 -top-2 grid h-6 min-w-6 place-items-center rounded-full bg-dorado px-2 text-xs text-oscuro">
                {cantidadTotal}
              </span>
            ) : null}
          </Link>

          {estaAutenticado ? (
            <div className="hidden sm:flex items-center gap-2">
              <Link
                to={rutaPanel}
                className={`rounded-xl px-3 py-2 text-sm transition hover:-translate-y-0.5 ${
                  esAdmin || esVendedor
                    ? 'border border-dorado/30 bg-dorado/12 text-dorado hover:bg-dorado/18'
                    : 'border border-grisOscuro bg-oscuro/40 text-claro/80 hover:border-dorado/35'
                }`}
              >
                {textoPanel}
              </Link>

              <button
                type="button"
                onClick={cerrarSesion}
                className="rounded-xl border border-grisOscuro bg-oscuro/40 px-3 py-2 text-sm text-claro/80 transition hover:-translate-y-0.5 hover:border-dorado/35"
              >
                Salir
              </button>
            </div>
          ) : (
            <Link
              to={rutas.iniciarSesion}
              className="inline-flex items-center gap-2 whitespace-nowrap rounded-xl border border-dorado/30 bg-dorado/12 px-3 py-2 text-sm text-dorado transition hover:-translate-y-0.5 hover:bg-dorado/18"
            >
              <FiUser />
              Entrar
            </Link>
          )}

        </div>
      </div>

      {menuMovilAbierto ? (
        <div id="menu-movil" className="border-t border-grisOscuro bg-[#0b0b0b]/96 md:hidden">
          <div className="mx-auto grid max-w-[1440px] gap-2 px-4 py-4 text-sm sm:px-6 xl:px-8">
            <NavLink
              to={rutas.inicio}
              onClick={() => setMenuMovilAbierto(false)}
              className={({ isActive }) =>
                `rounded-2xl px-3 py-2 transition ${isActive ? 'bg-dorado/10 text-doradoClaro' : 'text-claro/80 hover:bg-oscuro/40 hover:text-doradoClaro'}`
              }
            >
              Inicio
            </NavLink>
            <NavLink
              to={rutas.catalogo}
              onClick={() => setMenuMovilAbierto(false)}
              className={({ isActive }) =>
                `rounded-2xl px-3 py-2 transition ${isActive ? 'bg-dorado/10 text-doradoClaro' : 'text-claro/80 hover:bg-oscuro/40 hover:text-doradoClaro'}`
              }
            >
              Catálogo
            </NavLink>
            <NavLink
              to={rutas.quienesSomos}
              onClick={() => setMenuMovilAbierto(false)}
              className={({ isActive }) =>
                `rounded-2xl px-3 py-2 transition ${isActive ? 'bg-dorado/10 text-doradoClaro' : 'text-claro/80 hover:bg-oscuro/40 hover:text-doradoClaro'}`
              }
            >
              ¿Quiénes somos?
            </NavLink>
            <NavLink
              to={rutas.contacto}
              onClick={() => setMenuMovilAbierto(false)}
              className={({ isActive }) =>
                `rounded-2xl px-3 py-2 transition ${isActive ? 'bg-dorado/10 text-doradoClaro' : 'text-claro/80 hover:bg-oscuro/40 hover:text-doradoClaro'}`
              }
            >
              Contacto
            </NavLink>

            <Link
              to={rutas.carrito}
              onClick={() => setMenuMovilAbierto(false)}
              className="relative mt-1 inline-flex items-center gap-2 rounded-2xl border border-grisOscuro bg-oscuro/40 px-3 py-2 text-claro/80 transition hover:border-dorado/35"
            >
              <FiShoppingBag className="text-dorado" />
              <span>Carrito</span>
              {cantidadTotal > 0 ? (
                <span className="ml-auto grid h-6 min-w-6 place-items-center rounded-full bg-dorado px-2 text-xs text-oscuro">
                  {cantidadTotal}
                </span>
              ) : null}
            </Link>

            {estaAutenticado ? (
              <div className="flex flex-wrap items-center gap-2 pt-2">
                <Link
                  to={rutaPanel}
                  onClick={() => setMenuMovilAbierto(false)}
                  className={`rounded-xl px-3 py-2 text-sm transition ${
                    esAdmin || esVendedor
                      ? 'border border-dorado/30 bg-dorado/12 text-dorado hover:bg-dorado/18'
                      : 'border border-grisOscuro bg-oscuro/40 text-claro/80 hover:border-dorado/35'
                  }`}
                >
                  {textoPanel}
                </Link>
                <button
                  type="button"
                  onClick={() => {
                    setMenuMovilAbierto(false)
                    cerrarSesion()
                  }}
                  className="rounded-xl border border-grisOscuro bg-oscuro/40 px-3 py-2 text-sm text-claro/80 transition hover:border-dorado/35"
                >
                  Salir
                </button>
              </div>
            ) : (
              <Link
                to={rutas.iniciarSesion}
                onClick={() => setMenuMovilAbierto(false)}
                className="mt-2 inline-flex items-center justify-center gap-2 rounded-xl border border-dorado/30 bg-dorado/12 px-3 py-2 text-sm text-dorado transition hover:bg-dorado/18"
              >
                <FiUser />
                Entrar
              </Link>
            )}
          </div>
        </div>
      ) : null}
    </header>
  )
}
