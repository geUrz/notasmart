import connection from "@/libs/db";

export default async function handler(req, res) {
    const { id } = req.query; // Obtenemos el ID de la nota
    const { iva, iva_total } = req.body; // Obtenemos los valores

    if (req.method === 'PUT') {
        if (!id || iva === undefined || iva_total === undefined) {
            return res.status(400).json({ error: 'El ID de la nota, IVA e IVA total son obligatorios' });
        }

        try {
            // Actualizamos ambos valores en la base de datos
            const [result] = await connection.query(
                `UPDATE notas 
                 SET iva = ?, iva_total = ? 
                 WHERE id = ?`,
                [iva, iva_total, id]
            );

            if (result.affectedRows === 0) {
                return res.status(404).json({ error: 'Nota no encontrada' });
            }

            res.status(200).json({ message: 'IVA e IVA total actualizados correctamente' });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    } else {
        res.setHeader('Allow', ['PUT']);
        res.status(405).end(`Método ${req.method} no permitido`);
    }
}
