import { map } from 'lodash'
import { Loading } from '@/components/Layouts'
import { formatCurrency } from '@/helpers'
import { useEffect, useState } from 'react'
import styles from './NotaConceptos.module.css'
import { BasicModal } from '@/layouts'
import { ClickCount } from '../ClickCount/ClickCount'
import { useSelector } from 'react-redux'
import { selectConceptos, selectNota } from '@/store/notas/notaSelectors'

export function NotaConceptos(props) {

  const { user, isAdmin, isSuperUser, isPremium, onOpenCloseEditConcep } = props

  const nota = useSelector(selectNota)
  const conceptos = useSelector(selectConceptos)
  
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

  const isAuthor = user.id === nota.usuario_id;

  if (!isAdmin && !isSuperUser && !isAuthor) return;

  if (isAdmin || isPremium) {
    onOpenCloseEditConcep(concepto);
    return;
  }

  const currentClicks = clicks[concepto.id] || 0;

  if (currentClicks >= maxClicks) {
    setShowCount(true);
    return;
  }

  setClicks(prevClicks => ({
    ...prevClicks,
    [concepto.id]: currentClicks + 1
  }));

  onOpenCloseEditConcep(concepto);
};


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
