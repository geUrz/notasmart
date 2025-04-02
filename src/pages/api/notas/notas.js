import connection from "@/libs/db";
import fs from 'fs';
import path from 'path';

export default async function handler(req, res) {
    const { id, usuario_id, search } = req.query; // Se añade `id` para la búsqueda por ID

    if (req.method === 'GET') {

        if (usuario_id) {
            try {
                const [rows] = await connection.query(`
                SELECT 
                    notas.id, 
                    notas.usuario_id, 
                    notas.folio, 
                    notas.cliente_id,  
                    clientes.cliente AS cliente_cliente, 
                    clientes.contacto AS cliente_contacto, 
                    notas.nota,
                    notas.iva,
                    notas.iva_total,
                    notas.createdAt
                FROM notas
                JOIN clientes ON notas.cliente_id = clientes.id 
                WHERE notas.usuario_id = ?
                ORDER BY notas.updatedAt DESC`, [usuario_id]);

                res.status(200).json(rows); // Devolver el evento con los datos del cliente

            } catch (error) {
                res.status(500).json({ error: error.message });
            }
            return;
        }

        if (search) {
            const searchQuery = `%${search.toLowerCase()}%`;
            try {
                const [rows] = await connection.query(`
                    SELECT
                        notas.id, 
                        notas.usuario_id, 
                        notas.folio, 
                        notas.cliente_id, 
                        clientes.cliente AS cliente_cliente,  
                        clientes.contacto AS cliente_contacto, 
                        notas.nota,
                        notas.iva,
                        notas.iva_total,
                        conceptosnot.concepto AS concepto,
                        notas.createdAt
                    FROM notas
                    JOIN clientes ON notas.cliente_id = clientes.id
                    LEFT JOIN conceptosnot ON notas.id = conceptosnot.nota_id
                    WHERE 
                        LOWER(notas.folio) LIKE ? 
                    OR 
                        LOWER(clientes.cliente) LIKE ?
                    OR 
                        LOWER(clientes.contacto) LIKE ?
                    OR 
                        LOWER(notas.nota) LIKE ?
                    OR 
                        LOWER(notas.createdAt) LIKE ?  
                    OR 
                        LOWER(conceptosnot.concepto) LIKE ?
                    ORDER BY notas.updatedAt DESC`, [searchQuery, searchQuery, searchQuery, searchQuery, searchQuery, searchQuery]);

                res.status(200).json(rows); // Devolver los notas encontrados por búsqueda

            } catch (error) {
                res.status(500).json({ error: 'Error al realizar la búsqueda' });
            }
            return;
        }

        try {
            const [rows] = await connection.query(`
                SELECT 
                  notas.id, 
                  notas.usuario_id, 
                  notas.folio, 
                  notas.cliente_id,  
                  clientes.cliente AS cliente_cliente, 
                  clientes.contacto AS cliente_contacto, 
                  notas.nota,
                  notas.iva,
                  notas.iva_total,
                  notas.createdAt
                FROM notas
                JOIN clientes ON notas.cliente_id = clientes.id
                ORDER BY notas.updatedAt DESC`);

            res.status(200).json(rows); // Devolver todos los notas con los datos de los clientes

        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    } else if (req.method === 'POST') {
        // Maneja la solicitud POST
        const { usuario_id, folio, cliente_id, nota, iva, iva_total } = req.body;

        try {
            const [result] = await connection.query(
                'INSERT INTO notas (usuario_id, folio, cliente_id, nota, iva, iva_total) VALUES (?, ?, ?, ?, ?, ?)',
                [usuario_id, folio, cliente_id, nota, iva, iva_total]
            );
            res.status(201).json({ id: result.insertId });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    } else if (req.method === 'PUT') {

        const { id } = req.query;
        const { nota, cliente_id } = req.body;

        if (!id) {
            return res.status(400).json({ error: 'ID del nota es obligatorio' });
        }

        if (nota) {
            try {
                const [result] = await connection.query(
                    'UPDATE notas SET cliente_id = ?, nota = ? WHERE id = ?',
                    [cliente_id, nota, id]
                );

                if (result.affectedRows === 0) {
                    return res.status(404).json({ error: 'Nota no encontrada' });
                }

                res.status(200).json({ message: 'Nota actualizada correctamente' });
            } catch (error) {
                res.status(500).json({ error: error.message });
            }
        } else {
            return res.status(400).json({ error: 'Datos insuficientes para actualizar la nota' });
        }

    } else if (req.method === 'DELETE') {
        
        const { id, folio } = req.query;

    if (!id || !folio) {
        return res.status(400).json({ error: 'ID y folio de la nota son obligatorios' });
    }

    try {
        // 1. Eliminar la nota de la base de datos
        const [result] = await connection.query(
            'DELETE FROM notas WHERE id = ?',
            [id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Nota no encontrada' });
        }

        // 2. Construir la ruta del archivo PDF
        const filePath = path.join(process.cwd(), 'public/uploads', `nota_${folio}.pdf`);

        // 3. Verificar si el archivo existe antes de eliminarlo
        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
            console.log(`Archivo eliminado: ${filePath}`);
        } else {
            console.log(`El archivo no existe: ${filePath}`);
        }

        res.status(200).json({ message: 'Nota y PDF eliminados correctamente' });

    } catch (error) {
        console.error("Error al eliminar la nota y su PDF:", error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }

    } else {
        res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE']);
        res.status(405).end(`Method ${method} Not Allowed`);
    }
}
