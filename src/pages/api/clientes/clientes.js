import connection from "@/libs/db"
import authMiddleware from "@/middleware/authMiddleware"

export async function handler(req, res) {

    const user = req.user
    if (!user) return

    const { id, negocio_id, search } = req.query;
    const isAdmin = user?.nivel === 'admin'
    const negocioSolicitado = parseInt(negocio_id)
    const negocioId = user?.negocio_id;

    if (req.method === 'GET') {

        if (id) {

            try {
                const [rows] = await connection.query(`
                    SELECT 
                        c.id, 
                        c.usuario_id, 
                        c.usuario_nombre, 
                        c.folio, 
                        c.cliente, 
                        c.contacto, 
                        c.cel, 
                        c.direccion, 
                        c.email,
                        c.negocio_id, 
                        c.negocio_nombre
                    FROM clientes c
                    LEFT JOIN negocios n ON c.negocio_id = n.id
                    ORDER BY c.updatedAt DESC`);
                res.status(200).json(rows[0])
            } catch (error) {
                res.status(500).json({ error: error.message })
            }

        }

        if (negocio_id) {

            if (!isAdmin && negocioSolicitado !== negocioId) {
                return res.status(403).json({ error: 'No tienes permiso para accesar' });
            }

            try {
                const [rows] = await connection.query(`
                    SELECT 
                        c.id, 
                        c.usuario_id, 
                        c.usuario_nombre, 
                        c.folio, 
                        c.cliente, 
                        c.contacto, 
                        c.cel, 
                        c.direccion, 
                        c.email,
                        c.negocio_id, 
                        c.negocio_nombre
                    FROM clientes c
                    LEFT JOIN negocios n ON c.negocio_id = n.id
                    WHERE c.negocio_id = ?
                    ORDER BY c.updatedAt DESC`, [negocio_id])

                if (rows.length === 0) {
                    /* return res.status(404).json({ error: 'Cliente no encontrado' }); */
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

                const whereClauses = [
                    "LOWER(folio) LIKE ?",
                    "LOWER(usuario_nombre) LIKE ?",
                    "LOWER(cliente) LIKE ?",
                    "LOWER(contacto) LIKE ?",
                    "LOWER(direccion) LIKE ?",
                    "LOWER(negocio_nombre) LIKE ?"
                ];

                const params = [
                    searchQuery, searchQuery, searchQuery, searchQuery,
                    searchQuery, searchQuery
                ]

                let whereClause = `(${whereClauses.join(" OR ")})`;

                if (!isAdmin && negocioId) {
                    whereClause += ` AND clientes.negocio_id = ?`;
                    params.push(negocioId);
                }

                const query = `
                SELECT
                  id, 
                  usuario_id, 
                  usuario_nombre, 
                  folio, 
                  cliente,
                  contacto, 
                  cel, 
                  email,
                  direccion,
                  negocio_id,
                  negocio_nombre,
                  createdAt
                FROM clientes
                WHERE ${whereClause}
                ORDER BY updatedAt DESC
              `;

                const [rows] = await connection.query(query, params);
                return res.status(200).json(rows);

            } catch (error) {
                console.error(error)
                return res.status(500).json({ error: 'Error al realizar la búsqueda' });
            }

        } else {

            if (!isAdmin) {
                return res.status(403).json({ error: 'No tienes permiso para accesar' });
            }

            try {
                const [rows] = await connection.query(`
                    SELECT 
                        c.id, 
                        c.usuario_id, 
                        c.usuario_nombre, 
                        c.folio, 
                        c.cliente, 
                        c.contacto, 
                        c.cel, 
                        c.direccion, 
                        c.email,
                        c.negocio_id, 
                        c.negocio_nombre
                    FROM clientes c
                    LEFT JOIN negocios n ON c.negocio_id = n.id
                    ORDER BY c.updatedAt DESC`);
                res.status(200).json(rows)
            } catch (error) {
                res.status(500).json({ error: error.message })
            }
        }
    } else if (req.method === 'POST') {

        try {
            const { usuario_id, usuario_nombre, folio, cliente, contacto, cel, direccion, email, negocio_id, negocio_nombre } = req.body

            if (!negocioId) {
                return res.status(403).json({ error: "No tienes permiso para accesar" });
            }

            if (!cliente) {
                return res.status(400).json({ error: 'Todos los datos son obligatorios' })
            }

            const [result] = await connection.query('INSERT INTO clientes (usuario_id, usuario_nombre, folio, cliente, contacto, cel, direccion, email, negocio_id, negocio_nombre) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)', [usuario_id, usuario_nombre, folio, cliente, contacto, cel, direccion, email, negocio_id, negocio_nombre])
            const newClient = { id: result.insertId }
            res.status(201).json(newClient)
        } catch (error) {
            res.status(500).json({ error: error.message })
        }
    } else if (req.method === 'PUT') {

        /* if (!isAdmin && negocioSeleccionado !== negocioId) {
            return res.status(403).json({ error: 'No tienes permiso para modificar este recurso' })
          } */

        const { id } = req.query;

        if (!id) {
            return res.status(400).json({ error: 'ID del cliente es obligatorio' })
        }

        const { cliente, contacto, cel, direccion, email } = req.body

        if (!cliente) {
            return res.status(400).json({ error: 'Todos los datos son obligatorios' })
        }

        try {
            const [result] = await connection.query('UPDATE clientes SET cliente = ?, contacto = ?, cel = ?, direccion = ?, email = ? WHERE id = ?', [cliente, contacto, cel, direccion, email, id])

            if (result.affectedRows === 0) {
                return res.status(404).json({ error: 'Cliente no encontrado' })
            }

            // También actualizamos notas que tienen este cliente_id
            await connection.query(`
            UPDATE notas 
            SET cliente_nombre = ?, cliente_contacto = ?
            WHERE cliente_id = ?
            `, [cliente, contacto, id])

            res.status(200).json({ message: 'Cliente y notas actualizados correctamente' })

        } catch (error) {
            res.status(500).json({ error: error.message })
        }
    } else if (req.method === 'DELETE') {
        const { id } = req.query;

        if (!id) {
            return res.status(400).json({ error: 'ID del cliente es obligatorio' });
        }

        try {
            // Primero obtenemos el negocio_id del cliente que se quiere eliminar
            const [[cliente]] = await connection.query(
                'SELECT negocio_id FROM clientes WHERE id = ?',
                [id]
            );

            if (!cliente) {
                return res.status(404).json({ error: 'Cliente no encontrado' });
            }

            const negocioSeleccionado = cliente.negocio_id;

            // Validación de permisos
            if (!isAdmin && negocioSeleccionado !== negocioId) {
                return res.status(403).json({ error: 'No tienes permiso para modificar este recurso' });
            }

            // Actualizar notas que usan a este cliente
            await connection.query('UPDATE notas SET cliente_id = NULL WHERE cliente_id = ?', [id]);

            // Eliminar cliente
            const [result] = await connection.query('DELETE FROM clientes WHERE id = ?', [id]);

            if (result.affectedRows === 0) {
                return res.status(404).json({ error: 'Cliente no encontrado' });
            }

            res.status(200).json({ message: 'Cliente eliminado correctamente' });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

}

export default authMiddleware(handler)
