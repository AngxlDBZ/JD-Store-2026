/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        oscuro: '#111111',
        grisOscuro: '#1f1f1f',
        grisMedio: '#3a3a3a',
        claro: '#ffffff',
        dorado: '#c9a84c',
        doradoClaro: '#e8c97e',
      },
      fontFamily: {
        urbana: ['"Bebas Neue"', 'system-ui', 'sans-serif'],
        texto: ['"Chakra Petch"', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        dorado: '0 0 0 1px rgba(201,168,76,0.35), 0 10px 30px rgba(0,0,0,0.35)',
      },
    },
  },
  plugins: [],
}
