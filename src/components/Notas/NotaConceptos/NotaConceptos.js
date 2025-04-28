import { map } from 'lodash'
import { Loading } from '@/components/Layouts'
import { formatCurrency } from '@/helpers'
import { useEffect, useState } from 'react'
import styles from './NotaConceptos.module.css'
import { BasicModal } from '@/layouts'
import { ClickCount } from '../ClickCount/ClickCount'

export function NotaConceptos(props) {

  const { user, conceptos, onOpenCloseEditConcep } = props

  const [clickCount, setClickCount] = useState(0)
  const [showCount, setShowCount] = useState(false) 
  const maxClicks = 3

  const onOpenCloseCount = () => setShowCount((prevState) => !prevState)

  const [clicks, setClicks] = useState({})

  useEffect(() => {
    const savedClicks = JSON.parse(localStorage.getItem('conceptClicks')) || {}
    setClicks(savedClicks)
  }, [])

  useEffect(() => {
    localStorage.setItem('conceptClicks', JSON.stringify(clicks))
  }, [clicks])

  const handleClick = (concepto) => {

    if (user.nivel === 'admin') {
      onOpenCloseEditConcep(concepto)
      return
    }

    if (clicks[concepto.id] && clicks[concepto.id] >= maxClicks) {
      setShowCount(true)
    } else {
      setClicks(prevClicks => {
        const newClicks = { ...prevClicks }
        newClicks[concepto.id] = (newClicks[concepto.id] || 0) + 1
        return newClicks
      })

      onOpenCloseEditConcep(concepto)
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
              <h1>{formatCurrency(concepto.precio)}</h1>
              <h1>{concepto.cantidad}</h1>
              <h1>{formatCurrency(concepto.total)}</h1>
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
