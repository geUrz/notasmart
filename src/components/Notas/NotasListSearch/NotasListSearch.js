import { map, size } from 'lodash'
import { ListEmpty, Loading } from '@/components/Layouts'
import { FaFileAlt } from 'react-icons/fa'
import { BasicModal } from '@/layouts'
import { useState } from 'react'
import { NotaDetalles } from '../NotaDetalles'
import styles from './NotasListSearch.module.css'
import { getValueOrDefault } from '@/helpers'
import { getValueOrDel } from '@/helpers/getValueOrDel'

export function NotasListSearch(props) {

  const { user, reload, onReload, notas, onToastSuccessMod } = props

  const [showDetalles, setShowDetalles] = useState(false)
  const [notaSeleccionada, setNotaSeleccionada] = useState(null)
  
  const onOpenDetalles = (nota) => {
    setNotaSeleccionada(nota)
    setShowDetalles(true)
  }

  const onCloseDetalles = () => {
    setNotaSeleccionada(null)
    setShowDetalles(false)
  }

  return (

    <>

      {!notas ? (
        <Loading size={45} loading={1} />
      ) : (
        size(notas) === 0 ? (
          <ListEmpty />
        ) : (
          <div className={styles.main}>
            {map(notas, (nota) => (
              <div key={nota.id} className={styles.section} onClick={() => onOpenDetalles(nota)}>
                <div>
                  <div className={styles.column1}>
                    <FaFileAlt />
                  </div>
                  <div className={styles.column2}>
                    <div>
                      <h1>Nota</h1>
                      <h2>{getValueOrDefault(nota.nota)}</h2>
                    </div>
                    <div>
                      <h1>Cliente</h1>
                      <h2>{getValueOrDel(nota?.cliente_nombre, !nota?.cliente_id)}</h2>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )
      )}

      <BasicModal title='detalles de la nota' show={showDetalles} onClose={onCloseDetalles}>
        {notaSeleccionada && (
          <NotaDetalles
          user={user}
            reload={reload}
            onReload={onReload}
            nota={notaSeleccionada}
            onOpenClose={onCloseDetalles}
            onToastSuccessMod={onToastSuccessMod}
          />
        )}
      </BasicModal>

    </>

  )
}
