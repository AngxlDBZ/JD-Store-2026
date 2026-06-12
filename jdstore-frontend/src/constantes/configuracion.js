function obtenerApiUrl() {
  if (typeof window === 'undefined') {
    return import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000/api'
  }

  if (import.meta.env.PROD) {
    return `${window.location.origin}/api`
  }

  return import.meta.env.VITE_API_URL || `${window.location.origin}/api`
}

export const configuracion = {
  apiUrl: obtenerApiUrl(),
}

