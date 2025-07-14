import connection from '@/libs/db';
import authMiddleware from '@/middleware/authMiddleware';

async function handler(req, res) {
  if (req.method === 'GET') {
    const { nota_id } = req.query;

    if (!nota_id) {
      return res.status(400).json({ error: 'nota_id es requerido' });
    }
  
    try {
      const [rows] = await connection.query(`
        SELECT id, usuario_id, nota_id, tipo, metodo_pago, fecha_pago, monto, producto_base, producto_nombre, createdAt
        FROM anticiposnot
        WHERE nota_id = ?
        ORDER BY 
        CASE WHEN tipo = 'Anticipo' THEN 0 ELSE 1 END,
        fecha_pago ASC;
      `, [nota_id]);

      res.status(200).json(rows);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }  

  else if (req.method === 'POST') {
    const { usuario_id, nota_id, tipo, metodo_pago, monto, producto_base, producto_nombre } = req.body;

    if (!usuario_id || !nota_id || !monto) {
      return res.status(400).json({ error: 'usuario_id, nota_id y monto son obligatorios' });
    }

    try {

      const fecha_pago = new Date().toISOString()

      const [result] = await connection.query(`
        INSERT INTO anticiposnot (usuario_id, nota_id, tipo, metodo_pago, fecha_pago, monto, producto_base, producto_nombre)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [usuario_id, nota_id, tipo, metodo_pago, fecha_pago, monto, producto_base, producto_nombre]
      )

      const [rows] = await connection.query(`SELECT * FROM anticiposnot WHERE id = ?`, [result.insertId]);
      res.status(201).json(rows[0]);

    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  else if (req.method === 'PUT') {
    const { id } = req.query;
    const { tipo, metodo_pago, monto, producto_nombre } = req.body;

    if (!id) return res.status(400).json({ error: 'ID del anticipo es obligatorio' });

    try {
      const [result] = await connection.query(`
        UPDATE anticiposnot
        SET tipo = ?, metodo_pago = ?, monto = ?, producto_nombre = ?
        WHERE id = ?`,
        [tipo, metodo_pago, monto, producto_nombre, id]
      );

      if (result.affectedRows === 0) {
        return res.status(404).json({ error: 'Abono no encontrado' });
      }

      // Recalcular total abonado
      /* const [[{ nota_id }]] = await connection.query(`SELECT nota_id FROM anticiposnot WHERE id = ?`, [id]);
      await connection.query(`
        UPDATE notas
        SET pagado = (
          SELECT SUM(monto) FROM anticiposnot WHERE nota_id = ?
        )
        WHERE id = ?`,
        [nota_id, nota_id]
      ); */

      const [rows] = await connection.query(`SELECT * FROM anticiposnot WHERE id = ?`, [id]);
      res.status(200).json(rows[0])
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  else if (req.method === 'DELETE') {
    const { anticipo_id } = req.query;
  
    if (!anticipo_id) return res.status(400).json({ error: 'ID del anticipo es obligatorio' });
  
    try {
      const [result] = await connection.query(`DELETE FROM anticiposnot WHERE id = ?`, [anticipo_id]);
  
      if (result.affectedRows === 0) {
        return res.status(404).json({ error: 'Abono no encontrado' });
      }
  
      res.status(200).json({ message: 'Abono eliminado exitosamente' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }  

  else {
    res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE']);
    res.status(405).end(`Método ${req.method} no permitido`);
  }
}

export default authMiddleware(handler);
