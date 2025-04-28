import connection from "@/libs/db"

export default async function handler(req, res) {
    const { usuario_id, search } = req.query;

    if (req.method === 'GET') {
        if (usuario_id) {
            // Obtener un cliente por ID
            try {
                const [rows] = await connection.query(`
                    SELECT 
                        clientes.id, 
                        clientes.usuario_id, 
                        usuarios.nombre AS usuario_nombre,
                        clientes.folio, 
                        clientes.cliente, 
                        clientes.contacto, 
                        clientes.cel, 
                        clientes.direccion, 
                        clientes.email 
                    FROM clientes
                    JOIN usuarios ON clientes.usuario_id = usuarios.id 
                    WHERE usuario_id = ?
                    ORDER BY clientes.updatedAt DESC`, [usuario_id])

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
                    const [rows] = await connection.query(`
                        SELECT
                            clientes.id, 
                            clientes.folio, 
                            clientes.usuario_id,
                            usuarios.nombre AS usuario_nombre,
                            clientes.cliente,
                            clientes.contacto,
                            clientes.cel,
                            clientes.direccion,
                            clientes.email,
                            clientes.createdAt
                        FROM clientes
                        JOIN usuarios ON clientes.usuario_id = usuarios.id 
                        WHERE 
                            LOWER(clientes.folio) LIKE ? 
                        OR 
                            LOWER(clientes.cliente) LIKE ?
                        OR 
                            LOWER(clientes.contacto) LIKE ?
                        OR 
                            LOWER(clientes.cel) LIKE ?
                        OR 
                            LOWER(clientes.direccion) LIKE ?
                        OR 
                            LOWER(clientes.email) LIKE ?  
                        OR 
                            LOWER(usuarios.nombre) LIKE ? 
                        OR 
                            LOWER(clientes.createdAt) LIKE ?
                        ORDER BY clientes.updatedAt DESC`, [searchQuery, searchQuery, searchQuery, searchQuery, searchQuery, searchQuery, searchQuery, searchQuery]);
    
                    res.status(200).json(rows); 
    
                } catch (error) {
                    res.status(500).json({ error: 'Error al realizar la búsqueda' });
                }
                return;
            }

            // Obtener todos los clientes
            try {
                const [rows] = await connection.query(`
                    SELECT 
                        clientes.id, 
                        clientes.usuario_id, 
                        usuarios.nombre AS usuario_nombre,
                        clientes.folio, 
                        clientes.cliente, 
                        clientes.contacto, 
                        clientes.cel, 
                        clientes.direccion, 
                        clientes.email 
                    FROM clientes
                    JOIN usuarios ON clientes.usuario_id = usuarios.id 
                    ORDER BY clientes.updatedAt DESC`);
                res.status(200).json(rows)
            } catch (error) {
                res.status(500).json({ error: error.message })
            }
        
    } else if (req.method === 'POST') {
        try {
            const { usuario_id, folio, cliente, contacto, cel, direccion, email } = req.body
            if (!cliente ) {
                return res.status(400).json({ error: 'Todos los datos son obligatorios' })
            }

            const [result] = await connection.query('INSERT INTO clientes (usuario_id, folio, cliente, contacto, cel, direccion, email) VALUES (?, ?, ?, ?, ?, ?, ?)', [usuario_id, folio, cliente, contacto, cel, direccion, email])
            const newClient = { id: result.insertId }
            res.status(201).json(newClient)
        } catch (error) {
            res.status(500).json({ error: error.message })
        }
    } else if (req.method === 'PUT') {

        const { id } = req.query;

        if (!id) {
            return res.status(400).json({ error: 'ID del cliente es obligatorio' })
        }

        const { folio, cliente, contacto, cel, direccion, email } = req.body

        if (!cliente) {
            return res.status(400).json({ error: 'Todos los datos son obligatorios' })
        }

        try {
            const [result] = await connection.query('UPDATE clientes SET folio = ?, cliente = ?, contacto = ?, cel = ?, direccion = ?, email = ? WHERE id = ?', [folio, cliente, contacto, cel, direccion, email, id])

            if (result.affectedRows === 0) {
                return res.status(404).json({ error: 'Cliente no encontrado' })
            }

            res.status(200).json({ message: 'Cliente actualizado correctamente' })
        } catch (error) {
            res.status(500).json({ error: error.message })
        }
    } else if (req.method === 'DELETE') {

        const { id } = req.query;


        if (!id) {
            return res.status(400).json({ error: 'ID del cliente es obligatorio' })
        }

        try {
            // Actualizar la columna client_id en la tabla notas a NULL para el cliente que se va a eliminar
            await connection.query('UPDATE notas SET cliente_id = NULL WHERE cliente_id = ?', [id])

            // Ahora eliminar el cliente
            const [result] = await connection.query('DELETE FROM clientes WHERE id = ?', [id])

            if (result.affectedRows === 0) {
                return res.status(404).json({ error: 'Cliente no encontrado' })
            }

            res.status(200).json({ message: 'Cliente eliminado correctamente' })
        } catch (error) {
            res.status(500).json({ error: error.message })
        }
    } else {
        res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE'])
        res.status(405).end(`Method ${req.method} Not Allowed`)
    }
}
