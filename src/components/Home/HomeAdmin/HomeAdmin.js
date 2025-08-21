import styles from './HomeAdmin.module.css'
import { FaArrowDown, FaDollarSign, FaFileAlt } from 'react-icons/fa'
import { Loading } from '@/components/Layouts'
import { formatCurrency } from '@/helpers'
import { useSelector } from 'react-redux'
import { selectNotas, selectPorCobrarTotalGlobal, selectPrecioGranTotalGlobal, selectPrecioProductoBaseTotalGlobal, selectTotalNotasGlobal } from '@/store/notas/notaSelectors'

export function HomeAdmin() {

  const notas = useSelector(selectNotas)
  const totalNotasGlobal = useSelector(selectTotalNotasGlobal)
  const precioProductoBaseTotalGlobal = useSelector(selectPrecioProductoBaseTotalGlobal)
  const porCobrarTotalGlobal = useSelector(selectPorCobrarTotalGlobal)
  const precioGranTotalGlobal = useSelector(selectPrecioGranTotalGlobal)
  
  return (

    <div className={styles.main}>
      <div className={styles.notas}>
        <div className={styles.icon}>
          <div className={styles.icon1}>
            <FaFileAlt />
          </div>
          <h1>Folios</h1>
        </div>
        <div className={styles.folios}>
          {!notas ?
            <Loading size={32} loading={3} /> :
            <>
              <h1>{totalNotasGlobal}</h1>
            </>
          }
        </div>
      </div>
      <div className={styles.entradas}>
        <div className={styles.icon}>
          <div className={styles.icon1}>
            <FaDollarSign />
          </div>
          <div className={styles.icon2}>
            <FaArrowDown />
          </div>
          <h1>Entradas</h1>
        </div>
        <div className={styles.count}>
          {!notas ?
            <Loading size={30} loading={3} /> :
            <h1>{formatCurrency(precioProductoBaseTotalGlobal)}</h1>
          }
        </div>
        <div className={styles.iva}>
          {/* <div>
            <h1>IVA</h1>
            <h2>{formatCurrency(ivaTotalNgId)}</h2>
          </div> */}
          <div>
            <h1>Por cobrar</h1>
            {<h2>{formatCurrency(porCobrarTotalGlobal)}</h2>}
          </div>
          <div>
            <h1>Recibido</h1>
            <h2>{formatCurrency(precioGranTotalGlobal)}</h2>
          </div>
        </div>
      </div>
    </div>

  )
}
