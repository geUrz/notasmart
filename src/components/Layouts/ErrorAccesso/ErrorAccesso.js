import { FaInfoCircle } from 'react-icons/fa'
import { IconClose } from '../IconClose'
import styles from './ErrorAccesso.module.css'

export function ErrorAccesso(props) {

  const{apiError, onOpenCloseErrorModal} = props

  return (
    
    <>
    
    <IconClose onOpenClose={onOpenCloseErrorModal} />
        <div className={styles.error}>
          <FaInfoCircle />
          <h1>{apiError}</h1>
          <h2>No tienes los permisos necesarios para acceder.</h2>
        </div>
    
    </>

  )
}
