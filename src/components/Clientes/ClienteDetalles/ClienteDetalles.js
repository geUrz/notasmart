import { FaCheck, FaEdit, FaTimes, FaTrash } from 'react-icons/fa'
import { IconClose, Confirm } from '@/components/Layouts'
import { useState } from 'react'
import { BasicModal } from '@/layouts'
import { ClienteEditForm } from '../ClienteEditForm'
import { useAuth } from '@/contexts/AuthContext'
import axios from 'axios'
import { getValueOrDefault } from '@/helpers'
import styles from './ClienteDetalles.module.css'

export function ClienteDetalles(props) {

  const { reload, onReload, cliente, onCloseDetalles, onToastSuccessMod, toastSuccessDel } = props

  const { user } = useAuth()

  const [showEdit, setShowEdit] = useState(false)

  const onOpenCloseEdit = () => setShowEdit((prevState) => !prevState)

  const [showConfirmDel, setShowConfirmDel] = useState(false)

  const onOpenCloseConfirmDel = () => setShowConfirmDel((prevState) => !prevState)

  const handleDeleteCliente = async () => {
    if (cliente?.id) {
      try {
        await axios.delete(`/api/clientes/clientes?id=${cliente.id}`)
        onReload()
        toastSuccessDel()
        onCloseDetalles()
      } catch (error) {
        console.error('Error al eliminar la cliente:', error)
      }
    } else {
      console.error('Incidencia o ID no disponible')
    }
  }

  return (

    <>

      <IconClose onOpenClose={onCloseDetalles} />

      <div className={styles.section}>
        <div className={styles.box1}>
          <div className={styles.box1_1}>
            <div>
              <h1>Cliente</h1>
              <h2>{getValueOrDefault(cliente.cliente)}</h2>
            </div>
            <div>
              <h1>Contacto</h1>
              <h2>{getValueOrDefault(cliente.contacto)}</h2>
            </div>
            <div>
              <h1>Dirección</h1>
              <h2>{getValueOrDefault(cliente.direccion)}</h2>
            </div>
          </div>
          <div className={styles.box1_2}>
            <div>
              <h1>Folio</h1>
              <h2>{getValueOrDefault(cliente.folio)}</h2>
            </div>
            <div>
              <h1>Cel</h1>
              <h2>{getValueOrDefault(cliente.cel)}</h2>
            </div>
            <div>
              <h1>Email</h1>
              <h2>{getValueOrDefault(cliente.email)}</h2>
            </div>
          </div>
        </div>

        <div className={styles.iconEdit}>
          <div onClick={onOpenCloseEdit}>
            <FaEdit />
          </div>
        </div>

        {user.nivel === 'admin' ?
          <div className={styles.iconDel}>
            <div>
              <FaTrash onClick={onOpenCloseConfirmDel} />
            </div>
          </div> : null
        }

      </div>

      <BasicModal title='modificar cliente' show={showEdit} onClose={onOpenCloseEdit}>
        <ClienteEditForm reload={reload} onReload={onReload} cliente={cliente} onOpenCloseEdit={onOpenCloseEdit} onToastSuccessMod={onToastSuccessMod} />
      </BasicModal>

      <Confirm
        open={showConfirmDel}
        cancelButton={
          <div className={styles.iconClose}>
            <FaTimes />
          </div>
        }
        confirmButton={
          <div className={styles.iconCheck}>
            <FaCheck />
          </div>
        }
        onConfirm={handleDeleteCliente}
        onCancel={onOpenCloseConfirmDel}
        content='¿ Estas seguro de eliminar el cliente ?'
      />

    </>

  )
}
