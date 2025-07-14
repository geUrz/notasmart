import connection from "@/libs/db"
import authMiddleware from "@/middleware/authMiddleware";
import bcrypt from "bcrypt"

export async function handler(req, res) {

    const user = req.user
    if (!user) return

    const { id, negocio_id, search } = req.query;
    const isAdmin = user?.nivel === 'admin'
    const negocioSolicitado = parseInt(negocio_id)
    const negocioId = user?.negocio_id;
    
    if (req.method === 'GET') {

        if (search) {
            const searchQuery = `%${search.toLowerCase()}%`

            let isActiveQuery = null;
            if (search.toLowerCase() === "activo") {
                isActiveQuery = 1;
            } else if (search.toLowerCase() === "inactivo") {
                isActiveQuery = 0;
            }

            try {

                // Construir cláusulas dinámicamente
                const whereClauses = [
                    "LOWER(nombre) LIKE ?",
                    "LOWER(folio) LIKE ?",
                    "LOWER(usuario) LIKE ?",
                    "LOWER(email) LIKE ?",
                    "LOWER(nivel) LIKE ?",
                    "LOWER(negocio_nombre) LIKE ?",
                    "LOWER(CAST(isactive AS CHAR)) LIKE ?"
                ];

                const params = [
                    searchQuery, searchQuery, searchQuery, searchQuery,
                    searchQuery, searchQuery, searchQuery
                ];

                if (isActiveQuery !== null) {
                    whereClauses.push("usuarios.isactive = ?");
                    params.push(isActiveQuery);
                }

                let whereClause = `(${whereClauses.join(" OR ")})`;

                if (!isAdmin && negocioId) {
                    whereClause += ` AND usuarios.negocio_id = ?`;
                    params.push(negocioId);
                }

                const query = `
                SELECT  
                  id,
                  folio, 
                  nombre, 
                  usuario, 
                  email, 
                  nivel,
                  negocio_id,
                  negocio_nombre,
                  isactive
                FROM 
                 usuarios
                 WHERE ${whereClause}
                 ORDER BY updatedAt DESC
              `;

                const [rows] = await connection.query(query, params);
                return res.status(200).json(rows);

            } catch (error) {
                console.error(error)
                return res.status(500).json({ error: 'Error al realizar la búsqueda' });
            }
        }

        if (id) {
            try {
                const [rows] = await connection.query(
                    `SELECT 
                    u.id,
                    u.folio, 
                    u.nombre, 
                    u.usuario,
                    u.email, 
                    u.nivel,
                    u.negocio_id,
                    u.negocio_nombre,
                    u.isactive,
                    n.plan
                  FROM usuarios u
                  LEFT JOIN negocios n ON u.negocio_id = n.id
                    WHERE id = ?`,
                    [id]
                );

                /* if (rows.length === 0) {
                    return res.status(404).json({ error: 'Usuario no encontrado' });
                } */

                res.status(200).json(rows[0]);
            } catch (error) {
                res.status(500).json({ error: error.message });
            }
        }

        if (negocio_id) {

            if (!isAdmin && negocioSolicitado !== negocioId) {
                return res.status(403).json({ error: 'No tienes permiso para accesar' });
            }

            try {
                const [rows] = await connection.query(
                    `SELECT 
                        u.id,
                        u.folio, 
                        u.nombre, 
                        u.usuario,
                        u.email, 
                        u.nivel,
                        u.negocio_id,
                        u.negocio_nombre,
                        u.isactive,
                        n.plan
                        FROM usuarios u
                        LEFT JOIN negocios n ON u.negocio_id = n.id
                        WHERE u.negocio_id = ?
                        ORDER BY u.updatedAt DESC`,
                    [negocio_id]
                )
                res.status(200).json(rows)
            } catch (error) {
                res.status(500).json({ error: error.message })
            }

        } else {

            if (!isAdmin) {
                return res.status(403).json({ error: 'No tienes permiso para accesar' });
            }
            
                try {
                    const [rows] = await connection.query(
                        `SELECT 
                            u.id,
                            u.folio, 
                            u.nombre, 
                            u.usuario,
                            u.email, 
                            u.nivel,
                            u.negocio_id,
                            u.negocio_nombre,
                            u.isactive,
                            n.plan
                        FROM usuarios u
                        LEFT JOIN negocios n ON u.negocio_id = n.id
                        ORDER BY u.updatedAt DESC`
                    );
                    res.status(200).json(rows);
                } catch (error) {
                    res.status(500).json({ error: error.message });
                }

            }

    } else if (req.method === 'POST') {
        // Crear un nuevo usuario
        const { folio, nombre, usuario, email, nivel, negocio_id, negocio_nombre, isactive, password } = req.body;

        if (!password) {
            return res.status(400).json({ error: 'Se requiere una contraseña' });
        }

        try {
            // Encriptar la contraseña
            const hashedPassword = await bcrypt.hash(password, 10);

            const [result] = await connection.query(
                `INSERT INTO usuarios (folio, nombre, usuario, email, nivel, negocio_id, negocio_nombre, isactive, password)
                 VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                [folio, nombre, usuario, email, nivel, negocio_id, negocio_nombre, isactive, hashedPassword]
            );

            res.status(201).json({ id: result.insertId, folio, nombre, usuario, email, nivel, negocio_id, negocio_nombre, isactive });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    } else if (req.method === 'PUT') {

        if (!id) {
            return res.status(400).json({ error: 'ID del usuario es necesario para actualizar' });
        }

        const { nombre, usuario, email, nivel, negocio_id, negocio_nombre, isactive } = req.body;

        let updateData = { nombre, usuario, email, nivel, negocio_id, negocio_nombre, isactive };

        try {
            const [result] = await connection.query(
                `UPDATE usuarios 
                 SET nombre = ?, usuario = ?, email = ?, nivel = ?, negocio_id = ?, negocio_nombre = ?, isactive = ?
                 WHERE id = ?`,
                [
                    updateData.nombre,
                    updateData.usuario,
                    updateData.email,
                    updateData.nivel,
                    updateData.negocio_id,
                    updateData.negocio_nombre,
                    updateData.isactive,
                    id
                ]
            );

            if (result.affectedRows === 0) {
                return res.status(404).json({ error: 'Usuario no encontrado' });
            }

            res.status(200).json({ id, ...updateData });
        } catch (error) {
            console.error("Error details: ", error); // Muestra más detalles sobre el error
            res.status(500).json({ error: error.message })
        }
    } else if (req.method === 'DELETE') {

        const { id } = req.query;


        if (!id) {
            return res.status(400).json({ error: 'ID del usuario es obligatorio' })
        }

        try {

            // Ahora eliminar el cliente
            const [result] = await connection.query('DELETE FROM usuarios WHERE id = ?', [id])

            if (result.affectedRows === 0) {
                return res.status(404).json({ error: 'Usuario no encontrado' })
            }

            res.status(200).json({ message: 'Usuario eliminado correctamente' })
        } catch (error) {
            res.status(500).json({ error: error.message })
        }
    } else {
        res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}

export default authMiddleware(handler)
