import { BiSolidFilePdf } from 'react-icons/bi'
import jsPDF from 'jspdf'
import 'jspdf-autotable'
import { formatCurrency, formatDateLong, getValueOrDefault } from '@/helpers'
import styles from './generarPDF.module.css'
import { getValueOrWhite } from '@/helpers/getValueOrWhite'

const loadFont = () => {
  const fontPath = '/public/fonts/Roboto/Roboto-Bold.ttf'
  return fetch(fontPath)
    .then(res => res.blob())
    .then(blob => new Promise((resolve) => {
      const reader = new FileReader()
      reader.onloadend = () => resolve(reader.result.split(',')[1]) // Extraer Base64
      reader.readAsDataURL(blob)
    }))
}

export async function generarPDF(nota, datoPDF, conceptos) {
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
  const orange = [243, 115, 53]

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

const color = fillColor[activeToggle] || gris;


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
  doc.text(`${getValueOrDefault(nota.cliente_cliente)}`, 6, 75)

  const textAtencion = "Atención a:";
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
  doc.text(`${getValueOrDefault(nota.cliente_contacto)}`, 6, 91)

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

  const text = `${getValueOrWhite(datoPDF?.fila1)} - ${getValueOrWhite(datoPDF?.fila2)} ${getValueOrWhite(datoPDF?.fila3)} ${getValueOrWhite(datoPDF?.fila4)} ${getValueOrWhite(datoPDF?.fila5)} - Tel. ${getValueOrWhite(datoPDF?.fila7)}`.trim();

doc.setFontSize(font3)
doc.setTextColor(100, 100, 100)

const textWidth = doc.getTextWidth(text);

const xCenter = (pageWidth - textWidth) / 2;

doc.text(text, xCenter, 55)

  doc.autoTable({
    startY: 98,
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
      fillColor: gris,
      fontSize: font3,
      fontStyle: 'bold',
      textColor: [255, 255, 255]
    },
    bodyStyles: { fontSize: `${font3}` },
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
    startY: 260,
    margin: { left: marginLeft, bottom: 0, right: marginRight },
    body: verticalData,
    styles: {
      cellPadding: 1,
      valign: 'middle',
      fontSize: font3,
      textColor: [255, 255, 255]
    },
    columnStyles: {
      0: {
        cellWidth: 20, fontStyle: 'bold', halign: 'right',
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
  //doc.setFont("Roboto", "normal")
  doc.setTextColor(0, 0, 0)
  doc.text('• Precio en pesos.', 6, 264)
  doc.text('• Este documento no es un comprobante fiscal válido.', 6, 269)
  doc.text('• Para efectos fiscales, se requiere una factura electrónica.', 6, 274)

  const pageHeight = doc.internal.pageSize.getHeight(); // Altura de la página
  const footerHeight = 20; // Altura del rectángulo del footer

  doc.setFillColor(...colorRect);
  doc.rect(0, pageHeight - footerHeight, pageWidth, footerHeight, 'F');

  // Obtener el texto
  const footerText = getValueOrDefault(datoPDF?.fila1);
  const textWidthFooter = doc.getTextWidth(footerText);
  const xFooter = (pageWidth - textWidthFooter) / 2
  const yFooter = pageHeight - (footerHeight / 2) + 3

  doc.setFontSize(font2)
  const colorTextFooter = activeToggleBan === 1 ?  gris : [190,190,190]
  doc.setTextColor(...colorTextFooter)
  doc.text(footerText, xFooter, yFooter)

  const addFooterText = () => {
    const text = getValueOrWhite(datoPDF?.web)
    const textWidthFooter = doc.getTextWidth(text)
    const x = (pageWidth - textWidthFooter) / 2
    const y = doc.internal.pageSize.height - 3
    doc.setFontSize(`${font2}`)
    doc.setTextColor(180, 180, 180)
    doc.text(text, x, y)
  }

  addFooterText()

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


