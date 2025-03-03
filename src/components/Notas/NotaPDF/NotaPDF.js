import { BiSolidFilePdf } from 'react-icons/bi'
import jsPDF from 'jspdf'
import 'jspdf-autotable'
import QRCode from 'qrcode'
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

    const doc = new jsPDF(
      {
        orientation: 'p',
        unit: 'mm',
        format: 'a5'
      }
    )

    const logoImg = getValueOrDefault(datoPDF?.logo)
    const logoImgDefault = 'img/logo.png'
    const logoWidth = marginIMG ? 32 : 74
    const logoHeight = 32
    const marginLeftLogo = 6

    const pageWidth = doc.internal.pageSize.getWidth()

    const xPosition = marginLeftLogo

    if (logoImg && logoImg.startsWith('/api/')) {
      // Validamos si la URL de la imagen es válida (por ejemplo, comienza con 'http')
      try {
        // Intentamos agregar la imagen al PDF
        doc.addImage(logoImg, 'PNG', xPosition, 6, logoWidth, logoHeight)
      } catch (error) {
        console.error('Error al agregar la imagen:', error)
        doc.addImage(logoImgDefault, 'PNG', xPosition, 6, logoWidth, logoHeight)
      }
    } else {
      doc.addImage(logoImgDefault, 'PNG', xPosition, 6, logoWidth, logoHeight)
    }

    doc.setFont('helvetica')

    const marginRight = 6
    const font1 = 10
    const font2 = 9
    const font3 = 8

    doc.setFontSize(font2)
    doc.setTextColor(0, 0, 0)
    doc.text(getValueOrWhite(datoPDF?.fila1), doc.internal.pageSize.width - 6 - doc.getTextWidth(getValueOrWhite(datoPDF?.fila1)), 10)
    doc.setTextColor(120, 120, 120)
    doc.text(getValueOrWhite(datoPDF?.fila2), doc.internal.pageSize.width - 6 - doc.getTextWidth(getValueOrWhite(datoPDF?.fila2)), 14)
    doc.text(getValueOrWhite(datoPDF?.fila3), doc.internal.pageSize.width - 6 - doc.getTextWidth(getValueOrWhite(datoPDF?.fila3)), 18)
    doc.text(getValueOrWhite(datoPDF?.fila4), doc.internal.pageSize.width - 6 - doc.getTextWidth(getValueOrWhite(datoPDF?.fila4)), 22)
    doc.text(getValueOrWhite(datoPDF?.fila5), doc.internal.pageSize.width - 6 - doc.getTextWidth(getValueOrWhite(datoPDF?.fila5)), 26)
    doc.text(getValueOrWhite(datoPDF?.fila7), doc.internal.pageSize.width - 6 - doc.getTextWidth(getValueOrWhite(datoPDF?.fila7)), 30)

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
    doc.setFont("helvetica", "bold")
    doc.setTextColor(0, 0, 0)
    doc.text('NOTA DE VENTA', doc.internal.pageSize.width - 7.2 - doc.getTextWidth('NOTA DE VENTA'), 38)
    doc.setFontSize(font2)
    doc.setFont("helvetica", "normal")
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
        fontSize: `${font3}`,
        fontStyle: 'bold',
        textColor: [255, 255, 255]
      },
      bodyStyles: { fontSize: `${font3}` },
      columnStyles: {
        0: { cellWidth: 14 },
        1: { cellWidth: 70 },
        2: { cellWidth: 20 },
        3: { cellWidth: 12 },
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

    const top = 210
    const boxWidth = 130
    const boxHeight = 30

    doc.setDrawColor(255, 255, 255)
    doc.rect(marginRight, top, boxWidth, boxHeight, 'F')

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
      startY: 185,
      margin: { left: marginLeft, bottom: 0, right: marginRight },
      body: verticalData,
      styles: {
        cellPadding: 1,
        valign: 'middle',
        fontSize: font3,
        textColor: [255, 255, 255 ]
      },
      columnStyles: {
        0: { cellWidth: 20, fontStyle: 'bold', halign: 'right', 
          fillColor : {
            1: [100, 100, 100], 
            2: [1, 121, 202],   
            3: [151, 202, 53],   
            4: [233, 77, 51],   
          }[activeToggle] || [100, 100, 100]},
        1: { cellWidth: 24, halign: 'right',  textColor: [0, 0, 0 ], fillColor: [240, 240, 240] }
      }
    })


    doc.setFontSize(`${font3}`)
    doc.setTextColor(0, 0, 0)
    doc.text('• Precio en pesos.', 32.5, 187)
    doc.text('• Este documento no es un comprobante', 32.5, 191)
    doc.text('  fiscal válido.', 32.5, 194)
    doc.text('• Para efectos fiscales, se requiere', 32.5, 198)
    doc.text('  una factura electrónica.', 32.5, 201)

    const addFooterText = () => {
      const text = getValueOrWhite(datoPDF?.web)
      const textWidth = doc.getTextWidth(text)
      const x = (pageWidth - textWidth) / 2
      const y = doc.internal.pageSize.height - 3 // Posición a 10 mm del borde inferior
      doc.setFontSize(8)
      doc.setTextColor(120, 120, 120)
      doc.text(text, x, y)
    }

    addFooterText()

    const pdfUrl = `https://clicknetcontrol.com:8083/api/download-pdf/nota_${nota.folio}.pdf`  // Asegúrate de que esta URL sea válida
  const fileQRCode = await QRCode.toDataURL(pdfUrl);
  doc.addImage(fileQRCode, 'PNG', 2.5, 180, 30, 30);  // Coloca el QR en la misma posición y tamaño

  // Crear el archivo PDF
  const pdfBlob = doc.output('blob');
  const formData = new FormData();
  formData.append('file', pdfBlob, `nota_${nota.folio}.pdf`);

  try {
    // Hacer la solicitud POST para subir el archivo
    const res = await fetch('/api/upload-pdf/upload-pdf', {
      method: 'POST',
      body: formData,
    });

    // Verificar si la respuesta fue exitosa
    if (!res.ok) {
      const errorText = await res.text();
      console.error('Error al subir el archivo:', errorText);
      throw new Error('Error en la carga del archivo');
    }

    // Si la respuesta es exitosa, obtener la URL del archivo
    const { fileUrl } = await res.json();

    // Ya con la URL del archivo, puedes seguir procesando el documento
    // Aquí ya no es necesario agregar otro QR ya que ya se añadió uno antes

    // Guardar el PDF localmente para descarga inmediata
    doc.save(`nota_${nota.folio}.pdf`);

  } catch (error) {
    console.error('Error subiendo el archivo:', error);
  }
}

    //doc.save(`nota_de_venta_${nota.folio}.pdf`)
  

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
