import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'
import { formatCurrency, formatDateIncDet, formatDateLong, getValueOrDefault } from '@/helpers'
import styles from './generarPDF.module.css'
import { getValueOrWhite } from '@/helpers/getValueOrWhite'

const loadFont = () => {
  const fontPath = '/public/fonts/Roboto/Roboto-Bold.ttf'
  return fetch(fontPath)
    .then(res => res.blob())
    .then(blob => new Promise((resolve) => {
      const reader = new FileReader()
      reader.onloadend = () => resolve(reader.result.split(',')[1]) 
      reader.readAsDataURL(blob)
    }))
}

export async function generarPDF(nota, datoPDF, conceptos, abonos, saldoRestante, totalAbonado, saldoAnterior, productoBase) {

  const isAbono = nota?.forma_pago === 'abonos'

  if (!nota) return

  const toggleIVA = JSON.parse(localStorage.getItem('ontoggleIVA') || 'false')
  const activeToggle = JSON.parse(localStorage.getItem("activeToggle") || "1");
  const activeToggleBan = JSON.parse(localStorage.getItem("activeToggleBan") || "1");
  const marginIMG = JSON.parse(localStorage.getItem("isSquare") || "true");
  
  const blanco = [255, 255, 255]
  const gris = [65, 65, 65]
  const blue = [1, 121, 202]
  const green = [151, 202, 53]
  const red = [233, 77, 51]
  const orange = [236, 97, 55]

  const fillColorBan = {
    1: blanco,
    2: gris
}

  const fillColor = {
    1: gris,
    2: blue,
    3: green,
    4: red,
    5: orange,
}

const color = fillColor[activeToggle] || gris


  const doc = new jsPDF({
    orientation: 'p',
    unit: 'mm',
    format: [182, 325],
  })

  async function loadFont(doc) {
    const fontUrl = "/fonts/Roboto/Roboto-Bold.ttf";
    
    const response = await fetch(fontUrl);
    const fontData = await response.arrayBuffer();
    const fontBase64 = btoa(
      new Uint8Array(fontData).reduce((data, byte) => data + String.fromCharCode(byte), '')
    );
  
    doc.addFileToVFS("Roboto-Bold.ttf", fontBase64);
    doc.addFont("Roboto-Bold.ttf", "Roboto", "normal");
  }

  await loadFont(doc)

  const colorRect = fillColorBan[activeToggleBan] || blanco;

  const topRectHeight = 45;
  doc.setFillColor(...colorRect);
  doc.rect(0, 0, 570, topRectHeight, 'F')
  const topRectWidth = doc.internal.pageSize.width

  const logoImg = getValueOrDefault(datoPDF?.logo)
  const logoImgDefault = 'img/logo.png'
  const logoWidthDefault = 32
  const logoHeightDefault = 32
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
    doc.addImage(logoImgDefault, 'PNG', xPosition, yPosition, logoWidthDefault, logoHeightDefault);
  }

  doc.setFont('Roboto')

  const marginRight = 6
  const font1 = 14
  const font2 = 12
  const font3 = 10
  const font4 = 8

  const textCliente = "Cliente:";
  const textWidthCliente = doc.getTextWidth(textCliente);
  const textHeight = font2 * 0.4;
  const padding = 1;
  const xCliente = 6;
  const yCliente = 68;

  doc.setFillColor(...color);
  doc.rect(xCliente - padding, yCliente - textHeight, textWidthCliente + 7 * padding, textHeight + 2 * padding, 'F');

  doc.setFontSize(font2);
  doc.setTextColor(255, 255, 255);
  doc.text(textCliente, xCliente, yCliente)

  doc.setFontSize(font2)
  doc.setTextColor(120, 120, 120)
  doc.text(`${getValueOrWhite(nota.cliente_nombre)}`, 6, 75)

  const textAtencion = "Contacto:";
  const textWidthAtencion = doc.getTextWidth(textAtencion);
  const textHeight2 = font2 * 0.4;
  const padding2 = 1;
  const xAtencion = 6;
  const yAtencion = 84;

  doc.setFillColor(...color);
  doc.rect(xAtencion - padding2, yAtencion - textHeight2, textWidthAtencion + 5 * padding2, textHeight2 + 2 * padding2, 'F');

  doc.setFontSize(font2);
  doc.setTextColor(255, 255, 255);
  doc.text(textAtencion, xAtencion, yAtencion)

  doc.setFontSize(font2)
  doc.setTextColor(120, 120, 120)
  doc.text(`${getValueOrWhite(nota.cliente_contacto)}`, 6, 91)

  doc.setFontSize(font1)
  const colorText1 = activeToggleBan === 1 ? gris : blanco
  doc.setTextColor(...colorText1)
  doc.text('NOTA DE VENTA', doc.internal.pageSize.width - 7.2 - doc.getTextWidth('NOTA DE VENTA'), 25)
  doc.setFontSize(font2)
  doc.setTextColor(0, 0, 0)
  doc.setFontSize(font2)
  const colorText2 = activeToggleBan === 1 ?  gris : [190,190,190]
  doc.setTextColor(...colorText2)
  doc.text(`${getValueOrDefault(nota.folio)}`, doc.internal.pageSize.width - marginRight - doc.getTextWidth(`${getValueOrDefault(nota.folio)}`), 32)
  doc.text(
    `${formatDateLong(getValueOrDefault(nota.createdAt))}`,
    doc.internal.pageSize.width - 6 - doc.getTextWidth(`${formatDateLong(getValueOrDefault(nota.createdAt))}`),
    38
  )

  const text = `${datoPDF?.fila1 ? datoPDF.fila1 + ' - ' : ''}${getValueOrWhite(datoPDF?.fila2)} ${getValueOrWhite(datoPDF?.fila3)} ${getValueOrWhite(datoPDF?.fila4)} ${datoPDF?.fila5 ? datoPDF.fila5 + ' - ' : ''}${getValueOrWhite(datoPDF?.fila7)}`.trim()

doc.setFontSize(font3)
doc.setTextColor(100, 100, 100)

const textWidth = doc.getTextWidth(text);

const xCenter = (pageWidth - textWidth) / 2;

doc.text(text, xCenter, 55)

  autoTable(doc, {
        startY: 98,
        head: [
          isAbono
            ? [
                { content: 'Tipo', styles: { halign: 'center' } },
                { content: 'Metodo pago', styles: { halign: 'center' } },
                { content: 'Fecha pago', styles: { halign: 'center' } },
                { content: 'Monto', styles: { halign: 'right' } }
              ]
            : [
                { content: 'Tipo', styles: { halign: 'center' } },
                { content: 'Concepto', styles: { halign: 'left' } },
                { content: 'Precio', styles: { halign: 'right' } },
                { content: 'Qty', styles: { halign: 'center' } },
                { content: 'Total', styles: { halign: 'right' } }
              ]
        ],
        body: isAbono
          ? abonos
          .filter(abono => abono.producto_base !== 1)
          .map(abono => [
            { content: `${getValueOrDefault(abono.tipo)}`, styles: { halign: 'center' } },
            { content: `${getValueOrDefault(abono.metodo_pago)}`, styles: { halign: 'center' } },
            { content: `${getValueOrDefault(formatDateIncDet(abono.fecha_pago))}`, styles: { halign: 'center' } },
            { content: `${getValueOrDefault(formatCurrency(abono.monto))}`, styles: { halign: 'right' } }
          ])
        
          : conceptos.map(concepto => [
              { content: `${getValueOrDefault(concepto.tipo)}`, styles: { halign: 'center' } },
              { content: `${getValueOrDefault(concepto.concepto)}`, styles: { halign: 'left' } },
              { content: `${getValueOrDefault(formatCurrency(concepto.precio))}`, styles: { halign: 'right' } },
              { content: `${getValueOrDefault(concepto.cantidad)}`, styles: { halign: 'center' } },
              { content: `${getValueOrDefault(formatCurrency(concepto.precio * concepto.cantidad))}`, styles: { halign: 'right' } }
            ]),
        styles: {
          cellPadding: 1.5,
          cellWidth: 'auto',
        },
        headStyles: {
          fillColor: gris,
          fontSize: font3,
          fontStyle: 'bold',
          textColor: [255, 255, 255]
        },
        bodyStyles: { fontSize: font3 },
        columnStyles: isAbono
    ? {
        0: { cellWidth: 20 },
        1: { cellWidth: 'auto' },
        2: { cellWidth: 'auto' },
        3: { cellWidth: 25 },
      }
    : {
        0: { cellWidth: 20 },
        1: { cellWidth: 'auto' },
        2: { cellWidth: 'auto' },
        3: { cellWidth: 15 },
        4: { cellWidth: 'auto' },
      },
  
        
        margin: { top: 0, left: 6, bottom: 0, right: 6 },
      })

      /* const calcularTotales = () => {
        const subtotal = conceptos.reduce((acc, curr) => acc + curr.cantidad * curr.precio, 0)
        const iva = subtotal * (ivaValue / 100)
        const total = toggleIVA ? subtotal + iva : subtotal
        return { subtotal, iva, total }
      }
      
      const { subtotal, iva, total } = calcularTotales()  */  

      const calcularTotales = () => {
        const total = conceptos.reduce((acc, curr) => acc + curr.cantidad * curr.precio, 0)
        return { total }
      }
  
      const { subtotal, iva, total } = calcularTotales();
  
      const verticalData = (() => {
        if (isAbono) {
          const rows = [];
  
          // Mostrar Saldo anterior
          rows.push(['Saldo anterior:', `${formatCurrency(saldoAnterior)}`]);
          rows.push(['Total abonado:', `${formatCurrency(totalAbonado)}`]);
  
          // Mostrar Saldo restante o "PAGADO"
          if (saldoRestante <= 0) {
            rows.push(['PAGADO', '$0.00']);
          } else {
            rows.push(['Saldo restante:', `${formatCurrency(saldoRestante)}`]);
          }
  
          return rows;
        }
  
        // Si no es abono, mostrar Subtotal + IVA (si toggleIVA) y Total
        const rows = [];
  
        if (toggleIVA) {
          rows.push(['Subtotal:', `${formatCurrency(subtotal)}`]);
          rows.push(['IVA:', `${formatCurrency(iva)}`]);
        }
  
        rows.push(['Total:', `${formatCurrency(total)}`]);
  
        return rows;
      })()
  
      const pWidth = doc.internal.pageSize.getWidth()
      const mRight = isAbono ? 15 : 10
      const tableWidth = 44
      const marginLeft = pWidth - mRight - tableWidth
  
      autoTable(doc, {
        startY: 275,
        margin: { left: marginLeft, bottom: 0, right: marginRight },
        body: verticalData,
        styles: {
          cellPadding: 2,
          valign: 'middle',
          fontSize: font3,
          textColor: [255, 255, 255]
        },
        columnStyles: {
          0: {
            cellWidth: isAbono ? 29 : 24, fontStyle: 'bold', halign: 'right',
            fillColor: {
              1: gris,
              2: blue,
              3: green,
              4: red,
              5: orange,
            }[activeToggle] || gris
          },
          1: { cellWidth: 24, halign: 'right', textColor: [0, 0, 0], fillColor: [240, 240, 240] }
        }
      })

  doc.setFontSize(`${font3}`)
  doc.setTextColor(0, 0, 0)
  doc.text('• Precio en pesos.', 6, 279)
  doc.text('• Este documento no es un comprobante fiscal válido.', 6, 284)
  doc.text('• Para efectos fiscales, se requiere una factura electrónica.', 6, 289)

  const pageHeight = doc.internal.pageSize.getHeight(); // Altura de la página
  const footerHeight = 20; // Altura del rectángulo del footer

  doc.setFillColor(...colorRect);
  doc.rect(0, pageHeight - footerHeight, pageWidth, footerHeight, 'F');

  // Obtener el texto
  const footerText = getValueOrWhite(
    isAbono
      ? `Producto: ${productoBase?.producto_nombre} | Precio: ${formatCurrency(productoBase?.monto)}`
      : datoPDF?.fila1
  )

  const textWidthFooter = doc.getTextWidth(footerText);
  const xFooter = (pageWidth - textWidthFooter) / 2
  const yFooter = pageHeight - (footerHeight / 2) + 3

  doc.setFontSize(font2)
  const colorTextFooter = activeToggleBan === 1 ?  gris : [190,190,190]
  doc.setTextColor(...colorTextFooter)
  doc.text(footerText, xFooter, yFooter)

  const pdfBlob = doc.output('blob');
  const formData = new FormData();
  formData.append('file', pdfBlob, `nota_${nota.folio}.pdf`);

  try {
    const res = await fetch('/api/upload-pdf/upload-pdf', {
      method: 'POST',
      body: formData,
    });

    if (!res.ok) {
      const errorText = await res.text();
      console.error('Error al subir el archivo:', errorText);
      throw new Error('Error en la carga del archivo');
    }

    const { fileUrl } = await res.json();

  } catch (error) {
    console.error('Error subiendo el archivo:', error);
  }
}


