import { IconClose, Confirm, IconDel, IconEdit, ErrorAccesso } from '@/components/Layouts'
import { useEffect, useMemo, useState } from 'react'
import { BasicModal } from '@/layouts'
import { ClienteEditForm } from '../ClienteEditForm'
import axios from 'axios'
import { getValueOrDefault } from '@/helpers'
import styles from './ClienteDetalles.module.css'
import { usePermissions } from '@/hooks'
import { selectCliente } from '@/store/clientes/clienteSelectors'
import { useDispatch, useSelector } from 'react-redux'
import { fetchClientes, setCliente } from '@/store/clientes/clienteSlice'

export function ClienteDetalles(props) {

  const { user, reload, onReload, syncNota, onCloseDetalles, onToastSuccessMod, onToastSuccessDel } = props
  
  const dispatch = useDispatch()
  const cliente = useSelector(selectCliente)
  
  const {isAdmin, isUserSuperUser} = usePermissions()

  const [showEdit, setShowEdit] = useState(false)

  const onOpenCloseEdit = () => setShowEdit((prevState) => !prevState)

  const [showConfirmDel, setShowConfirmDel] = useState(false)
  const onOpenCloseConfirmDel = () => setShowConfirmDel((prevState) => !prevState)

  const [apiError, setApiError] = useState(null)
  const [errorModalOpen, setErrorModalOpen] = useState(false)

  const onOpenCloseErrorModal = () => setErrorModalOpen((prev) => !prev)

  const handleDeleteCliente = async () => {

    if (!cliente?.id) {
      console.error("Cliente o ID no disponible");
      return;
    }

    try {
      await axios.delete(`/api/clientes/clientes?id=${cliente.id}`)

      dispatch(fetchClientes(user.negocio_id))
      dispatch(setCliente(null))

      syncNota()

      onReload()
      onToastSuccessDel()
      onCloseDetalles()
    } catch (error) {
      console.error(error)
      setApiError(error.response?.data?.error || 'Error al cargar clientes')
      setErrorModalOpen(true)
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
              <h2>{getValueOrDefault(cliente?.cliente)}</h2>
            </div>
            <div>
              <h1>Contacto</h1>
              <h2>{getValueOrDefault(cliente?.contacto)}</h2>
            </div>
            <div>
              <h1>Dirección</h1>
              <h2>{getValueOrDefault(cliente?.direccion)}</h2>
            </div>
          </div>
          <div className={styles.box1_2}>
            <div>
              <h1>Folio</h1>
              <h2>{getValueOrDefault(cliente?.folio)}</h2>
            </div>
            <div>
              <h1>Cel</h1>
              <h2>{getValueOrDefault(cliente?.cel)}</h2>
            </div>
            <div>
              <h1>Email</h1>
              <h2>{getValueOrDefault(cliente?.email)}</h2>
            </div>
          </div>
        </div>

        <IconEdit onOpenEdit={onOpenCloseEdit} />

        {(isAdmin || isUserSuperUser) &&
          <IconDel setShowConfirmDel={onOpenCloseConfirmDel} />
        }

        {isAdmin &&
          <div className={styles.h1UsuarioNombre}>
            <h1>Creado por: {getValueOrDefault(cliente?.usuario_nombre)}</h1>
          </div>
        }

      </div>

      <BasicModal title='modificar cliente' show={showEdit} onClose={onOpenCloseEdit}>
        <ClienteEditForm user={user} reload={reload} onReload={onReload} onOpenCloseEdit={onOpenCloseEdit} onToastSuccessMod={onToastSuccessMod} />
      </BasicModal>

      <BasicModal title="Error de acceso" show={errorModalOpen} onClose={onOpenCloseErrorModal}>
        <ErrorAccesso apiError={apiError} onOpenCloseErrorModal={onOpenCloseErrorModal} />
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
