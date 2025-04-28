import connection from "@/libs/db"

export default async function handler(req, res) {
    const { usuario_id, search } = req.query;

    if (req.method === 'GET') {
        if (usuario_id) {
            // Obtener un negocio por ID
            try {
                const [rows] = await connection.query(`
                    SELECT 
                        id, 
                        folio, 
                        negocio, 
                        cel, 
                        direccion, 
                        email 
                    FROM negocios 
                    WHERE usuario_id = ?
                    ORDER BY updatedAt DESC`, [usuario_id])

                if (rows.length === 0) {
                    /* return res.status(404).json({ error: 'Negocio no encontrado' }); */
                }

                res.status(200).json(rows)
            } catch (error) {
                res.status(500).json({ error: error.message })
            }

            return
        }

            if (search) {
                const searchQuery = `%${search.toLowerCase()}%`;
                try {
                    const [rows] = await connection.query(`
                        SELECT
                            id, 
                            folio, 
                            negocio, 
                            cel, 
                            direccion, 
                            email 
                        FROM negocios
                        WHERE 
                            LOWER(folio) LIKE ? 
                        OR 
                            LOWER(negocio) LIKE ?
                        OR 
                            LOWER(cel) LIKE ?
                        OR 
                            LOWER(direccion) LIKE ?
                        OR 
                            LOWER(email) LIKE ?  
                        OR 
                            LOWER(createdAt) LIKE ?
                        ORDER BY updatedAt DESC`, [searchQuery, searchQuery, searchQuery, searchQuery, searchQuery, searchQuery]);
    
                    res.status(200).json(rows); 
    
                } catch (error) {
                    res.status(500).json({ error: 'Error al realizar la búsqueda' });
                }
                return;
            }

            // Obtener todos los negocios
            try {
                const [rows] = await connection.query(`
                    SELECT 
                        id, 
                        folio, 
                        negocio, 
                        cel, 
                        direccion, 
                        email  
                    FROM negocios
                    ORDER BY updatedAt DESC`);
                res.status(200).json(rows)
            } catch (error) {
                res.status(500).json({ error: error.message })
            }
        
    } else if (req.method === 'POST') {
        try {
            const { folio, negocio, cel, direccion, email } = req.body
            if (!negocio) {
                return res.status(400).json({ error: 'Todos los datos son obligatorios' })
            }

            const [result] = await connection.query('INSERT INTO negocios (folio, negocio, cel, direccion, email) VALUES (?, ?, ?, ?, ?)', [folio, negocio, cel, direccion, email])
            const newClient = { id: result.insertId }
            res.status(201).json(newClient)
        } catch (error) {
            res.status(500).json({ error: error.message })
        }
    } else if (req.method === 'PUT') {

        const { id } = req.query;

        if (!id) {
            return res.status(400).json({ error: 'ID del negocio es obligatorio' })
        }

        const { folio, negocio, cel, direccion, email } = req.body

        if (!negocio) {
            return res.status(400).json({ error: 'Todos los datos son obligatorios' })
        }

        try {
            const [result] = await connection.query('UPDATE negocios SET folio = ?, negocio = ?, cel = ?, direccion = ?, email = ? WHERE id = ?', [folio, negocio, cel, direccion, email, id])

            if (result.affectedRows === 0) {
                return res.status(404).json({ error: 'Negocio no encontrado' })
            }

            res.status(200).json({ message: 'Negocio actualizado correctamente' })
        } catch (error) {
            res.status(500).json({ error: error.message })
        }
    } else if (req.method === 'DELETE') {

        const { id } = req.query;


        if (!id) {
            return res.status(400).json({ error: 'ID del negocio es obligatorio' })
        }

        try {

            const [result] = await connection.query('DELETE FROM negocios WHERE id = ?', [id])

            if (result.affectedRows === 0) {
                return res.status(404).json({ error: 'Negocio no encontrado' })
            }

            res.status(200).json({ message: 'Negocio eliminado correctamente' })
        } catch (error) {
            res.status(500).json({ error: error.message })
        }
    } else {
        res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE'])
        res.status(405).end(`Method ${req.method} Not Allowed`)
    }
}
