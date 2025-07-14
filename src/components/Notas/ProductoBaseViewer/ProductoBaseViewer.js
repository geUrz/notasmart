// components/ProductoBaseViewer.jsx
import { FaEdit } from 'react-icons/fa'
import styles from './ProductoBaseViewer.module.css'
import { formatCurrency } from '@/helpers'
import { SkeletonPlaceholder } from '@/components/Layouts'

export default function ProductoBaseViewer({ data = [], visible = false, onEdit, isLoading = false }) {
  if (!visible) return null

  const productoBase = Array.isArray(data)
    ? data.find((item) => Number(item.producto_base) === 1)
    : null

  return (
    <div className={styles.productoBaseBox}>
      <SkeletonPlaceholder isLoading={isLoading} height="2rem">
      {productoBase ? (
        <>
          <h1>
            Producto: <span className={styles.span}>{productoBase.producto_nombre || '-'}</span>
          </h1>
          <h1>
            Precio: <span className={styles.span}>{formatCurrency(productoBase.monto || 0)}</span>
          </h1>
          <FaEdit onClick={onEdit} />
        </>
      ) : (
        <h1>¡No hay producto base!</h1>
      )}
      </SkeletonPlaceholder>
    </div>
  )
}
