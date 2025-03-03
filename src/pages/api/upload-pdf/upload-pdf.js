// pages/api/upload-pdf/upload-pdf.js

import { IncomingForm } from 'formidable';
import fs from 'fs';
import path from 'path';

// Habilitar Next.js para manejar formularios con formidable
export const config = {
  api: {
    bodyParser: false, // Importante, ya que `formidable` maneja la carga del cuerpo
  },
};

export default function handler(req, res) {
  const form = new IncomingForm();

  form.uploadDir = path.join(process.cwd(), '/public/uploads'); // Asegúrate de que esta carpeta exista
  form.keepExtensions = true; // Mantener la extensión original
  form.parse(req, (err, fields, files) => {
    if (err) {
      res.status(500).json({ message: 'Error al procesar el archivo', error: err.message });
      return;
    }

    // Aquí, `files` es el objeto que contiene el archivo cargado
    const uploadedFile = files.file[0]; // Asumiendo que el archivo se envía con el nombre 'file'

    // Obtener el nombre original del archivo
    const originalFileName = uploadedFile.originalFilename;

    // Ruta completa donde guardaremos el archivo
    const filePath = path.join(form.uploadDir, originalFileName);

    // Renombrar el archivo para que tenga la extensión correcta
    fs.rename(uploadedFile.filepath, filePath, (err) => {
      if (err) {
        res.status(500).json({ message: 'Error al guardar el archivo', error: err.message });
        return;
      }

      // Devolver la URL del archivo
      res.status(200).json({ fileUrl: `/api/download-pdf/${originalFileName}` });
    });
  });
}
