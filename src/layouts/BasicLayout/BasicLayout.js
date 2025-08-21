import classNames from 'classnames'
import styles from './BasicLayout.module.css'
import { BottomMenu, IconClose, Menu } from '@/components/Layouts'
import { useEffect, useState } from 'react'
import { BasicModal } from '../BasicModal'
import { FaArrowCircleRight, FaInfoCircle } from 'react-icons/fa'
import Link from 'next/link'
import { useSelector } from 'react-redux'
import { selectNegocioId, selectPlan, selectTotalFolios, selectTotalNotas } from '@/store/notas/notaSelectors'

export function BasicLayout(props) {

  const {
    children,
    relative = false,
  } = props

  const plan = useSelector(selectPlan)
  const negocioId = useSelector(selectNegocioId)
  const totalNotas = useSelector(selectTotalNotas)
  const totalFolios = useSelector(selectTotalFolios)
  
  const [total, setTotal] = useState(false)

  useEffect(() => {
      if(negocioId) {
        if (plan !== 'premium' && totalNotas === totalFolios - 5) {
          setTotal(true)
        } else {
          setTotal(false)
        }
      }
  }, [totalNotas, totalFolios])

  const [prueba, setPrueba] = useState(false)

  useEffect(() => {
      if(negocioId) {
        if (plan !== 'premium' && totalNotas == totalFolios) {
          setPrueba(true)
        } else {
          setPrueba(false)
        }
      }
  }, [totalNotas, totalFolios])

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
