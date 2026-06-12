import { Link } from 'react-router-dom'
import { FiInstagram } from 'react-icons/fi'
import { SiTiktok } from 'react-icons/si'
import { rutas } from '../../constantes/rutas'
import { logoTiendaSrc } from '../../constantes/recursosTienda'

export function PieDePagina() {
  return (
    <footer className="border-t border-grisOscuro bg-[linear-gradient(180deg,#090909_0%,#070707_100%)]">
      <div className="mx-auto max-w-[1440px] px-4 py-12 sm:px-6 xl:px-8">
        <div className="overflow-hidden rounded-[32px] border border-grisOscuro bg-[#101010] shadow-[0_18px_50px_rgba(0,0,0,0.18)]">
          <div className="grid gap-0 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,0.8fr)_minmax(0,0.9fr)]">
            <div className="border-b border-grisOscuro p-7 lg:border-b-0 lg:border-r">
              <div className="flex items-center gap-4">
                <img
                  src={logoTiendaSrc}
                  alt="Logo JD Store"
                  className="h-16 w-16 object-contain sm:h-20 sm:w-20"
                  loading="lazy"
                />
                <div>
                  <div className="font-urbana text-2xl tracking-wide text-claro">JD STORE</div>
                  <div className="text-sm text-doradoClaro/80">Streetwear premium en Ibagué</div>
                </div>
              </div>
              <p className="mt-5 max-w-lg text-sm leading-7 text-claro/65">
                En JD Store mezclamos actitud, comodidad y estilo urbano para que cada outfit se vea auténtico, actual y listo para destacar.
              </p>
              <div className="mt-6 flex flex-wrap gap-3 text-xs text-claro/60">
                <span className="rounded-full border border-dorado/20 bg-dorado/8 px-3 py-1">Moda urbana masculina</span>
                <span className="rounded-full border border-grisOscuro bg-grisOscuro/35 px-3 py-1">Compra segura</span>
                <span className="rounded-full border border-grisOscuro bg-grisOscuro/35 px-3 py-1">Atención personalizada</span>
              </div>
            </div>

            <div className="border-b border-grisOscuro p-7 lg:border-b-0 lg:border-r">
              <div className="text-sm font-semibold uppercase tracking-[0.2em] text-dorado/90">Explorar</div>
              <div className="mt-5 grid gap-3 text-sm">
                <Link to={rutas.inicio} className="text-claro/72 transition hover:text-doradoClaro">
                  Inicio
                </Link>
                <Link to={rutas.catalogo} className="text-claro/72 transition hover:text-doradoClaro">
                  Catálogo
                </Link>
                <Link to={rutas.quienesSomos} className="text-claro/72 transition hover:text-doradoClaro">
                  Quiénes somos
                </Link>
                <Link to={rutas.contacto} className="text-claro/72 transition hover:text-doradoClaro">
                  Contáctanos
                </Link>
              </div>
            </div>

            <div className="p-7">
              <div className="text-sm font-semibold uppercase tracking-[0.2em] text-dorado/90">Contacto</div>
              <div className="mt-5 space-y-3 text-sm text-claro/68">
                <div>mora59974@gmail.com</div>
                <div>+57 318 326 0720</div>
                <div>Centro Comercial La 14, Local 128, Piso 1, Ibagué, Tolima</div>
              </div>
              <div className="mt-6 flex flex-wrap items-center gap-3">
                <a
                  href="https://instagram.com/jd.store_12"
                  target="_blank"
                  rel="noreferrer"
                  aria-label="Instagram JD Store"
                  className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-grisOscuro bg-grisOscuro/55 text-claro/80 transition hover:border-dorado/40 hover:text-doradoClaro"
                >
                  <FiInstagram className="text-lg" />
                </a>
                <a
                  href="https://tiktok.com/@jd.store.120"
                  target="_blank"
                  rel="noreferrer"
                  aria-label="TikTok JD Store"
                  className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-grisOscuro bg-grisOscuro/55 text-claro/80 transition hover:border-dorado/40 hover:text-doradoClaro"
                >
                  <SiTiktok className="text-lg" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-grisOscuro py-4 text-center text-xs tracking-wide text-claro/45">
        © {new Date().getFullYear()} JD Store. Todos los derechos reservados.
      </div>
    </footer>
  )
}

