import { Route } from 'react-router-dom'
import { RutaProtegida } from './RutaProtegida'
import { Checkout } from '../paginas/cliente/Checkout'
import { Perfil } from '../paginas/cliente/Perfil'

export function RutasCliente() {
  return (
    <>
      <Route
        path="checkout"
        element={
          <RutaProtegida>
            <Checkout />
          </RutaProtegida>
        }
      />
      <Route
        path="perfil"
        element={
          <RutaProtegida>
            <Perfil />
          </RutaProtegida>
        }
      />
    </>
  )
}

