import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import './estilos/global.css'
import App from './App.jsx'
import { ProveedorAutenticacion } from './contextos/ContextoAutenticacion'
import { ProveedorCarrito } from './contextos/ContextoCarrito'
import { ProveedorFavoritos } from './contextos/ContextoFavoritos'

const elementoRoot = document.getElementById('root')

try {
  createRoot(elementoRoot).render(
    <StrictMode>
      <BrowserRouter>
        <ProveedorAutenticacion>
          <ProveedorFavoritos>
            <ProveedorCarrito>
              <App />
              <Toaster position="top-right" />
            </ProveedorCarrito>
          </ProveedorFavoritos>
        </ProveedorAutenticacion>
      </BrowserRouter>
    </StrictMode>
  )
} catch (e) {
  if (elementoRoot) {
    elementoRoot.textContent = `Error iniciando la app: ${e instanceof Error ? e.message : String(e)}`
  }
}
