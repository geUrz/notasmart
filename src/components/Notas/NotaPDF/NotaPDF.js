import { BiSolidFilePdf } from 'react-icons/bi'
import jsPDF from 'jspdf'
import 'jspdf-autotable'
import { formatCurrency, formatDateIncDet, getValueOrDefault } from '@/helpers'
import styles from './NotaPDF.module.css'
import { getValueOrWhite } from '@/helpers/getValueOrWhite'

export function NotaPDF(props) {

  const { nota, datoPDF, conceptos } = props

  const generarPDF = async () => {

    if (!nota) return

    const toggleIVA = JSON.parse(localStorage.getItem('ontoggleIVA') || 'false')
    const activeToggle = JSON.parse(localStorage.getItem("activeToggle") || "1");
    const marginIMG = JSON.parse(localStorage.getItem("isSquare") || "true");

    const doc = new jsPDF({
      orientation: 'p',
      unit: 'mm', 
      format: [182, 325], 
    })

    const colorRect = {
      1: [0, 0, 0], 
      2: [0, 0, 0],   
    }[activeToggle] || [0, 0, 0]

    const topRectHeight = 35; 
    doc.setFillColor(...colorRect); 
    doc.rect(0, 0, 570, topRectHeight, 'F')
    const topRectWidth = doc.internal.pageSize.width

    const logoImg = getValueOrDefault(datoPDF?.logo)
    const logoImgDefault = 'img/logo.png'
    const logoWidth = marginIMG ? 32 : 74
    const logoHeight = 32
    const marginLeftLogo = 6

    const pageWidth = doc.internal.pageSize.getWidth()

    const yPosition = (topRectHeight - logoHeight) / 2

    const xPosition = marginLeftLogo

    if (logoImg && logoImg.startsWith('/api/')) {
      try {
        doc.addImage(logoImg, 'PNG', xPosition, yPosition, logoWidth, logoHeight);
      } catch (error) {
        console.error('Error al agregar la imagen:', error);
        doc.addImage(logoImgDefault, 'PNG', xPosition, yPosition, logoWidth, logoHeight);
      }
    } else {
      doc.addImage(logoImgDefault, 'PNG', xPosition, yPosition, logoWidth, logoHeight);
    }

    doc.setFont('Roboto')

    const marginRight = 6
    const font1 = 10
    const font2 = 9
    const font3 = 8

    doc.setFontSize(font2)
    doc.setTextColor(0, 0, 0)
    doc.text('Cliente', 6, 45)
    doc.setFontSize(font2)
    doc.setTextColor(120, 120, 120)
    doc.text(`${getValueOrDefault(nota.cliente_cliente)}`, 6, 49)
    doc.setFontSize(font2)
    doc.setTextColor(0, 0, 0)
    doc.text('Atención a', 6, 55)
    doc.setFontSize(font2)
    doc.setTextColor(120, 120, 120)
    doc.text(`${getValueOrDefault(nota.cliente_contacto)}`, 6, 59)

    doc.setFontSize(font1)
    doc.setFont("Roboto")
    doc.setTextColor(0, 0, 0)
    doc.text('NOTA DE VENTA', doc.internal.pageSize.width - 7.2 - doc.getTextWidth('NOTA DE VENTA'), 38)
    doc.setFontSize(font2)
    doc.setFont("Roboto")
    doc.setTextColor(0, 0, 0)
    doc.text('Folio', doc.internal.pageSize.width - 6 - doc.getTextWidth('Folio'), 45)
    doc.setFontSize(font2)
    doc.setTextColor(120, 120, 120)
    doc.text(`${getValueOrDefault(nota.folio)}`, doc.internal.pageSize.width - marginRight - doc.getTextWidth(`${getValueOrDefault(nota.folio)}`), 49)

    doc.setFontSize(font2)
    doc.setTextColor(0, 0, 0)
    doc.text('Fecha', doc.internal.pageSize.width - marginRight - doc.getTextWidth('Fecha'), 55)
    doc.setFontSize(font2)
    doc.setTextColor(120, 120, 120)
    doc.text(
      `${formatDateIncDet(getValueOrDefault(nota.createdAt))}`,
      doc.internal.pageSize.width - 6 - doc.getTextWidth(`${formatDateIncDet(getValueOrDefault(nota.createdAt))}`),
      59
    )

    doc.autoTable({
      startY: 65,
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
        fillColor : {
          1: [100, 100, 100], 
          2: [1, 121, 202],   
          3: [151, 202, 53],   
          4: [233, 77, 51],   
        }[activeToggle] || [100, 100, 100],
        fontSize: `${font2}`,
        fontStyle,
        textColor: [255, 255, 255]
      },
      bodyStyles: { fontSize: `${font2}` },
      columnStyles: {
        0: { cellWidth: 20 },
        1: { cellWidth: 95 },
        2: { cellWidth: 20 },
        3: { cellWidth: 15 },
        4: { cellWidth: 20 },

        cellPadding: 1.5,
        valign: 'middle'
      },

      margin: { top: 0, left: 6, bottom: 0, right: 6 },

    })

    const calcularTotales = () => {
      const subtotal = conceptos.reduce((acc, curr) => acc + curr.cantidad * curr.precio, 0)
      const iva = subtotal * 0.16
      const total = toggleIVA ? subtotal + iva : subtotal
      return { subtotal, iva, total };
    };

    const { subtotal, iva, total } = calcularTotales()

    const verticalData = [
      ...toggleIVA ? [
        ['Subtotal:', `$${formatCurrency(subtotal)}`],
        ['IVA:', `$${formatCurrency(iva)}`],
      ] : [],
      ['Total:', `$${formatCurrency(total)}`]
    ];

    const pWidth = doc.internal.pageSize.getWidth()
    const mRight = 6
    const tableWidth = 44
    const marginLeft = pWidth - mRight - tableWidth

    doc.autoTable({
      startY: 240,
      margin: { left: marginLeft, bottom: 0, right: marginRight },
      body: verticalData,
      styles: {
        cellPadding: 1,
        valign: 'middle',
        fontSize: font2,
        textColor: [255, 255, 255 ]
      },
      columnStyles: {
        0: { cellWidth: 20, fontStyle, halign: 'right', 
          fillColor : {
            1: [100, 100, 100], 
            2: [1, 121, 202],   
            3: [151, 202, 53],   
            4: [233, 77, 51],   
          }[activeToggle] || [100, 100, 100]},
        1: { cellWidth: 24, halign: 'right',  textColor: [0, 0, 0 ], fillColor: [240, 240, 240] }
      }
    })


    doc.setFontSize(`${font2}`)
    doc.setTextColor(0, 0, 0)
    doc.text('• Precio en pesos.', 6, 244)
    doc.text('• Este documento no es un comprobante fiscal válido.', 6, 248)
    doc.text('• Para efectos fiscales, se requiere una factura electrónica.', 6, 252)

  const addFooterText = () => {
    const text = getValueOrWhite(datoPDF?.web)
    const textWidth = doc.getTextWidth(text)
    const x = (pageWidth - textWidth) / 2
    const y = doc.internal.pageSize.height - 3
    doc.setFontSize(`${font2}`)
    doc.setTextColor(180, 180, 180)
    doc.text(text, x, y)
  }

  addFooterText()
  
  doc.save(`nota_de_venta_${nota.folio}.pdf`)

}

  

  return (

    <div className={styles.iconPDF}>
      <div onClick={generarPDF}>
        <div>
          <BiSolidFilePdf />
        </div>
      </div>
    </div>

  )
}
