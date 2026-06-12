export function formatearMoneda(valor) {
  const numero = typeof valor === 'number' ? valor : Number(valor || 0)

  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    maximumFractionDigits: 0,
  }).format(numero)
}

