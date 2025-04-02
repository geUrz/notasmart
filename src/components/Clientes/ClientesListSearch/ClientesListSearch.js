import { map, size } from 'lodash'
import { ListEmpty, Loading } from '@/components/Layouts'
import { FaUsers } from 'react-icons/fa'
import { BasicModal } from '@/layouts'
import { useState } from 'react'
import { ClienteDetalles } from '../ClienteDetalles'
import styles from './ClientesListSearch.module.css'
import { getValueOrDefault } from '@/helpers'

export function ClientesListSearch(props) {

  const { reload, onReload, clientes, onToastSuccessMod } = props

  const [showDetalles, setShowDetalles] = useState(false)
  const [clienteSeleccionada, setClienteSeleccionada] = useState(null)

  const onOpenDetalles = (cliente) => {
    setClienteSeleccionada(cliente)
    setShowDetalles(true)
  }

  const onCloseDetalles = () => {
    setClienteSeleccionada(null)
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
        {clienteSeleccionada && (
          <ClienteDetalles
            reload={reload}
            onReload={onReload}
            cliente={clienteSeleccionada}
            onCloseDetalles={onCloseDetalles}
            onToastSuccessMod={onToastSuccessMod}
          />
        )}
      </BasicModal>

    </>

  )
}
