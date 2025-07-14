import { map } from 'lodash'
import { Loading } from '@/components/Layouts'
import { formatCurrency, formatDateIncDet } from '@/helpers'
import { useEffect, useState } from 'react'
import styles from './NotaAnticipos.module.css'
import { BasicModal } from '@/layouts'
import { ClickCount } from '../ClickCount/ClickCount'
import { useSelector } from 'react-redux'
import { selectAnticipos, selectNota } from '@/store/notas/notaSelectors'

export function NotaAnticipos(props) {

  const { user, isAdmin, isSuperUser, isPremium, onOpenCloseEditAnticipo } = props

  const nota = useSelector(selectNota)
  const anticipos = useSelector(selectAnticipos)
  
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

  const handleClick = (anticipo) => {

    const isAuthor = user.id === nota.usuario_id;

    if (!isAdmin && !isSuperUser && !isAuthor) return;

    if (isAdmin || isPremium) {
      onOpenCloseEditAnticipo(anticipo);
      return;
    }

    const currentClicks = clicks[anticipo.id] || 0;

    if (currentClicks >= maxClicks) {
      setShowCount(true);
      return;
    }

    setClicks(prevClicks => ({
      ...prevClicks,
      [anticipo.id]: currentClicks + 1
    }));

    onOpenCloseEditAnticipo(anticipo);
  };


  return (

    <>

      {!anticipos ?
        <Loading size={30} loading={2} />
        :
        <div className={styles.main}>
          {map(anticipos.filter(anticipo => anticipo.producto_base !== 1), (anticipo) => (
            <div key={anticipo.id} className={styles.rowMap} onClick={() => handleClick(anticipo)}>
              <h1>{anticipo.tipo}</h1>
              <h1>{anticipo.metodo_pago}</h1>
              <h1>{formatDateIncDet(anticipo.fecha_pago)}</h1>
              <h1>{formatCurrency(anticipo.monto)}</h1>
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
