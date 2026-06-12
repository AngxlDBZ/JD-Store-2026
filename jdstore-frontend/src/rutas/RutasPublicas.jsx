import { Route } from 'react-router-dom'
import { Inicio } from '../paginas/publicas/Inicio'
import { Catalogo } from '../paginas/publicas/Catalogo'
import { Categoria } from '../paginas/publicas/Categoria'
import { DetalleProducto } from '../paginas/publicas/DetalleProducto'
import { QuienesSomos } from '../paginas/publicas/QuienesSomos'
import { Contacto } from '../paginas/publicas/Contacto'
import { Carrito } from '../paginas/cliente/Carrito'
import { IniciarSesion } from '../paginas/autenticacion/IniciarSesion'
import { Registro } from '../paginas/autenticacion/Registro'

export function RutasPublicas() {
  return (
    <>
      <Route index element={<Inicio />} />
      <Route path="catalogo" element={<Catalogo />} />
      <Route path="categoria/:slug" element={<Categoria />} />
      <Route path="producto/:id" element={<DetalleProducto />} />
      <Route path="carrito" element={<Carrito />} />
      <Route path="quienes-somos" element={<QuienesSomos />} />
      <Route path="contacto" element={<Contacto />} />
      <Route path="iniciar-sesion" element={<IniciarSesion />} />
      <Route path="registro" element={<Registro />} />
    </>
  )
}

