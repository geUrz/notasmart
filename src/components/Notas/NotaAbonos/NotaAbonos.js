import { map } from 'lodash'
import { Loading } from '@/components/Layouts'
import { formatCurrency, formatDateIncDet } from '@/helpers'
import { useEffect, useState } from 'react'
import styles from './NotaAbonos.module.css'
import { BasicModal } from '@/layouts'
import { ClickCount } from '../ClickCount/ClickCount'
import { useSelector } from 'react-redux'
import { selectAbonos, selectNota } from '@/store/notas/notaSelectors'

export function NotaAbonos(props) {

  const { user, isAdmin, isSuperUser, isPremium, onOpenCloseEditAbono } = props

  const nota = useSelector(selectNota)
  const abonos = useSelector(selectAbonos)
  
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

  const handleClick = (abono) => {

    const isAuthor = user.id === nota.usuario_id;

    if (!isAdmin && !isSuperUser && !isAuthor) return;

    if (isAdmin || isPremium) {
      onOpenCloseEditAbono(abono);
      return;
    }

    const currentClicks = clicks[abono.id] || 0;

    if (currentClicks >= maxClicks) {
      setShowCount(true);
      return;
    }

    setClicks(prevClicks => ({
      ...prevClicks,
      [abono.id]: currentClicks + 1
    }));

    onOpenCloseEditAbono(abono);
  };


  return (

    <>

      {!abonos ?
        <Loading size={30} loading={2} />
        :
        <div className={styles.main}>
          {map(abonos.filter(abono => abono.producto_base !== 1), (abono) => (
            <div key={abono.id} className={styles.rowMap} onClick={() => handleClick(abono)}>
              <h1>{abono.tipo}</h1>
              <h1>{abono.metodo_pago}</h1>
              <h1>{formatDateIncDet(abono.fecha_pago)}</h1>
              <h1>{formatCurrency(abono.monto)}</h1>
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
