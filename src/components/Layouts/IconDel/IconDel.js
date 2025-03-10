import { FaTrash } from 'react-icons/fa'
import styles from './IconDel.module.css'

export function IconDel(props) {

  const {setShowConfirmDel} = props

  return (

    <div className={styles.iconDel}>
      <div><FaTrash onClick={() => setShowConfirmDel(true)} /></div>
    </div>

  )
}
