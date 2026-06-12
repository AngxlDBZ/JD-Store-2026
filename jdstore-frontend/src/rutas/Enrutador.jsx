import { Suspense, lazy } from 'react'
import { Route, Routes } from 'react-router-dom'
import { LayoutPublico } from '../componentes/comunes/LayoutPublico'
import { LayoutAdmin } from '../componentes/admin/LayoutAdmin'
import { LayoutVendedor } from '../componentes/vendedor/LayoutVendedor'
import { CargadorSpinner } from '../componentes/comunes/CargadorSpinner'
import { RutaProtegida } from './RutaProtegida'

const Inicio = lazy(() => import('../paginas/publicas/Inicio').then((modulo) => ({ default: modulo.Inicio })))
const Catalogo = lazy(() => import('../paginas/publicas/Catalogo').then((modulo) => ({ default: modulo.Catalogo })))
const Categoria = lazy(() => import('../paginas/publicas/Categoria').then((modulo) => ({ default: modulo.Categoria })))
const DetalleProducto = lazy(() =>
  import('../paginas/publicas/DetalleProducto').then((modulo) => ({ default: modulo.DetalleProducto }))
)
const QuienesSomos = lazy(() =>
  import('../paginas/publicas/QuienesSomos').then((modulo) => ({ default: modulo.QuienesSomos }))
)
const Contacto = lazy(() => import('../paginas/publicas/Contacto').then((modulo) => ({ default: modulo.Contacto })))
const Carrito = lazy(() => import('../paginas/cliente/Carrito').then((modulo) => ({ default: modulo.Carrito })))
const Checkout = lazy(() => import('../paginas/cliente/Checkout').then((modulo) => ({ default: modulo.Checkout })))
const PagoResultado = lazy(() =>
  import('../paginas/cliente/PagoResultado').then((modulo) => ({ default: modulo.PagoResultado }))
)
const Perfil = lazy(() => import('../paginas/cliente/Perfil').then((modulo) => ({ default: modulo.Perfil })))
const Recibo = lazy(() => import('../paginas/cliente/Recibo').then((modulo) => ({ default: modulo.Recibo })))
const IniciarSesion = lazy(() =>
  import('../paginas/autenticacion/IniciarSesion').then((modulo) => ({ default: modulo.IniciarSesion }))
)
const Registro = lazy(() =>
  import('../paginas/autenticacion/Registro').then((modulo) => ({ default: modulo.Registro }))
)
const PanelAdmin = lazy(() => import('../paginas/admin/PanelAdmin').then((modulo) => ({ default: modulo.PanelAdmin })))
const GestionProductos = lazy(() =>
  import('../paginas/admin/GestionProductos').then((modulo) => ({ default: modulo.GestionProductos }))
)
const GestionPedidos = lazy(() =>
  import('../paginas/admin/GestionPedidos').then((modulo) => ({ default: modulo.GestionPedidos }))
)
const GestionMensajes = lazy(() =>
  import('../paginas/admin/GestionMensajes').then((modulo) => ({ default: modulo.GestionMensajes }))
)
const Reportes = lazy(() => import('../paginas/admin/Reportes').then((modulo) => ({ default: modulo.Reportes })))
const GestionUsuarios = lazy(() =>
  import('../paginas/admin/GestionUsuarios').then((modulo) => ({ default: modulo.GestionUsuarios }))
)
const GestionBanners = lazy(() =>
  import('../paginas/admin/GestionBanners').then((modulo) => ({ default: modulo.GestionBanners }))
)
const GestionDestacados = lazy(() =>
  import('../paginas/admin/GestionDestacados').then((modulo) => ({ default: modulo.GestionDestacados }))
)
const GestionPromociones = lazy(() =>
  import('../paginas/admin/GestionPromociones').then((modulo) => ({ default: modulo.GestionPromociones }))
)
const GestionCupones = lazy(() =>
  import('../paginas/admin/GestionCupones').then((modulo) => ({ default: modulo.GestionCupones }))
)
const GestionResenas = lazy(() =>
  import('../paginas/admin/GestionResenas').then((modulo) => ({ default: modulo.GestionResenas }))
)
const PanelVendedor = lazy(() =>
  import('../paginas/vendedor/PanelVendedor').then((modulo) => ({ default: modulo.PanelVendedor }))
)
const InventarioVendedor = lazy(() =>
  import('../paginas/vendedor/InventarioVendedor').then((modulo) => ({ default: modulo.InventarioVendedor }))
)
const DevolucionesVendedor = lazy(() =>
  import('../paginas/vendedor/DevolucionesVendedor').then((modulo) => ({ default: modulo.DevolucionesVendedor }))
)

function PantallaCargaRuta() {
  return (
    <div className="mx-auto max-w-[1440px] px-4 py-12 sm:px-6 xl:px-8">
      <CargadorSpinner />
    </div>
  )
}

function renderizarRuta(Componente) {
  return (
    <Suspense fallback={<PantallaCargaRuta />}>
      <Componente />
    </Suspense>
  )
}

function NoEncontrado() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-16">
      <div className="rounded-3xl border border-grisOscuro bg-grisOscuro/40 p-8 text-claro/70">
        Página no encontrada.
      </div>
    </div>
  )
}

export function Enrutador() {
  return (
    <Routes>
      <Route path="/" element={<LayoutPublico />}>
        <Route index element={renderizarRuta(Inicio)} />
        <Route path="catalogo" element={renderizarRuta(Catalogo)} />
        <Route path="categoria/:slug" element={renderizarRuta(Categoria)} />
        <Route path="producto/:id" element={renderizarRuta(DetalleProducto)} />
        <Route path="carrito" element={renderizarRuta(Carrito)} />
        <Route path="quienes-somos" element={renderizarRuta(QuienesSomos)} />
        <Route path="contacto" element={renderizarRuta(Contacto)} />
        <Route path="iniciar-sesion" element={renderizarRuta(IniciarSesion)} />
        <Route path="registro" element={renderizarRuta(Registro)} />

        <Route
          path="checkout"
          element={
            <RutaProtegida>
              {renderizarRuta(Checkout)}
            </RutaProtegida>
          }
        />
        <Route
          path="checkout/resultado"
          element={
            <RutaProtegida>
              {renderizarRuta(PagoResultado)}
            </RutaProtegida>
          }
        />
        <Route
          path="perfil"
          element={
            <RutaProtegida>
              {renderizarRuta(Perfil)}
            </RutaProtegida>
          }
        />

        <Route path="*" element={<NoEncontrado />} />
      </Route>

      <Route
        path="/vendedor"
        element={
          <RutaProtegida requiereVendedor>
            <LayoutVendedor />
          </RutaProtegida>
        }
      >
        <Route index element={renderizarRuta(PanelVendedor)} />
        <Route path="inventario" element={renderizarRuta(InventarioVendedor)} />
        <Route path="devoluciones" element={renderizarRuta(DevolucionesVendedor)} />
      </Route>

      <Route
        path="/admin"
        element={
          <RutaProtegida requiereAdmin>
            <LayoutAdmin />
          </RutaProtegida>
        }
      >
        <Route index element={renderizarRuta(PanelAdmin)} />
        <Route path="productos" element={renderizarRuta(GestionProductos)} />
        <Route path="pedidos" element={renderizarRuta(GestionPedidos)} />
        <Route path="destacados" element={renderizarRuta(GestionDestacados)} />
        <Route path="banners" element={renderizarRuta(GestionBanners)} />
        <Route path="promociones" element={renderizarRuta(GestionPromociones)} />
        <Route path="cupones" element={renderizarRuta(GestionCupones)} />
        <Route path="resenas" element={renderizarRuta(GestionResenas)} />
        <Route path="usuarios" element={renderizarRuta(GestionUsuarios)} />
        <Route path="mensajes" element={renderizarRuta(GestionMensajes)} />
        <Route path="reportes" element={renderizarRuta(Reportes)} />
      </Route>

      <Route
        path="/recibo/:id"
        element={
          <RutaProtegida>
            {renderizarRuta(Recibo)}
          </RutaProtegida>
        }
      />
    </Routes>
  )
}
