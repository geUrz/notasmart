import styles from './ClientesListSearch.module.css'
import { map, size } from 'lodash'
import { ListEmpty, Loading } from '@/components/Layouts'
import { FaUsers } from 'react-icons/fa'
import { BasicModal } from '@/layouts'
import { useEffect, useState } from 'react'
import { ClienteDetalles } from '../ClienteDetalles'
import { getValueOrDefault } from '@/helpers'
import { clearSearchResults, searchClientes, setCliente } from '@/store/clientes/clienteSlice'
import { useDispatch, useSelector } from 'react-redux'
import { selectSearchResults } from '@/store/clientes/clienteSelectors'

export function ClientesListSearch(props) {

  const { reload, onReload, query, onToastSuccess } = props

  const dispatch = useDispatch()
  const clientes = useSelector(selectSearchResults)

  const [showDetalles, setShowDetalles] = useState(false)

  const onOpenDetalles = (cliente) => {
    dispatch(setCliente(cliente))
    setShowDetalles(true)
  }

  const onCloseDetalles = () => {
    dispatch(setCliente(null))
    setShowDetalles(false)
  }

  useEffect(() => {
    if (query.trim().length > 0) {
      dispatch(searchClientes(query))
    }
  }, [query, dispatch])

  useEffect(() => {
    return () => {
      dispatch(clearSearchResults())
    }
  }, [dispatch])

  return (

    <>

      {!clientes ? (
        <Loading size={45} loading={1} />
      ) : (
        size(clientes) === 0 ? (
          <ListEmpty />
        ) : (
          <div className={styles.main}>
            {map(clientes, (cliente) => (
              <div key={cliente.id} className={styles.section} onClick={() => onOpenDetalles(cliente)}>
                <div>
                  <div className={styles.column1}>
                    <FaUsers />
                  </div>
                  <div className={styles.column2}>
                    <div >
                      <h1>Cliente</h1>
                      <h2>{getValueOrDefault(cliente.cliente)}</h2>
                    </div>
                    <div >
                      <h1>Contacto</h1>
                      <h2>{getValueOrDefault(cliente.contacto)}</h2>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )
      )}

      <BasicModal title='detalles del cliente' show={showDetalles} onClose={onCloseDetalles}>
        <ClienteDetalles
          reload={reload}
          onReload={onReload}
          onCloseDetalles={onCloseDetalles}
          onToastSuccess={onToastSuccess}
        />
      </BasicModal>

    </>

  )
}
