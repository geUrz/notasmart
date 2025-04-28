import { useState } from 'react'
import { ListEmpty, Loading } from '@/components/Layouts'
import { map, size } from 'lodash'
import { FaBuilding } from 'react-icons/fa'
import { BasicModal } from '@/layouts'
import { NegocioDetalles } from '../NegocioDetalles'
import { getValueOrDefault } from '@/helpers'
import styles from './NegociosLista.module.css'

export function NegociosLista(props) {

  const { user, reload, onReload, negocios, onToastSuccess, onToastSuccessMod, onToastSuccessDel } = props

  const [showDetalles, setShowDetalles] = useState(false)
  const [negocioSeleccionado, setNegocioSeleccionado] = useState(null)

  const onOpenDetalles = (negocio) => {
    setNegocioSeleccionado(negocio)
    setShowDetalles(true)
  }

  const onCloseDetalles = () => {
    setNegocioSeleccionado(null)
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
        <NegocioDetalles user={user} reload={reload} onReload={onReload} negocio={negocioSeleccionado} onCloseDetalles={onCloseDetalles} onToastSuccess={onToastSuccess} onToastSuccessMod={onToastSuccessMod} onToastSuccessDel={onToastSuccessDel} />
      </BasicModal>

    </>

  )
}
