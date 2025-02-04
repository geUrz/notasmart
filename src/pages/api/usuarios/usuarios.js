import connection from "@/libs/db"
import bcrypt from "bcrypt"

export default async function handler(req, res) {
    const { id, isadmin, search } = req.query;

    if (req.method === 'GET') {

        if (search) {
            const searchQuery = `%${search.toLowerCase()}%`
            
            // Convertir 'Activo' a 1 y 'Inactivo' a 0
            let isActiveQuery = null;
            if (search.toLowerCase() === "activo") {
                isActiveQuery = 1;
            } else if (search.toLowerCase() === "inactivo") {
                isActiveQuery = 0;
            }
        
            try {
                const query = `
                    SELECT  
                        id,
                        folio, 
                        nombre, 
                        usuario, 
                        email, 
                        nivel,
                        folios,
                        isactive
                    FROM 
                        usuarios
                    WHERE LOWER(nombre) LIKE ? 
                    OR LOWER(folio) LIKE ? 
                    OR LOWER(usuario) LIKE ? 
                    OR LOWER(email) LIKE ? 
                    OR LOWER(CAST(isactive AS CHAR)) LIKE ?
                    ${isActiveQuery !== null ? "OR usuarios.isactive = ?" : ""}
                    ORDER BY updatedAt DESC`;
        
                const params = [
                    searchQuery, searchQuery, searchQuery, searchQuery, 
                    searchQuery
                ];
        
                if (isActiveQuery !== null) {
                    params.push(isActiveQuery);
                }

                /* if (rows.length === 0) {
                    return res.status(404).json({ message: 'No se encontraron usuarios' })
                } */
        
                const [rows] = await connection.query(query, params);
                res.status(200).json(rows);
        
            } catch (error) {
                res.status(500).json({ error: 'Error al realizar la búsqueda' });
            }
            return;
        }
        

        if (isadmin) {

            const isadminValues = isadmin.split(',').map(value => value.trim())

            try {
                const [rows] = await connection.query(
                    `SELECT 
                        id,
                        folio, 
                        nombre, 
                        usuario, 
                        email, 
                        nivel,
                        folios,
                        isactive
                        FROM usuarios 
                        WHERE isadmin IN (?)`,
                    [isadminValues]
                );

                /* if (rows.length === 0) {
                    return res.status(404).json({ error: 'Usuario no encontrado' });
                } */

                res.status(200).json(rows);
            } catch (error) {
                res.status(500).json({ error: error.message });
            }
        }

        if (id) {
            try {
                const [rows] = await connection.query(
                    'SELECT id, nombre, usuario, email, nivel, folios, isactive FROM usuarios WHERE id = ?',
                    [id]
                );

                /* if (rows.length === 0) {
                    return res.status(404).json({ error: 'Usuario no encontrado' });
                } */

                res.status(200).json(rows[0]);
            } catch (error) {
                res.status(500).json({ error: error.message });
            }
        } else {
            try {
                const [rows] = await connection.query(
                    `SELECT 
                        id,
                        folio, 
                        nombre, 
                        usuario,
                        email, 
                        nivel,
                        folios,
                        isactive
                    FROM 
                        usuarios
                    ORDER BY 
                        usuarios.updatedAt DESC`
                );
                res.status(200).json(rows);
            } catch (error) {
                res.status(500).json({ error: error.message });
            }
        }
    } else if (req.method === 'POST') {
        // Crear un nuevo usuario
        const { folio, nombre, usuario, email, nivel, folios, isactive, password } = req.body;

        if (!password) {
            return res.status(400).json({ error: 'Se requiere una contraseña' });
        }

        try {
            // Encriptar la contraseña
            const hashedPassword = await bcrypt.hash(password, 10);

            const [result] = await connection.query(
                `INSERT INTO usuarios (folio, nombre, usuario, email, nivel, folios, isactive, password)
                 VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
                [folio, nombre, usuario, email, nivel, folios, isactive, hashedPassword]
            );

            res.status(201).json({ id: result.insertId, folio, nombre, usuario, email, nivel, folios, isactive });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    } else if (req.method === 'PUT') {
        // Actualizar un usuario existente
        if (!id) {
            return res.status(400).json({ error: 'ID del usuario es necesario para actualizar' });
        }

        const { nombre, usuario, email, nivel, isactive } = req.body;

        try {
            const [result] = await connection.query(
                `UPDATE usuarios 
                 SET nombre = ?, usuario = ?, email = ?, nivel = ?, folios = ?, isactive = ?
                 WHERE id = ?`,
                [nombre, usuario, email, nivel, folios, isactive, id]
            );

            if (result.affectedRows === 0) {
                return res.status(404).json({ error: 'Usuario no encontrado' });
            }

            res.status(200).json({ id, nombre, usuario, email, nivel, folios, isactive });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    } else {
        res.setHeader('Allow', ['GET', 'POST', 'PUT']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}
