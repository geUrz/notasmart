import classNames from 'classnames'
import styles from './BasicLayout.module.css'
import { BottomMenu, IconClose, Menu } from '@/components/Layouts'
import { useEffect, useState } from 'react'
import { BasicModal } from '../BasicModal'
import { useAuth } from '@/contexts/AuthContext'
import { FaInfoCircle } from 'react-icons/fa'

export function BasicLayout(props) {

  const {user} = useAuth()

  const {
    children,
    relative=false,
    totalNotas
  } = props

  const [total, setTotal] = useState(false)

  useEffect(() => {
    if(user && user.id){
      if(totalNotas === user.folios - 5){
        setTotal(true)
      }else{
        setTotal(false)
      }
    }
  }, [totalNotas, user.folios])

  return (
    
    <>
    
      <Menu />

      <div className={classNames({[styles.relative] : relative})}>
        {children}
      </div>

      <BasicModal show={total} onClose={() => setTotal(false)}>
        <IconClose onOpenClose={() => setTotal(false)} />
          <div className={styles.folios}>
            <FaInfoCircle />
            <h1>¡Quedan pocos folios disponibles!</h1>
            <h2>Por favor, póngase en contacto con el administrador para resolverlo.</h2>
          </div>
      </BasicModal>

      <BottomMenu />

    </>

  )
}
