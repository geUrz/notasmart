import { FaArrowDown, FaDollarSign, FaFileAlt, FaInfinity } from 'react-icons/fa'
import { Loading } from '@/components/Layouts'
import { formatCurrency } from '@/helpers'
import { selectNotas, selectPorCobrarTotalNgId, selectPrecioGranTotalNgId, selectPrecioProductoBaseTotalNgId, selectTotalFoliosNgId, selectTotalNotasNgId } from '@/store/notas/notaSelectors'
import { useSelector } from 'react-redux'
import styles from './HomeUsuario.module.css'

export function HomeUsuario(props) {

  const { isPremium } = props

  const notas = useSelector(selectNotas)
  const totalNotasNgId = useSelector(selectTotalNotasNgId)
  const totalFoliosNgId = useSelector(selectTotalFoliosNgId)
  const precioProductoBaseTotalNgId = useSelector(selectPrecioProductoBaseTotalNgId)
  const porCobrarTotalNgId = useSelector(selectPorCobrarTotalNgId)
  const precioGranTotalNgId = useSelector(selectPrecioGranTotalNgId)
  
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
              <h1>{totalNotasNgId}</h1>
              <h1>/</h1>
              <h1>
                {isPremium ?
                  <FaInfinity /> : 
                  totalFoliosNgId
                }
              </h1>
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
            <h1>{formatCurrency(precioProductoBaseTotalNgId)}</h1>
          }
        </div>
        <div className={styles.iva}>
          {/* <div>
            <h1>IVA</h1>
            <h2>{formatCurrency(ivaTotalNgId)}</h2>
          </div> */}
          <div>
            <h1>Por cobrar</h1>
            {<h2>{formatCurrency(porCobrarTotalNgId)}</h2>}
          </div>
          <div>
            <h1>Recibido</h1>
            <h2>{formatCurrency(precioGranTotalNgId)}</h2>
          </div>
        </div>
      </div>

    </div>

  )
}
