import classNames from 'classnames'
import styles from './BasicLayout.module.css'
import { BottomMenu, IconClose, Menu } from '@/components/Layouts'
import { useEffect, useState } from 'react'
import { BasicModal } from '../BasicModal'
import { useAuth } from '@/contexts/AuthContext'
import { FaArrowCircleRight, FaInfoCircle } from 'react-icons/fa'
import Link from 'next/link'

export function BasicLayout(props) {

  const { user } = useAuth()

  const {
    children,
    relative = false,
    totalNotas
  } = props

  const [total, setTotal] = useState(false)

  useEffect(() => {
    if (user && user.id) {
      if (totalNotas === user.folios - 5) {
        setTotal(true)
      } else {
        setTotal(false)
      }
    }
  }, [totalNotas, user.folios])

  const [prueba, setPrueba] = useState(false)

  useEffect(() => {
    if (user && user.id) {
      if (user.plan === 'prueba' && totalNotas === user.folios) {
        setPrueba(true)
      } else {
        setPrueba(false)
      }
    }
  }, [totalNotas, user.folios])

  return (

    <>

      <Menu />

      <div className={classNames({ [styles.relative]: relative })}>
        {children}
      </div>

      <BasicModal show={total} onClose={() => setTotal(false)}>
        <IconClose onOpenClose={() => setTotal(false)} />
        <div className={styles.folios}>
          <FaInfoCircle />
          <h1>¡Quedan pocos folios disponibles!</h1>
          <h2>Por favor, póngase en contacto con el administrador para solicitar mas folios.</h2>
          <Link
            href="https://api.whatsapp.com/send?phone=526861349399&text=%C2%A1Me%20interesa%20adquirir%20m%C3%A1s%20folios!"
            target="_blank"
            rel="noopener noreferrer"
          >
            Solicitar folios <FaArrowCircleRight />
          </Link>
        </div>
      </BasicModal>

      <BasicModal show={prueba} onClose={() => setPrueba(false)}>
        <IconClose onOpenClose={() => setPrueba(false)} />
        <div className={styles.folios}>
          <FaInfoCircle />
          <h1>¡Oops! Ya no tienes folios disponibles.</h1>
          <h2>Comprá un paquete para continuar generando notas digitales.</h2>
          <Link
            href="https://api.whatsapp.com/send?phone=526861349399&text=%C2%A1Me%20interesa%20adquirir%20m%C3%A1s%20folios!"
            target="_blank"
            rel="noopener noreferrer"
          >
            Solicitar folios <FaArrowCircleRight />
          </Link>

        </div>
      </BasicModal>

      <BottomMenu />

    </>

  )
}
