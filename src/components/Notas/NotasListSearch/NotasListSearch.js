import styles from './NotasListSearch.module.css'
import { map, size } from 'lodash'
import { ListEmpty, Loading } from '@/components/Layouts'
import { FaFileAlt } from 'react-icons/fa'
import { BasicModal } from '@/layouts'
import { NotaDetalles } from '../NotaDetalles'
import { useOpenNotaConConceptos } from '@/hooks/useOpenNotaConConceptos'
import { getValueOrDefault } from '@/helpers'
import { getValueOrDel } from '@/helpers/getValueOrDel'
import { useDispatch, useSelector } from 'react-redux'
import { selectSearchResults } from '@/store/notas/notaSelectors'
import { clearSearchResults, searchNotas, setNota } from '@/store/notas/notaSlice'
import { useEffect, useState } from 'react'

export function NotasListSearch(props) {
  const { user, reload, onReload, query, onToastSuccess } = props

  const dispatch = useDispatch()
  const notas = useSelector(selectSearchResults)

  const [showDetalles, setShowDetalles] = useState(false)

  const onOpenDetalles = (nota) => {
    dispatch(setNota(nota))
    setShowDetalles(true)
  }

  const onCloseDetalles = () => {
    dispatch(setNota(null))
    setShowDetalles(false)
  }

  useEffect(() => {
    if (query.trim().length > 0) {
      dispatch(searchNotas(query))
    }
  }, [query, dispatch])

  useEffect(() => {
    return () => {
      dispatch(clearSearchResults())
    }
  }, [dispatch])

  /* const {
    showDetalles,
    onOpenDetalles,
    onCloseDetalles,
  } = useOpenNotaConConceptos() */

  return (
    <>
      {!notas ? (
        <Loading size={45} loading={1} />
      ) : size(notas) === 0 ? (
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
      )}

      <BasicModal title="detalles de la nota" show={showDetalles} onClose={onCloseDetalles}>
        <NotaDetalles
          user={user}
          reload={reload}
          onReload={onReload}
          onCloseDetalles={onCloseDetalles}
          onToastSuccess={onToastSuccess}
        />
      </BasicModal>
    </>
  )
}
