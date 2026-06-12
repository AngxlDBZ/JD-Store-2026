import logoTienda from '../assets/tienda/logo.avif'
import storeExterior1 from '../assets/tienda/store_exterior_1.avif'
import storeExterior2 from '../assets/tienda/store_exterior_2.avif'
import storeExterior3 from '../assets/tienda/store_exterior_3.avif'
import storeExterior6 from '../assets/tienda/store_exterior_6.jpeg'
import videoStore2 from '../assets/tienda/video-store-2.mp4'
import videoStore3 from '../assets/tienda/video-store-3.mp4'

export const logoTiendaSrc = logoTienda

export const mosaicoTiendaRecursos = [
  {
    tipo: 'imagen',
    src: storeExterior1,
    alt: 'Frente de la tienda JD Store',
    titulo: 'Frente de tienda',
    clase: 'lg:col-span-2 min-h-[135px] sm:min-h-[150px] lg:min-h-[150px]',
  },
  {
    tipo: 'video',
    src: videoStore3,
    titulo: 'Zona comercial',
    clase: 'lg:col-span-2 min-h-[135px] sm:min-h-[150px] lg:min-h-[150px]',
  },
  {
    tipo: 'imagen',
    src: storeExterior2,
    alt: 'Vista lateral de JD Store',
    titulo: 'Vista lateral',
    clase: 'lg:col-span-2 min-h-[135px] sm:min-h-[150px] lg:min-h-[150px]',
  },
  {
    tipo: 'imagen',
    src: storeExterior3,
    alt: 'Entrada exterior de JD Store',
    titulo: 'Entrada',
    clase: 'lg:col-span-2 min-h-[135px] sm:min-h-[150px] lg:min-h-[150px]',
  },
  {
    tipo: 'video',
    src: videoStore2,
    titulo: 'Ambiente de tienda',
    clase: 'lg:col-span-2 min-h-[135px] sm:min-h-[150px] lg:min-h-[150px]',
  },
  {
    tipo: 'imagen',
    src: storeExterior6,
    alt: 'Vista adicional de JD Store',
    titulo: 'Vista panoramica',
    clase: 'lg:col-span-2 min-h-[135px] sm:min-h-[150px] lg:min-h-[150px]',
  },
]
