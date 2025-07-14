import { useState } from 'react'
import { ListEmpty, Loading } from '@/components/Layouts'
import { map, size } from 'lodash'
import { FaUsers } from 'react-icons/fa'
import { BasicModal } from '@/layouts'
import { ClienteDetalles } from '../ClienteDetalles'
import { getValueOrDefault } from '@/helpers'
import styles from './ClientesLista.module.css'
import { useDispatch, useSelector } from 'react-redux'
import { selectClientes } from '@/store/clientes/clienteSelectors'
import { setCliente } from '@/store/clientes/clienteSlice'
import { fetchNotas } from '@/store/notas/notaSlice'

export function ClientesLista(props) {

  const { user, reload, onReload, onToastSuccessMod, onToastSuccessDel } = props

  const dispatch = useDispatch()
  const clientes = useSelector(selectClientes)

  const syncNota = async () => {
    await dispatch(fetchNotas(user.negocio_id))
  }

  const [showDetalles, setShowDetalles] = useState(false)

  const onOpenDetalles = (cliente) => {
    dispatch(setCliente(cliente))
    setShowDetalles(true)
  }

  const onCloseDetalles = () => {
    dispatch(setCliente(null))
    setShowDetalles(false)
  }

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
        <ClienteDetalles user={user} reload={reload} onReload={onReload} syncNota={syncNota} onCloseDetalles={onCloseDetalles} onToastSuccessMod={onToastSuccessMod} onToastSuccessDel={onToastSuccessDel} />
      </BasicModal>

    </>

  )
}
