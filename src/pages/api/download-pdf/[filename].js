// pages/api/download-pdf/[filename].js

import fs from 'fs';
import path from 'path';

const uploadDir = path.join(process.cwd(), '/public/uploads'); // Ruta donde se guardan los archivos

export default function handler(req, res) {
  const { filename } = req.query; // Obtener el nombre del archivo desde la URL

  const filePath = path.join(uploadDir, filename);

  // Verificar si el archivo existe
  if (fs.existsSync(filePath)) {
    // Configurar los encabezados para forzar la descarga
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=${filename}`);

    // Leer el archivo y enviarlo al cliente
    const fileStream = fs.createReadStream(filePath);
    fileStream.pipe(res);
  } else {
    res.status(404).json({ message: 'Archivo no encontrado' });
  }
}
