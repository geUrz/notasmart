import connection from "@/libs/db"
import authMiddleware from "@/middleware/authMiddleware";

export async function handler(req, res) {

    const user = req.user
    if (!user) return

    const { id, search } = req.query;
    const isAdmin = user?.nivel === 'admin'

    if (req.method === 'GET') {

        if (id) {
            try {
                const [rows] = await connection.query(`
                    SELECT 
                        id, 
                        folio, 
                        negocio, 
                        cel, 
                        direccion, 
                        email,
                        plan,
                        folios    
                    FROM negocios
                    WHERE id = ?
                `, [id])

                if (rows.length === 0) {
                    return res.status(404).json({ error: 'Negocio no encontrado' })
                }

                res.status(200).json(rows[0])
            } catch (error) {
                res.status(500).json({ error: error.message })
            }

        }

        if (search) {

            if (!isAdmin) {
                return res.status(403).json({ error: 'No tienes permiso para accesar.' });
            }

            const searchQuery = `%${search.toLowerCase()}%`;
            try {
                const [rows] = await connection.query(`
                        SELECT
                            id, 
                            folio, 
                            negocio, 
                            cel, 
                            direccion, 
                            email,
                            plan,
                            folios  
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
                            LOWER(plan) LIKE ? 
                        OR 
                            LOWER(createdAt) LIKE ?
                        ORDER BY updatedAt DESC`, [searchQuery, searchQuery, searchQuery, searchQuery, searchQuery, searchQuery, searchQuery]);

                res.status(200).json(rows);

            } catch (error) {
                res.status(500).json({ error: 'Error al realizar la búsqueda' });
            }
            return;

        } else {

            if (!isAdmin) {
                return res.status(403).json({ error: 'No tienes permiso para accesar.' });
            }

            try {
                const [rows] = await connection.query(`
                        SELECT 
                            id, 
                            folio, 
                            negocio, 
                            cel, 
                            direccion, 
                            email,
                            plan,
                            folios    
                        FROM negocios
                        ORDER BY updatedAt DESC`);
                res.status(200).json(rows)
            } catch (error) {
                res.status(500).json({ error: error.message })
            }

        }

    } else if (req.method === 'POST') {
        try {
            const { folio, negocio, cel, direccion, email, plan, folios } = req.body
            if (!negocio) {
                return res.status(400).json({ error: 'Todos los datos son obligatorios' })
            }

            const [result] = await connection.query('INSERT INTO negocios (folio, negocio, cel, direccion, email, plan, folios) VALUES (?, ?, ?, ?, ?, ?, ?)', [folio, negocio, cel, direccion, email, plan, folios])
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

        const { negocio, cel, direccion, email, plan, folios } = req.body

        if (!negocio) {
            return res.status(400).json({ error: 'Todos los datos son obligatorios' })
        }

        try {
            const [result] = await connection.query('UPDATE negocios SET negocio = ?, cel = ?, direccion = ?, email = ?, plan = ?, folios = ? WHERE id = ?', [negocio, cel, direccion, email, plan, folios, id])

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

export default authMiddleware(handler)