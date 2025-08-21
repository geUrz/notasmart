import styles from './HomeUsuario.module.css'
import { FaArrowDown, FaDollarSign, FaFileAlt, FaInfinity } from 'react-icons/fa'
import { Loading } from '@/components/Layouts'
import { formatCurrency } from '@/helpers'
import { selectNotas, selectPorCobrarTotal, selectPrecioGranTotal, selectPrecioProductoBaseTotal, selectTotalFolios, selectTotalNotas } from '@/store/notas/notaSelectors'
import { useSelector } from 'react-redux'

export function HomeUsuario(props) {

  const { isPremium } = props

  const notas = useSelector(selectNotas)
  const totalNotas = useSelector(selectTotalNotas)
  const totalFolios = useSelector(selectTotalFolios)
  const precioProductoBaseTotal = useSelector(selectPrecioProductoBaseTotal)
  const porCobrarTotal = useSelector(selectPorCobrarTotal)
  const precioGranTotal = useSelector(selectPrecioGranTotal)
  
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
              <h1>{totalNotas}</h1>
              <h1>/</h1>
              <h1>
                {isPremium ?
                  <FaInfinity /> : 
                  totalFolios
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
            <h1>{formatCurrency(precioProductoBaseTotal)}</h1>
          }
        </div>
        <div className={styles.iva}>
          {/* <div>
            <h1>IVA</h1>
            <h2>{formatCurrency(ivaTotalNgId)}</h2>
          </div> */}
          <div>
            <h1>Por cobrar</h1>
            {<h2>{formatCurrency(porCobrarTotal)}</h2>}
          </div>
          <div>
            <h1>Recibido</h1>
            <h2>{formatCurrency(precioGranTotal)}</h2>
          </div>
        </div>
      </div>

    </div>

  )
}
