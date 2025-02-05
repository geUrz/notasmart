import { IconClose } from '@/components/Layouts'
import styles from './ClickCount.module.css'

export function ClickCount(props) {

  const {onOpenCloseCount} = props

  return (
    
    <>
    
      <IconClose onOpenClose={onOpenCloseCount} />

      <div className={styles.main}>
        <div className={styles.section}>
          <h1>¡ Has alcanzado el máximo permitido para editar este concepto !</h1>
        </div>
      </div>

    </>

  )
}
