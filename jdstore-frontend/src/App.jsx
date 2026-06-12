import React from 'react'
import { Enrutador } from './rutas/Enrutador'

class LimiteErrores extends React.Component {
  constructor(props) {
    super(props)
    this.state = { error: null }
  }

  static getDerivedStateFromError(error) {
    return { error }
  }

  render() {
    if (this.state.error) {
      return (
        <div className="min-h-screen bg-oscuro text-claro p-6">
          <div className="mx-auto max-w-3xl rounded-2xl border border-dorado/30 bg-grisOscuro/50 p-6">
            <div className="font-urbana text-3xl tracking-wide text-dorado">Error en el frontend</div>
            <div className="mt-3 text-sm text-claro/80">
              Abre la consola del navegador (F12 → Console) y copia el error.
            </div>
            <pre className="mt-5 overflow-auto rounded-xl bg-black/40 p-4 text-xs text-claro/80">
              {String(this.state.error?.message || this.state.error)}
            </pre>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}

export default function App() {
  return (
    <LimiteErrores>
      <Enrutador />
    </LimiteErrores>
  )
}
