import connection from "@/libs/db"
import authMiddleware from "@/middleware/authMiddleware"
import fs from 'fs'
import path from 'path'

async function getFoliosYTotalNotas(negocio_id) {

    const [[negocioData]] = await connection.query(
        'SELECT folios, plan FROM negocios WHERE id = ?',
        [negocio_id]
    )    

    const folios = negocioData?.folios || 0
    const plan = negocioData?.plan || null

    const [[{ totalNotasNegocioId }]] = await connection.query(
        `SELECT COUNT(*) AS totalNotasNegocioId 
         FROM notas 
         WHERE negocio_id = ?`, 
        [negocio_id]
    )    

    const [[{ conTotalRaw }]] = await connection.query(
        `SELECT SUM(c.total) AS conTotalRaw FROM conceptosnot c JOIN notas n ON c.nota_id = n.id WHERE n.negocio_id = ?`, [negocio_id]
    )

    const [[{ aboProBaseTotalRaw }]] = await connection.query(
        'SELECT SUM(a.monto) AS aboProBaseTotalRaw FROM abonosnot a JOIN notas n ON a.nota_id = n.id WHERE n.negocio_id = ? AND (a.producto_base = 1)', [negocio_id]
    )

    const [[{ antProBaseTotalRaw }]] = await connection.query(
        'SELECT SUM(a.monto) AS antProBaseTotalRaw FROM anticiposnot a JOIN notas n ON a.nota_id = n.id WHERE n.negocio_id = ? AND (a.producto_base = 1)', [negocio_id]
    )

    const [[{ aboTotalRaw }]] = await connection.query(
        'SELECT SUM(a.monto) AS aboTotalRaw FROM abonosnot a JOIN notas n ON a.nota_id = n.id WHERE n.negocio_id = ? AND (a.producto_base IS NULL OR a.producto_base != 1)', [negocio_id]
    )

    const [[{ antTotalRaw }]] = await connection.query(
        'SELECT SUM(a.monto) AS antTotalRaw FROM anticiposnot a JOIN notas n ON a.nota_id = n.id WHERE n.negocio_id = ? AND (a.producto_base IS NULL OR a.producto_base != 1)', [negocio_id]
    )

    const [[{ ivaTotalRaw }]] = await connection.query(
        'SELECT SUM(iva_total) AS ivaTotalRaw FROM notas WHERE negocio_id = ?', [negocio_id]
    )

    const conTotal = parseFloat(conTotalRaw) || 0
    const aboProBaseTotal = parseFloat(aboProBaseTotalRaw) || 0
    const antProBaseTotal = parseFloat(antProBaseTotalRaw) || 0
    const aboTotal = parseFloat(aboTotalRaw) || 0
    const antTotal = parseFloat(antTotalRaw) || 0
    const aboPorCobrarTotal = aboProBaseTotal - aboTotal
    const antPorCobrarTotal = antProBaseTotal - antTotal
    const ivaTotal = parseFloat(ivaTotalRaw) || 0

    return {
 
        plan,
        totalFolios: folios || 0,
        totalNotas: totalNotasNegocioId || 0,
        conTotal,
        aboProBaseTotal,
        aboTotal,
        ivaTotal,
        precioGranTotal: conTotal + aboTotal + antTotal,
        porCobrarTotal: aboPorCobrarTotal + antPorCobrarTotal,
        precioProductoBaseTotal: conTotal + aboProBaseTotal + antProBaseTotal
    }
}

export async function handler(req, res) {

    const user = req.user
    if (!user) return

    const { id, negocio_id, search } = req.query
    const negocioSolicitado = parseInt(negocio_id)
    const negocioId = user?.negocio_id
    const isAdmin = user?.nivel === 'admin'
    
    if (req.method === 'GET') {

        const getDatos = async (notaId, formaPago) => {
            const tipo = formaPago?.toLowerCase()
          
            if (tipo === 'abonos') {
              const [abonos] = await connection.query(
                'SELECT * FROM abonosnot WHERE nota_id = ?', [notaId]
              )
              return abonos
            } else if (tipo === 'anticipo') {
              const [anticipos] = await connection.query(
                'SELECT * FROM anticiposnot WHERE nota_id = ?', [notaId]
              )
              return anticipos
            } else {
              const [conceptos] = await connection.query(
                'SELECT * FROM conceptosnot WHERE nota_id = ?', [notaId]
              )
              return conceptos
            }
          }
          

          if (id) {
            try {
              const [rows] = await connection.query(`
                SELECT 
                  notas.id,
                  notas.usuario_id,
                  notas.usuario_nombre,
                  notas.folio,
                  notas.nota,
                  notas.forma_pago,
                  notas.cliente_id,
                  notas.cliente_nombre,
                  notas.cliente_contacto,
                  notas.negocio_id,
                  notas.negocio_nombre,
                  notas.iva,
                  notas.iva_total,
                  notas.createdAt,
          
                  clientes.folio AS cliente_folio,
                  clientes.cliente AS cliente_nombre_real,
                  clientes.contacto AS cliente_contacto_real,
                  clientes.direccion AS cliente_direccion,
                  clientes.cel AS cliente_cel,
                  clientes.email AS cliente_email,
                  clientes.negocio_id AS cliente_negocio_id
          
                FROM notas
                LEFT JOIN clientes ON clientes.id = notas.cliente_id
                WHERE notas.id = ?
                ORDER BY notas.updatedAt DESC
              `, [id])
          
              const nota = rows[0]
          
              const datos = await getDatos(nota.id, nota.forma_pago)
              const formaPago = nota.forma_pago?.toLowerCase()
          
              if (formaPago === 'abonos') {
                nota.abonos = datos
                nota.conceptos = [] 
                nota.anticipos = [] 
              } else if (formaPago === 'anticipo') {
                nota.anticipos = datos
                nota.abonos = []
                nota.conceptos = []
              } else {
                nota.conceptos = datos
                nota.abonos = [] 
                nota.anticipos = []
              }
          
              res.status(200).json(nota)
            } catch (error) {
              res.status(500).json({ error: error.message })
            }
            return
          }              

        if (negocio_id) {
            const { totalFolios, plan, totalNotas, precioGranTotal, precioProductoBaseTotal, porCobrarTotal } = await getFoliosYTotalNotas(negocioId)
    
            if (!isAdmin && negocioSolicitado !== negocioId) {
                return res.status(403).json({ error: 'No tienes permiso para accesar' });
            }
    
            try {
                const [rows] = await connection.query(`
                    SELECT 
                        notas.id, 
                        notas.usuario_id, 
                        notas.usuario_nombre, 
                        notas.folio, 
                        notas.nota, 
                        notas.forma_pago,
                        notas.cliente_id, 
                        notas.cliente_nombre, 
                        notas.cliente_contacto, 
                        notas.negocio_id,
                        notas.negocio_nombre, 
                        notas.iva, 
                        notas.iva_total, 
                        notas.createdAt,

                        clientes.folio AS cliente_folio,
                        clientes.cliente AS cliente_nombre_real,
                        clientes.contacto AS cliente_contacto_real,
                        clientes.direccion AS cliente_direccion,
                        clientes.cel AS cliente_cel,
                        clientes.email AS cliente_email,
                        clientes.negocio_id AS cliente_negocio_id

                    FROM notas
                    LEFT JOIN clientes ON clientes.id = notas.cliente_id
                    WHERE notas.negocio_id = ?
                    ORDER BY notas.updatedAt DESC
                `, [negocio_id])

                for (const nota of rows) {

                    const datos = await getDatos(nota.id, nota.forma_pago)
                    const formaPago = nota.forma_pago?.toLowerCase()

                    if (formaPago === 'abonos') {
                        nota.abonos = datos
                        nota.conceptos = [] 
                        nota.anticipos = [] 
                    } else if (formaPago === 'anticipo') {
                        nota.anticipos = datos
                        nota.abonos = []
                        nota.conceptos = []
                    } else {
                        nota.conceptos = datos
                        nota.abonos = [] 
                        nota.anticipos = []
                    }
                  }                  
    
                res.status(200).json({
                    totalNotas,
                    precioGranTotal,
                    porCobrarTotal,
                    precioProductoBaseTotal,
                    plan,
                    totalFolios,
                    negocioId,
                    notas: rows
                })
            } catch (error) {
                res.status(500).json({ error: error.message })
            }
            return
        }

        if (search) {
            const searchQuery = `%${search.toLowerCase()}%`
    
            try {
                const whereClauses = [
                    "LOWER(folio) LIKE ?", "LOWER(usuario_nombre) LIKE ?",
                    "LOWER(nota) LIKE ?", "LOWER(forma_pago) LIKE ?",
                    "LOWER(cliente_nombre) LIKE ?", "LOWER(cliente_contacto) LIKE ?",
                    "LOWER(negocio_nombre) LIKE ?", "LOWER(conceptosnot.concepto) LIKE ?"
                ]
    
                const params = new Array(whereClauses.length).fill(searchQuery)
    
                let whereClause = `(${whereClauses.join(" OR ")})`
    
                if (!isAdmin && negocioId) {
                    whereClause += ` AND notas.negocio_id = ?`
                    params.push(negocioId)
                }
    
                const query = `
                    SELECT
                        notas.id, notas.usuario_id, notas.usuario_nombre,
                        notas.folio, notas.nota, notas.forma_pago,
                        notas.cliente_id, notas.cliente_nombre, notas.cliente_contacto,
                        notas.negocio_id, notas.negocio_nombre,
                        notas.iva, notas.iva_total,
                        notas.createdAt
                    FROM notas
                    LEFT JOIN conceptosnot ON notas.id = conceptosnot.nota_id
                    WHERE ${whereClause}
                    GROUP BY notas.id
                    ORDER BY notas.updatedAt DESC
                `
    
                const [rows] = await connection.query(query, params)
    
                // 🔁 AGREGADO: Obtener conceptos
                for (const nota of rows) {
                    const datos = await getDatos(nota.id, nota.forma_pago)
                    const formaPago = nota.forma_pago?.toLowerCase()

                    if (formaPago === 'abonos') {
                        nota.abonos = datos
                        nota.conceptos = [] 
                        nota.anticipos = [] 
                    } else if (formaPago === 'anticipo') {
                        nota.anticipos = datos
                        nota.abonos = []
                        nota.conceptos = []
                    } else {
                        nota.conceptos = datos
                        nota.abonos = [] 
                        nota.anticipos = []
                    }
                  }                  
    
                return res.status(200).json(rows)
            } catch (error) {
                console.error(error)
                res.status(500).json({ error: 'Error al realizar la búsqueda' })
            }
            return
        }
        
        if (!isAdmin) {
            return res.status(403).json({ error: 'No tienes permiso para accesar' })
        }
    
        const { totalNotas, precioGranTotal, porCobrarTotal, precioProductoBaseTotal,  } = await getFoliosYTotalNotas()
    
        try {
            const [rows] = await connection.query(`
                SELECT 
                    id, usuario_id, usuario_nombre, folio, nota, forma_pago,
                    cliente_id, cliente_nombre, cliente_contacto,
                    negocio_id, negocio_nombre, iva, iva_total, createdAt
                FROM notas
                ORDER BY updatedAt DESC
            `)
    
            // 🔁 AGREGADO: Obtener conceptos
            for (const nota of rows) {
                const datos = await getDatos(nota.id, nota.forma_pago)
                const formaPago = nota.forma_pago?.toLowerCase()

                if (formaPago === 'abonos') {
                    nota.abonos = datos
                    nota.conceptos = [] 
                    nota.anticipos = [] 
                } else if (formaPago === 'anticipo') {
                    nota.anticipos = datos
                    nota.abonos = []
                    nota.conceptos = []
                } else {
                    nota.conceptos = datos
                    nota.abonos = [] 
                    nota.anticipos = []
                }
              }
              
    
            return res.status(200).json({
                totalNotas,
                precioGranTotal,
                porCobrarTotal,
                precioProductoBaseTotal,
                notas: rows
            })
        } catch (error) {
            return res.status(500).json({ error: error.message })
        }

    } else if (req.method === 'POST') {

        const { usuario_id, usuario_nombre, folio, nota, forma_pago, cliente_id, cliente_nombre, cliente_contacto, negocio_id, negocio_nombre } = req.body;

        try {

            if (isAdmin) {

            } else {

                const negocio_id = user.negocio_id;

                const { totalNotas, totalFolios, plan } = await getFoliosYTotalNotas(negocio_id)

                const isPremium = plan === 'premium';

                if (!isAdmin && !isPremium && totalNotas >= totalFolios) {
                    return res.status(403).json({ error: 'Has agotado tus folios disponibles' });
                }

            }

            // Insertar la nota si pasa la validación
            const [result] = await connection.query(
                'INSERT INTO notas (usuario_id, usuario_nombre, folio, nota, forma_pago, cliente_id, cliente_nombre, cliente_contacto, negocio_id, negocio_nombre) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
                [usuario_id, usuario_nombre, folio, nota, forma_pago, cliente_id, cliente_nombre, cliente_contacto, negocio_id, negocio_nombre]
            );

            return res.status(201).json({ id: result.insertId });

        } catch (error) {
            return res.status(500).json({ error: error.message });
        }

    } else if (req.method === 'PUT') {

        const { id } = req.query;
        const { nota, cliente_id, cliente_nombre, cliente_contacto } = req.body;

        if (!id) {
            return res.status(400).json({ error: 'ID del nota es obligatorio' })
        }

        if (nota) {
            try {
                const [result] = await connection.query(
                    'UPDATE notas SET nota = ?, cliente_id = ?, cliente_nombre = ?, cliente_contacto = ? WHERE id = ?',
                    [nota, cliente_id, cliente_nombre, cliente_contacto, id]
                )

                if (result.affectedRows === 0) {
                    return res.status(404).json({ error: 'Nota no encontrada' })
                }

                res.status(200).json({ message: 'Nota actualizada correctamente' })
            } catch (error) {
                res.status(500).json({ error: error.message })
            }
        } else {
            return res.status(400).json({ error: 'Datos insuficientes para actualizar la nota' })
        }

    } else if (req.method === 'DELETE') {

        const { id, folio } = req.query;

        if (!id || !folio) {
            return res.status(400).json({ error: 'ID y folio de la nota son obligatorios' })
        }

        try {
            // 1. Eliminar la nota de la base de datos
            const [result] = await connection.query(
                'DELETE FROM notas WHERE id = ?',
                [id]
            )

            if (result.affectedRows === 0) {
                return res.status(404).json({ message: 'Nota no encontrada' })
            }

            // 2. Construir la ruta del archivo PDF
            const filePath = path.join(process.cwd(), 'public/uploads', `nota_${folio}.pdf`)

            // 3. Verificar si el archivo existe antes de eliminarlo
            if (fs.existsSync(filePath)) {
                fs.unlinkSync(filePath)
                console.log(`Archivo eliminado: ${filePath}`)
            } else {
                console.log(`El archivo no existe: ${filePath}`)
            }

            res.status(200).json({ message: 'Nota y PDF eliminados correctamente' })

        } catch (error) {
            console.error("Error al eliminar la nota y su PDF:", error)
            res.status(500).json({ error: 'Error interno del servidor' })
        }

    } else {
        res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE'])
        res.status(405).end(`Method ${method} Not Allowed`)
    }
}

export default authMiddleware(handler)
