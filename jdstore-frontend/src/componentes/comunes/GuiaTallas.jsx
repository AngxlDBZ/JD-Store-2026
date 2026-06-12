const filasGuia = [
  { talla: 'XS', pecho: '86-90 cm', cintura: '70-74 cm' },
  { talla: 'S', pecho: '91-96 cm', cintura: '75-80 cm' },
  { talla: 'M', pecho: '97-102 cm', cintura: '81-86 cm' },
  { talla: 'L', pecho: '103-108 cm', cintura: '87-92 cm' },
  { talla: 'XL', pecho: '109-114 cm', cintura: '93-98 cm' },
  { talla: 'XXL', pecho: '115-120 cm', cintura: '99-104 cm' },
]

export function GuiaTallas() {
  return (
    <div className="rounded-2xl border border-grisOscuro bg-oscuro/40 p-4">
      <div className="text-sm font-semibold text-dorado">Guía de tallas</div>
      <div className="mt-2 text-xs text-claro/60">Las medidas son referenciales y pueden variar ligeramente según la prenda.</div>

      <div className="mt-4 overflow-x-auto">
        <table className="min-w-full text-left text-sm text-claro/75">
          <thead className="text-xs uppercase text-claro/45">
            <tr>
              <th className="px-3 py-2">Talla</th>
              <th className="px-3 py-2">Pecho</th>
              <th className="px-3 py-2">Cintura</th>
            </tr>
          </thead>
          <tbody>
            {filasGuia.map((fila) => (
              <tr key={fila.talla} className="border-t border-grisOscuro">
                <td className="px-3 py-2 font-semibold text-claro">{fila.talla}</td>
                <td className="px-3 py-2">{fila.pecho}</td>
                <td className="px-3 py-2">{fila.cintura}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
