import connection from "@/libs/db";

export default async function handler(req, res) {
    const { id, search } = req.query; // Se añade `id` para la búsqueda por ID

    if (req.method === 'GET') {

        if (id) {
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
                    notas.createdAt
                FROM notas
                JOIN clientes ON notas.cliente_id = clientes.id 
                WHERE id = ?
                ORDER BY updatedAt DESC`, [id]);

                res.status(200).json(rows[0]); // Devolver el evento con los datos del cliente

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
        const { usuario_id, folio, cliente_id, nota } = req.body;

        try {
            const [result] = await connection.query(
                'INSERT INTO notas (usuario_id, folio, cliente_id, nota) VALUES (?, ?, ?, ?)',
                [usuario_id, folio, cliente_id, nota]
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
        // Maneja la solicitud DELETE
        const { id } = req.query;

        try {
            const [result] = await connection.query(
                'DELETE FROM notas WHERE id = ?',
                [id]
            );

            if (result.affectedRows > 0) {
                res.status(200).json({ message: 'Nota eliminada correctamente' });
            } else {
                res.status(404).json({ message: 'Nota no encontrada' });
            }
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    } else {
        res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE']);
        res.status(405).end(`Method ${method} Not Allowed`);
    }
}
