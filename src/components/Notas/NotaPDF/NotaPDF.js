import { BiSolidFilePdf } from 'react-icons/bi'
import jsPDF from 'jspdf'
import 'jspdf-autotable'
import QRCode from 'qrcode'
import { formatCurrency, formatDateIncDet, getValueOrDefault } from '@/helpers'
import styles from './NotaPDF.module.css'

export function NotaPDF(props) {

  const { nota, conceptos } = props

  const generarPDF = async () => {

    if (!nota) return

    const toggleIVA = JSON.parse(localStorage.getItem('ontoggleIVA') || 'true');

    const doc = new jsPDF(
      {
        orientation: 'p',
        unit: 'mm',
        format: 'a4'
      }
    )

    const logoImg = 'img/logo.png'
    const logoWidth = 58
    const logoHeight = 16
    const marginRightLogo = 12

    const pageWidth = doc.internal.pageSize.getWidth()

    const xPosition = pageWidth - logoWidth - marginRightLogo

    doc.addImage(logoImg, 'PNG', xPosition, 18, logoWidth, logoHeight)

    doc.setFont('helvetica')

    const marginRight = 12
    const font1 = 12
    const font2 = 10
    const font3 = 9

    doc.setFontSize(`${font2}`)
    doc.setTextColor(0, 0, 0)
    doc.text('#######', 15, 23)
    doc.setFontSize(`${font2}`)
    doc.setTextColor(120, 120, 120)
    doc.text('###################', 15, 27)
    doc.text('####################', 15, 31)
    doc.text('###################', 15, 35)
    doc.text('#########', 15, 39)
    doc.setFontSize(`${font3}`)
    doc.setTextColor(0, 0, 0)
    doc.text('############################', 15, 43)
    doc.setFontSize(`${font3}`)
    doc.setTextColor(120, 120, 120)
    doc.text('##############', 15, 47)

    doc.setFontSize(`${font2}`)
    doc.setTextColor(0, 0, 0)
    doc.text('Cliente', 15, 54)
    doc.setFontSize(`${font2}`)
    doc.setTextColor(120, 120, 120)
    doc.text(`${getValueOrDefault(nota.cliente_nombre)}`, 15, 58)
    doc.setFontSize(`${font2}`)
    doc.setTextColor(0, 0, 0)
    doc.text('Atención a', 15, 64)
    doc.setFontSize(`${font2}`)
    doc.setTextColor(120, 120, 120)
    doc.text(`${getValueOrDefault(nota.cliente_contacto)}`, 15, 68)

    doc.setFontSize(`${font1}`)
    doc.setFont("helvetica", "bold")
    doc.setTextColor(0, 0, 0)
    doc.text('RECIBO', doc.internal.pageSize.width - marginRight - doc.getTextWidth('RECIBO'), 44)
    doc.setFontSize(`${font2}`)
    doc.setFont("helvetica", "normal")
    doc.setTextColor(0, 0, 0)
    doc.text('Folio', doc.internal.pageSize.width - marginRight - doc.getTextWidth('Folio'), 50)
    doc.setFontSize(`${font2}`)
    doc.setTextColor(120, 120, 120)
    doc.text(`${getValueOrDefault(nota.folio)}`, doc.internal.pageSize.width - marginRight - doc.getTextWidth(`${getValueOrDefault(nota.folio)}`), 54)

    doc.setFontSize(`${font2}`)
    doc.setTextColor(0, 0, 0)
    doc.text('Fecha', doc.internal.pageSize.width - marginRight - doc.getTextWidth('Fecha'), 60)
    doc.setFontSize(`${font2}`)
    doc.setTextColor(120, 120, 120)
    doc.text(
      `${formatDateIncDet(getValueOrDefault(nota.createdAt))}`,
      doc.internal.pageSize.width - 12 - doc.getTextWidth(`${formatDateIncDet(getValueOrDefault(nota.createdAt))}`),
      64
    )

    doc.autoTable({
      startY: 75,
      head: [
        [
          { content: 'Tipo', styles: { halign: 'center' } },
          { content: 'Concepto', styles: { halign: 'left' } },
          { content: 'Precio', styles: { halign: 'right' } },
          { content: 'Qty', styles: { halign: 'center' } },
          { content: 'Total', styles: { halign: 'right' } },
        ]
      ],
      styles: {
        cellPadding: 1.5,
        cellWidth: 'auto',
      },
      body: conceptos.map(concepto => [
        { content: `${getValueOrDefault(concepto.tipo)}`, styles: { halign: 'center' } },
        { content: `${getValueOrDefault(concepto.concepto)}`, styles: { halign: 'left' } },
        { content: `$${getValueOrDefault(formatCurrency(concepto.precio))}`, styles: { halign: 'right' } },
        { content: `${getValueOrDefault(concepto.cantidad)}`, styles: { halign: 'center' } },
        { content: `$${getValueOrDefault(formatCurrency(concepto.precio * concepto.cantidad))}`, styles: { halign: 'right' } },
      ]),
      headStyles: {
        fillColor: [255, 255, 255],
        fontSize: `${font3}`,
        fontStyle: 'bold',
        textColor: [0, 0, 0],
        lineWidth: { bottom: 1 },
        lineColor: [80, 100, 255] 
      },
      bodyStyles: { fontSize: `${font3}` },
      columnStyles: {
        0: { cellWidth: 20 },
        1: { cellWidth: 95 },
        2: { cellWidth: 25 },
        3: { cellWidth: 18 },
        4: { cellWidth: 25 },

        cellPadding: 1.5,
        valign: 'middle'
      },

      margin: { top: 0, left: 15, bottom: 0, right: 12 },

    })

    const calcularTotales = () => {
      const subtotal = conceptos.reduce((acc, curr) => acc + curr.cantidad * curr.precio, 0)
      const iva = subtotal * 0.16
      const total = toggleIVA ? subtotal + iva : subtotal
      return { subtotal, iva, total };
    };

    const { subtotal, iva, total } = calcularTotales()

    const top = 230
    const boxWidth = 130
    const boxHeight = 30

    doc.setDrawColor(255, 255, 255)
    doc.rect(marginRight, top, boxWidth, boxHeight)

    doc.setFontSize(`${font2}`)
    doc.setTextColor(0, 0, 0);
    doc.text('Nota:', marginRight, top - 1)

    doc.setFontSize(`${font3}`)
    doc.setTextColor(80, 80, 80)
    const content = nota.nota === undefined || nota.nota === null ? (
      ''
    ) : (
      `${nota.nota}`
    )


    const textX = marginRight
    const textY = top + 4
    const txtWidth = boxWidth - 4

    doc.text(content, textX, textY, { maxWidth: txtWidth })

    const verticalData = [
      ...toggleIVA ? [
        ['Subtotal:', `$${formatCurrency(subtotal)}`],
        ['IVA:', `$${formatCurrency(iva)}`],
      ] : [],
      ['Total:', `$${formatCurrency(total)}`]
    ];

    const pWidth = doc.internal.pageSize.getWidth()
    const mRight = 12
    const tableWidth = 44
    const marginLeft = pWidth - mRight - tableWidth

    doc.autoTable({
      startY: 230,
      margin: { left: marginLeft, bottom: 0, right: marginRight },
      body: verticalData,
      styles: {
        cellPadding: 1,
        valign: 'middle',
        fontSize: `${font2}`,
      },
      columnStyles: {
        0: { cellWidth: 20, fontStyle: 'bold', halign: 'right' },
        1: { cellWidth: 24, halign: 'right' }
      }
    })


    doc.setFontSize(`${font3}`)
    doc.setTextColor(0, 0, 0)
    doc.text('• Precio en pesos.', 50, 260)
    doc.text('• Este documento no es un comprobante fiscal válido.', 50, 265)
    doc.text('• Para efectos fiscales, se requiere una factura electrónica.', 50, 270)

    const qrCodeText = 'https://www.facebook.com/clicknet.mx'
    const qrCodeDataUrl = await QRCode.toDataURL(qrCodeText)
    doc.addImage(qrCodeDataUrl, 'PNG', 10, 248, 40, 40)

    const addFooterText = () => {
      const text = 'www.clicknetmx.com'
      const textWidth = doc.getTextWidth(text)
      const x = (pageWidth - textWidth) / 2
      const y = doc.internal.pageSize.height - 5 // Posición a 10 mm del borde inferior
      doc.setFontSize(8)
      doc.setTextColor(120, 120, 120)
      doc.text(text, x, y)
    }

    addFooterText()

    doc.save(`recibo_${nota.folio}.pdf`)
  }

  return (

    <div className={styles.iconPDF}>
      <div onClick={generarPDF}>
        <BiSolidFilePdf />
      </div>
    </div>

  )
}
