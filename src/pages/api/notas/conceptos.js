import connection from "@/libs/db";

export default async function handler(req, res) {
    if (req.method === 'POST') {
        const { usuario_id, nota_id, tipo, concepto, precio, cantidad, total } = req.body

        try {
            const [result] = await connection.query(
                'INSERT INTO conceptosnot (usuario_id, nota_id, tipo, concepto, precio, cantidad, total ) VALUES (?, ?, ?, ?, ?, ?, ?)',
                [usuario_id, nota_id, tipo, concepto, precio, cantidad, total ]
            );
            res.status(201).json({ id: result.insertId });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: error.message });
        }
    } else if (req.method === 'GET') {
        const { nota_id, usuario_id } = req.query // Ahora se incluye usuario_id

        try {
            let query = 'SELECT * FROM conceptosnot';
            let params = [];

            if (nota_id) {
                query += ' WHERE nota_id = ?';
                params.push(nota_id);
            }

            if (usuario_id) { // Si se pasa usuario_id, agregarlo a la consulta
                if (params.length > 0) {
                    query += ' AND usuario_id = ?'; // Si ya hay otros filtros, usamos AND
                } else {
                    query += ' WHERE usuario_id = ?'; // Si no hay filtros previos, usamos WHERE
                }
                params.push(usuario_id);
            }

            const [rows] = await connection.query(query, params);
            res.status(200).json(rows);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    } else if (req.method === 'DELETE') {
        const { concepto_id } = req.query

        try {
            const [result] = await connection.query('DELETE FROM conceptosnot WHERE id = ?', [concepto_id]);
            if (result.affectedRows === 0) {
                return res.status(404).json({ error: 'Concepto no encontrado' });
            }
            res.status(200).json({ message: 'Concepto eliminado exitosamente' });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    } else if (req.method === 'PUT') {
        const { id } = req.query
        const { tipo, concepto, precio, cantidad, total } = req.body

        try {
            const [result] = await connection.query(
                'UPDATE conceptosnot SET tipo = ?, concepto = ?, precio = ?, cantidad = ?, total = ? WHERE id = ?',
                [tipo, concepto, precio, cantidad, total, id]
            );
            if (result.affectedRows === 0) {
                return res.status(404).json({ error: 'Concepto no encontrado' });
            }
            res.status(200).json({ message: 'Concepto actualizado exitosamente' });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    } else {
        res.setHeader('Allow', ['GET', 'POST', 'DELETE', 'PUT']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}
