import { map } from 'lodash'
import { Loading } from '@/components/Layouts'
import { formatCurrency } from '@/helpers'
import { useState } from 'react'
import styles from './NotaConceptos.module.css'
import { BasicModal } from '@/layouts'
import { ClickCount } from '../ClickCount/clickCount'

export function NotaConceptos(props) {

  const { conceptos, onOpenCloseEditConcep } = props

  const [clickCount, setClickCount] = useState(0)
  const [showCount, setShowCount] = useState(false) 
  const maxClicks = 3

  const onOpenCloseCount = () => setShowCount((prevState) => !prevState)

  const handleClick = (concepto) => {
    if (clickCount < maxClicks) {
      setClickCount(prevCount => prevCount + 1)
      onOpenCloseEditConcep(concepto)
    } else {
        setShowCount(true)
    }
  }

  return (

    <>

      {!conceptos ?
        <Loading size={30} loading={2} />
        :
        <div className={styles.main}>
          {map(conceptos, (concepto) => (
            <div key={concepto.id} className={styles.rowMap} onClick={() => handleClick(concepto)}>
              <h1>{concepto.tipo}</h1>
              <h1>{concepto.concepto}</h1>
              <h1>${formatCurrency(concepto.precio * 1)}</h1>
              <h1>{concepto.cantidad}</h1>
              <h1>${formatCurrency(concepto.precio * concepto.cantidad)}</h1>
            </div>
          ))}
        </div>
      }

      <BasicModal show={showCount} onClose={onOpenCloseCount}>
        <ClickCount onOpenCloseCount={onOpenCloseCount} />
      </BasicModal>

    </>

  )
}
