import { map, size } from 'lodash'
import { ListEmpty, Loading } from '@/components/Layouts'
import { FaBuilding } from 'react-icons/fa'
import { BasicModal } from '@/layouts'
import { useState } from 'react'
import { NegocioDetalles } from '../NegocioDetalles'
import styles from './NegociosListSearch.module.css'
import { getValueOrDefault } from '@/helpers'

export function NegociosListSearch(props) {

  const { reload, onReload, negocios, onToastSuccessMod } = props

  const [showDetalles, setShowDetalles] = useState(false)
  const [negocioSeleccionada, setNegocioSeleccionada] = useState(null)

  const onOpenDetalles = (negocio) => {
    setNegocioSeleccionada(negocio)
    setShowDetalles(true)
  }

  const onCloseDetalles = () => {
    setNegocioSeleccionada(null)
    setShowDetalles(false)
  }

  return (

    <>

      {!negocios ? (
        <Loading size={45} loading={1} />
      ) : (
        size(negocios) === 0 ? (
          <ListEmpty />
        ) : (
          <div className={styles.main}>
            {map(negocios, (negocio) => (
              <div key={negocio.id} className={styles.section} onClick={() => onOpenDetalles(negocio)}>
                <div>
                  <div className={styles.column1}>
                    <FaBuilding />
                  </div>
                  <div className={styles.column2}>
                    <div >
                      <h1>Negocio</h1>
                      <h2>{getValueOrDefault(negocio.negocio)}</h2>
                    </div>
                    <div >
                      <h1>Cel</h1>
                      <h2>{getValueOrDefault(negocio.cel)}</h2>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )
      )}

      <BasicModal title='detalles del negocio' show={showDetalles} onClose={onCloseDetalles}>
        {negocioSeleccionada && (
          <NegocioDetalles
            reload={reload}
            onReload={onReload}
            negocio={negocioSeleccionada}
            onCloseDetalles={onCloseDetalles}
            onToastSuccessMod={onToastSuccessMod}
          />
        )}
      </BasicModal>

    </>

  )
}
