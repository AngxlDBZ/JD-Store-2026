import axios from 'axios'
import { configuracion } from '../constantes/configuracion'

const clienteHttp = axios.create({
  baseURL: configuracion.apiUrl,
  headers: {
    Accept: 'application/json',
  },
})

clienteHttp.interceptors.request.use((config) => {
  const token = localStorage.getItem('jdstore_token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

export { clienteHttp }

