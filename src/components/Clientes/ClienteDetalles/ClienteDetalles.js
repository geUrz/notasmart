import { FaCheck, FaEdit, FaTimes, FaTrash } from 'react-icons/fa'
import { IconClose, Confirm, IconDel, IconEdit } from '@/components/Layouts'
import { useEffect, useMemo, useState } from 'react'
import { BasicModal } from '@/layouts'
import { ClienteEditForm } from '../ClienteEditForm'
import { useAuth } from '@/contexts/AuthContext'
import axios from 'axios'
import { getValueOrDefault } from '@/helpers'
import styles from './ClienteDetalles.module.css'

export function ClienteDetalles(props) {

  const { reload, onReload, cliente, onCloseDetalles, onToastSuccessMod, onToastSuccessDel } = props

  const { user } = useAuth()

  const [showEdit, setShowEdit] = useState(false)

  const onOpenCloseEdit = () => setShowEdit((prevState) => !prevState)

  const [showConfirmDel, setShowConfirmDel] = useState(false)
  const onOpenCloseConfirmDel = () => setShowConfirmDel((prevState) => !prevState)

  const handleDeleteCliente = async () => {

    if (!cliente?.id) {
      console.error("Cliente o ID no disponible");
      return;
    }

    try {
      await axios.delete(`/api/clientes/clientes?id=${cliente.id}`)
      onReload()
      onToastSuccessDel()
      onCloseDetalles()
    } catch (error) {
      console.error('Error al eliminar la cliente:', error)
    }
  }

  const [clienteData, setClienteData] = useState(cliente)

  useEffect(() => {
    setClienteData(cliente)
  }, [cliente])

  const actualizarCliente = (nuevaData) => {
    setClienteData((prevState) => ({
      ...prevState,
      ...nuevaData,
    }))
  }

  const permissions = useMemo(() => {

    if (!user) return {}

    return {
      showAdmin: user?.nivel === 'admin',
      showAdminUsr: user?.id === cliente.usuario_id || user?.nivel === 'admin'
    }

  }, [user])

  return (

    <>

      <IconClose onOpenClose={onCloseDetalles} />

      <div className={styles.section}>
        <div className={styles.box1}>
          <div className={styles.box1_1}>
            <div>
              <h1>Cliente</h1>
              <h2>{getValueOrDefault(clienteData?.cliente)}</h2>
            </div>
            <div>
              <h1>Contacto</h1>
              <h2>{getValueOrDefault(clienteData?.contacto)}</h2>
            </div>
            <div>
              <h1>Dirección</h1>
              <h2>{getValueOrDefault(clienteData?.direccion)}</h2>
            </div>
          </div>
          <div className={styles.box1_2}>
            <div>
              <h1>Folio</h1>
              <h2>{getValueOrDefault(clienteData?.folio)}</h2>
            </div>
            <div>
              <h1>Cel</h1>
              <h2>{getValueOrDefault(clienteData?.cel)}</h2>
            </div>
            <div>
              <h1>Email</h1>
              <h2>{getValueOrDefault(clienteData?.email)}</h2>
            </div>
          </div>
        </div>

        <IconEdit onOpenEdit={onOpenCloseEdit} />

        {permissions.showAdminUsr &&
          <IconDel setShowConfirmDel={onOpenCloseConfirmDel} />
        }

        {permissions.showAdmin &&
          <div className={styles.h1UsuarioNombre}>
            <h1>{getValueOrDefault(clienteData?.usuario_nombre)}</h1>
          </div>
        }

      </div>

      <BasicModal title='modificar cliente' show={showEdit} onClose={onOpenCloseEdit}>
        <ClienteEditForm reload={reload} onReload={onReload} clienteData={clienteData} actualizarCliente={actualizarCliente} onOpenCloseEdit={onOpenCloseEdit} onToastSuccessMod={onToastSuccessMod} />
      </BasicModal>

      <Confirm
        open={showConfirmDel}
        onConfirm={handleDeleteCliente}
        onCancel={onOpenCloseConfirmDel}
        content='¿ Estas seguro de eliminar el cliente ?'
      />

    </>

  )
}
