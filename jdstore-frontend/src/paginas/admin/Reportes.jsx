import { useEffect, useMemo, useState } from 'react'
import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import toast from 'react-hot-toast'
import * as XLSX from 'xlsx-js-style'
import { obtenerClientesFrecuentes, obtenerProductosMasVendidos, obtenerReporteDiario, obtenerVentasPorPeriodo } from '../../servicios/reporteServicio'
import { formatearMoneda } from '../../utilidades/formatearMoneda'
import { TarjetaEstadistica } from '../../componentes/admin/TarjetaEstadistica'

export function Reportes() {
  const [desde, setDesde] = useState('')
  const [hasta, setHasta] = useState('')
  const [ventas, setVentas] = useState([])
  const [fechaDiaria, setFechaDiaria] = useState(() => new Date().toISOString().slice(0, 10))
  const [reporteDiario, setReporteDiario] = useState(null)
  const [cargandoDiario, setCargandoDiario] = useState(false)
  const [productosTop, setProductosTop] = useState([])
  const [clientesTop, setClientesTop] = useState([])
  const [cargandoTop, setCargandoTop] = useState(false)

  async function cargar() {
    try {
      const datos = await obtenerVentasPorPeriodo(desde || undefined, hasta || undefined)
      setVentas(datos.ventas || [])
    } catch {
      toast.error('No se pudieron cargar las ventas')
    }
  }

  useEffect(() => {
    cargar()
  }, [])

  useEffect(() => {
    let activo = true

    async function cargarTop() {
      setCargandoTop(true)
      try {
        const [datosProductos, datosClientes] = await Promise.all([
          obtenerProductosMasVendidos({ limite: 10 }),
          obtenerClientesFrecuentes({ limite: 10 }),
        ])

        if (!activo) return
        setProductosTop(datosProductos.productos || [])
        setClientesTop(datosClientes.clientes || [])
      } catch {
        if (activo) {
          setProductosTop([])
          setClientesTop([])
        }
      } finally {
        if (activo) setCargandoTop(false)
      }
    }

    cargarTop()

    return () => {
      activo = false
    }
  }, [])

  useEffect(() => {
    cargarReporteDiario(fechaDiaria)
  }, [fechaDiaria])

  const pedidosDiarios = useMemo(() => reporteDiario?.pedidos || [], [reporteDiario])

  async function cargarReporteDiario(fecha = fechaDiaria) {
    setCargandoDiario(true)
    try {
      const datos = await obtenerReporteDiario(fecha)
      setReporteDiario(datos)
      return datos
    } catch {
      toast.error('No se pudo cargar el reporte diario')
      return null
    } finally {
      setCargandoDiario(false)
    }
  }

  async function asegurarReporteActual() {
    if (reporteDiario?.fecha === fechaDiaria) {
      return reporteDiario
    }

    return cargarReporteDiario(fechaDiaria)
  }

  function capitalizarEstado(estado) {
    return String(estado || '')
      .replaceAll('_', ' ')
      .replace(/\b\w/g, (letra) => letra.toUpperCase())
  }

  function resolverEstadoPago(pedido) {
    if (pedido?.estado_pago) return pedido.estado_pago
    return pedido?.proveedor_pago ? 'pendiente' : 'aprobado'
  }

  function describirPago(pedido) {
    const estadoPago = capitalizarEstado(resolverEstadoPago(pedido))
    const metodo = pedido?.metodo_pago || pedido?.proveedor_pago || ''
    return metodo ? `${estadoPago} / ${metodo}` : estadoPago
  }

  async function generarPdfDiario() {
    const reporte = await asegurarReporteActual()
    if (!reporte) return

    const contenido = `
      <html>
        <head>
          <title>Reporte diario ${reporte.fecha}</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 24px; color: #111; }
            h1, h2 { margin: 0; }
            h1 { font-size: 24px; }
            h2 { font-size: 18px; color: #666; margin-bottom: 20px; }
            .grid { display: grid; grid-template-columns: repeat(5, 1fr); gap: 12px; margin: 20px 0; }
            .card { border: 1px solid #ddd; border-radius: 12px; padding: 14px; }
            .card strong { display: block; font-size: 11px; text-transform: uppercase; color: #666; }
            .card div { font-size: 16px; font-weight: bold; margin-top: 4px; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; font-size: 13px; }
            th, td { border: 1px solid #eee; padding: 10px; text-align: left; vertical-align: top; }
            th { background: #f9f9f9; color: #666; font-weight: 600; }
          </style>
        </head>
        <body>
          <h1>JD Store</h1>
          <h2>Reporte diario — ${reporte.fecha}</h2>
          
          <div class="grid">
            <div class="card"><strong>Pedidos</strong><div>${reporte.totales?.pedidos ?? 0}</div></div>
            <div class="card"><strong>Ingresos</strong><div>${formatearMoneda(reporte.totales?.ingresos ?? 0)}</div></div>
            <div class="card"><strong>Pendientes</strong><div>${reporte.totales?.pendientes ?? 0}</div></div>
            <div class="card"><strong>Pagos aprobados</strong><div>${reporte.totales?.pagos_aprobados ?? 0}</div></div>
            <div class="card"><strong>Pagos pendientes</strong><div>${reporte.totales?.pagos_pendientes ?? 0}</div></div>
          </div>

          <table>
            <thead>
              <tr>
                <th>Pedido</th>
                <th>Cliente</th>
                <th>Estado</th>
                <th>Pago</th>
                <th>Total</th>
                <th>Productos</th>
              </tr>
            </thead>
            <tbody>
              ${(reporte.pedidos || [])
                .map(
                  (pedido) => `
                    <tr>
                      <td>#${pedido.id}</td>
                      <td>
                        <strong>${pedido.cliente?.nombre_completo || 'Sin cliente'}</strong><br>
                        ${pedido.cliente?.email || ''}
                      </td>
                      <td><span style="text-transform: capitalize;">${capitalizarEstado(pedido.estado)}</span></td>
                      <td>${describirPago(pedido)}</td>
                      <td><strong>${formatearMoneda(pedido.total)}</strong></td>
                      <td>
                        ${(pedido.detalles || [])
                          .map((detalle) => `${detalle.producto?.nombre || 'Producto'} x ${detalle.cantidad}`)
                          .join('<br>')}
                      </td>
                    </tr>
                  `
                )
                .join('')}
            </tbody>
          </table>

          <script>
            window.onload = function() {
              setTimeout(() => {
                window.print();
                window.onafterprint = () => window.close();
              }, 500);
            };
          </script>
        </body>
      </html>
    `

    const ventana = window.open('', '_blank')
    if (!ventana) {
      toast.error('El navegador bloqueó la ventana del reporte. Permite los popups para JD Store.')
      return
    }

    ventana.document.write(contenido)
    ventana.document.close()
  }

  async function generarExcelDiario() {
    const reporte = await asegurarReporteActual()
    if (!reporte) return

    const libro = XLSX.utils.book_new()
    const hoja = XLSX.utils.aoa_to_sheet([])
    const dorado = 'C9A84C'
    const doradoClaro = 'F1E1A7'
    const oscuro = '111111'
    const grisCabecera = '222222'
    const grisBorde = '3A3A3A'
    const grisFondo = 'F7F4E8'

    XLSX.utils.sheet_add_aoa(
      hoja,
      [
        ['JD STORE'],
        [`Reporte diario - ${reporte.fecha}`],
        [],
          ['Pedidos', reporte.totales?.pedidos ?? 0, 'Ingresos', reporte.totales?.ingresos ?? 0, 'Pendientes', reporte.totales?.pendientes ?? 0],
          ['Pagos aprobados', reporte.totales?.pagos_aprobados ?? 0, 'Pagos pendientes', reporte.totales?.pagos_pendientes ?? 0, 'Pagos fallidos', reporte.totales?.pagos_fallidos ?? 0],
        [],
          ['Pedido', 'Fecha', 'Cliente', 'Correo', 'Estado', 'Pago', 'Total', 'Productos'],
      ],
      { origin: 'A1' }
    )

    const filasPedidos = (reporte.pedidos || []).map((pedido) => [
      `#${pedido.id}`,
      pedido.fecha || reporte.fecha,
      pedido.cliente?.nombre_completo || 'Sin cliente',
      pedido.cliente?.email || '',
      capitalizarEstado(pedido.estado),
        describirPago(pedido),
      Number(pedido.total || 0),
      (pedido.detalles || [])
        .map((detalle) => `${detalle.producto?.nombre || 'Producto'} x ${detalle.cantidad}`)
        .join('\n'),
    ])

    if (filasPedidos.length) {
      XLSX.utils.sheet_add_aoa(hoja, filasPedidos, { origin: 'A8' })
    } else {
      XLSX.utils.sheet_add_aoa(hoja, [['Sin pedidos para la fecha seleccionada']], { origin: 'A8' })
      hoja['!merges'] = [...(hoja['!merges'] || []), XLSX.utils.decode_range('A8:H8')]
    }

    hoja['!merges'] = [
      ...(hoja['!merges'] || []),
      XLSX.utils.decode_range('A1:H1'),
      XLSX.utils.decode_range('A2:H2'),
    ]

    hoja['!cols'] = [
      { wch: 12 },
      { wch: 20 },
      { wch: 28 },
      { wch: 32 },
      { wch: 18 },
      { wch: 28 },
      { wch: 16 },
      { wch: 60 },
    ]

    function aplicarEstilo(celda, estilo) {
      if (!hoja[celda]) return
      hoja[celda].s = estilo
    }

    aplicarEstilo('A1', {
      font: { bold: true, sz: 18, color: { rgb: dorado } },
      alignment: { horizontal: 'center', vertical: 'center' },
      fill: { fgColor: { rgb: oscuro } },
    })

    aplicarEstilo('A2', {
      font: { bold: true, sz: 12, color: { rgb: oscuro } },
      alignment: { horizontal: 'center', vertical: 'center' },
      fill: { fgColor: { rgb: doradoClaro } },
    })

    ;['A4', 'C4', 'E4', 'A5', 'C5', 'E5'].forEach((celda) => {
      aplicarEstilo(celda, {
        font: { bold: true, color: { rgb: dorado } },
        fill: { fgColor: { rgb: oscuro } },
        alignment: { horizontal: 'center' },
        border: {
          top: { style: 'thin', color: { rgb: grisBorde } },
          bottom: { style: 'thin', color: { rgb: grisBorde } },
          left: { style: 'thin', color: { rgb: grisBorde } },
          right: { style: 'thin', color: { rgb: grisBorde } },
        },
      })
    })

    ;['B4', 'D4', 'F4', 'B5', 'D5', 'F5'].forEach((celda) => {
      aplicarEstilo(celda, {
        font: { bold: true, color: { rgb: oscuro } },
        fill: { fgColor: { rgb: doradoClaro } },
        alignment: { horizontal: 'center' },
        border: {
          top: { style: 'thin', color: { rgb: grisBorde } },
          bottom: { style: 'thin', color: { rgb: grisBorde } },
          left: { style: 'thin', color: { rgb: grisBorde } },
          right: { style: 'thin', color: { rgb: grisBorde } },
        },
      })
    })

    for (const celda of ['A7', 'B7', 'C7', 'D7', 'E7', 'F7', 'G7', 'H7']) {
      aplicarEstilo(celda, {
        font: { bold: true, color: { rgb: doradoClaro } },
        fill: { fgColor: { rgb: grisCabecera } },
        alignment: { horizontal: 'center', vertical: 'center', wrapText: true },
        border: {
          top: { style: 'thin', color: { rgb: grisBorde } },
          bottom: { style: 'thin', color: { rgb: grisBorde } },
          left: { style: 'thin', color: { rgb: grisBorde } },
          right: { style: 'thin', color: { rgb: grisBorde } },
        },
      })
    }

    const filaInicialDatos = 8
    const filaFinalDatos = Math.max(filaInicialDatos, filaInicialDatos + filasPedidos.length - 1)

    for (let fila = filaInicialDatos; fila <= filaFinalDatos; fila += 1) {
      for (const columna of ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H']) {
        aplicarEstilo(`${columna}${fila}`, {
          font: { color: { rgb: oscuro } },
          fill: { fgColor: { rgb: fila % 2 === 0 ? 'FFFFFF' : grisFondo } },
          alignment: {
            vertical: 'top',
            wrapText: columna === 'H' || columna === 'F' || columna === 'C' || columna === 'D',
          },
          border: {
            top: { style: 'thin', color: { rgb: 'D8D2BF' } },
            bottom: { style: 'thin', color: { rgb: 'D8D2BF' } },
            left: { style: 'thin', color: { rgb: 'D8D2BF' } },
            right: { style: 'thin', color: { rgb: 'D8D2BF' } },
          },
        })
      }

      if (hoja[`G${fila}`]) {
        hoja[`G${fila}`].z = '$#,##0'
      }
    }

    XLSX.utils.book_append_sheet(libro, hoja, 'Reporte Diario')
    XLSX.writeFile(libro, `reporte-diario-${reporte.fecha}.xlsx`)
  }

  return (
    <div className="space-y-6">
      <div>
        <div className="text-xs uppercase tracking-widest text-claro/50">Admin</div>
        <h1 className="mt-2 font-urbana text-3xl tracking-wide text-claro/90 sm:text-4xl">Reportes</h1>
      </div>

      <div className="rounded-2xl border border-grisOscuro bg-grisOscuro/40 p-5">
        <div className="flex flex-wrap items-end gap-3">
          <div>
            <div className="text-xs text-claro/50">Desde</div>
            <input
              type="date"
              value={desde}
              onChange={(e) => setDesde(e.target.value)}
              className="mt-1 rounded-xl border border-grisOscuro bg-oscuro/40 px-4 py-2 text-sm text-claro/80 focus:outline-none focus:border-dorado/50"
            />
          </div>
          <div>
            <div className="text-xs text-claro/50">Hasta</div>
            <input
              type="date"
              value={hasta}
              onChange={(e) => setHasta(e.target.value)}
              className="mt-1 rounded-xl border border-grisOscuro bg-oscuro/40 px-4 py-2 text-sm text-claro/80 focus:outline-none focus:border-dorado/50"
            />
          </div>
          <button
            type="button"
            onClick={cargar}
            className="rounded-xl bg-dorado px-4 py-2 text-sm font-semibold text-oscuro hover:bg-doradoClaro transition"
          >
            Filtrar
          </button>
        </div>
      </div>

      <div className="rounded-2xl border border-grisOscuro bg-grisOscuro/40 p-6">
        <div className="text-sm font-semibold text-claro/80">Ventas por día</div>
        <div className="mt-5 h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={ventas}>
              <XAxis dataKey="fecha" tick={{ fontSize: 12, fill: '#ffffff' }} axisLine={{ stroke: '#3a3a3a' }} tickLine={{ stroke: '#3a3a3a' }} />
              <YAxis tick={{ fontSize: 12, fill: '#ffffff' }} axisLine={{ stroke: '#3a3a3a' }} tickLine={{ stroke: '#3a3a3a' }} />
              <Tooltip formatter={(value) => formatearMoneda(value)} contentStyle={{ background: '#111111', border: '1px solid #3a3a3a', borderRadius: 12, color: '#ffffff' }} />
              <Bar dataKey="total" fill="#c9a84c" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="rounded-2xl border border-grisOscuro bg-grisOscuro/40 p-5">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <div className="text-sm font-semibold text-claro/80">Reporte diario</div>
            <div className="mt-1 text-xs text-claro/50">Exporta el reporte diario directamente en PDF o EXCEL.</div>
          </div>
          <div className="flex flex-wrap items-end gap-3">
            <div>
              <div className="text-xs text-claro/50">Fecha</div>
              <input
                type="date"
                value={fechaDiaria}
                onChange={(e) => setFechaDiaria(e.target.value)}
                className="mt-1 rounded-xl border border-grisOscuro bg-oscuro/40 px-4 py-2 text-sm text-claro/80 focus:border-dorado/50 focus:outline-none"
              />
            </div>
            <button
              type="button"
              onClick={generarPdfDiario}
              className="rounded-xl bg-dorado px-4 py-2 text-sm font-semibold text-oscuro transition hover:bg-doradoClaro"
            >
              PDF
            </button>
            <button
              type="button"
              onClick={generarExcelDiario}
              className="rounded-xl border border-grisOscuro bg-oscuro/40 px-4 py-2 text-sm text-claro/80 transition hover:border-dorado/40 hover:text-doradoClaro"
            >
              EXCEL
            </button>
          </div>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        <TarjetaEstadistica titulo="Pedidos del día" valor={reporteDiario?.totales?.pedidos ?? '—'} />
        <TarjetaEstadistica
          titulo="Ingresos del día"
          valor={reporteDiario ? formatearMoneda(reporteDiario.totales?.ingresos ?? 0) : '—'}
        />
        <TarjetaEstadistica titulo="Pendientes del día" valor={reporteDiario?.totales?.pendientes ?? '—'} />
        <TarjetaEstadistica titulo="Pagos aprobados" valor={reporteDiario?.totales?.pagos_aprobados ?? '—'} />
        <TarjetaEstadistica titulo="Pagos pendientes" valor={reporteDiario?.totales?.pagos_pendientes ?? '—'} />
      </div>

      <div className="rounded-2xl border border-grisOscuro bg-grisOscuro/40 p-5">
        <div className="text-sm font-semibold text-claro/80">Pedidos del reporte diario</div>
        <div className="mt-4 grid gap-4">
          {cargandoDiario ? (
            <div className="text-sm text-claro/50">Cargando reporte...</div>
          ) : pedidosDiarios.length === 0 ? (
            <div className="text-sm text-claro/60">No hay pedidos para esa fecha.</div>
          ) : (
            pedidosDiarios.map((pedido) => (
              <div key={pedido.id} className="rounded-2xl border border-grisOscuro bg-oscuro/40 p-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <div className="font-semibold text-claro/90">Pedido #{pedido.id}</div>
                    <div className="text-sm text-claro/60">{pedido.cliente?.nombre_completo || 'Sin cliente'}</div>
                  </div>
                  <div className="text-sm font-semibold text-dorado">{formatearMoneda(pedido.total)}</div>
                </div>
                <div className="mt-3 text-sm text-claro/70">Estado: {pedido.estado}</div>
                <div className="mt-2 text-sm text-claro/70">Pago: {describirPago(pedido)}</div>
                <div className="mt-3 grid gap-2 text-sm text-claro/70">
                  {(pedido.detalles || []).map((detalle) => (
                    <div key={detalle.id} className="flex justify-between gap-3">
                      <span>{detalle.producto?.nombre || 'Producto'} x {detalle.cantidad}</span>
                      <span>{formatearMoneda(Number(detalle.precio_unitario) * detalle.cantidad)}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <div className="rounded-2xl border border-grisOscuro bg-grisOscuro/40 p-5">
          <div className="flex items-center justify-between gap-3">
            <div className="text-sm font-semibold text-claro/80">Top productos (más vendidos)</div>
            <div className="text-xs text-claro/50">{cargandoTop ? 'Cargando...' : ''}</div>
          </div>
          <div className="mt-4 grid gap-3">
            {productosTop.length === 0 ? (
              <div className="text-sm text-claro/60">Sin datos disponibles.</div>
            ) : (
              productosTop.map((fila) => (
                <div key={fila.producto_id} className="rounded-2xl border border-grisOscuro bg-oscuro/40 p-4">
                  <div className="flex items-center justify-between gap-3">
                    <div className="min-w-0">
                      <div className="font-semibold text-claro/90 truncate">{fila.producto?.nombre || `Producto #${fila.producto_id}`}</div>
                      <div className="mt-1 text-xs text-claro/50">{fila.producto?.sku || ''}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-semibold text-dorado">{fila.unidades} u</div>
                      <div className="mt-1 text-xs text-claro/60">{formatearMoneda(fila.ingresos || 0)}</div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="rounded-2xl border border-grisOscuro bg-grisOscuro/40 p-5">
          <div className="flex items-center justify-between gap-3">
            <div className="text-sm font-semibold text-claro/80">Clientes frecuentes</div>
            <div className="text-xs text-claro/50">{cargandoTop ? 'Cargando...' : ''}</div>
          </div>
          <div className="mt-4 grid gap-3">
            {clientesTop.length === 0 ? (
              <div className="text-sm text-claro/60">Sin datos disponibles.</div>
            ) : (
              clientesTop.map((fila) => (
                <div key={fila.cliente_id} className="rounded-2xl border border-grisOscuro bg-oscuro/40 p-4">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div className="min-w-0">
                      <div className="font-semibold text-claro/90 truncate">{fila.cliente?.nombre_completo || `Cliente #${fila.cliente_id}`}</div>
                      <div className="mt-1 text-xs text-claro/50">{fila.cliente?.email || ''}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-semibold text-dorado">{formatearMoneda(fila.total || 0)}</div>
                      <div className="mt-1 text-xs text-claro/60">{fila.pedidos} pedidos</div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

