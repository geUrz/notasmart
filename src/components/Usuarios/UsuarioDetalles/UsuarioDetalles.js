import { FaCheck, FaEdit, FaTimes, FaTrash } from 'react-icons/fa'
import { IconClose, Confirm, IconKey, EditPass, IconEdit } from '@/components/Layouts'
import { useEffect, useMemo, useState } from 'react'
import { BasicModal } from '@/layouts'
import { useAuth } from '@/contexts/AuthContext'
import axios from 'axios'
import { getValueOrDefault } from '@/helpers'
import styles from './UsuarioDetalles.module.css'
import { UsuarioEditForm } from '../UsuarioEditForm'

export function UsuarioDetalles(props) {

  const { reload, onReload, usuario, onCloseDetalles, onToastSuccessMod, toastSuccessDel } = props

  const { user } = useAuth()

  const [showEdit, setShowEdit] = useState(false)

  const onOpenCloseEdit = () => setShowEdit((prevState) => !prevState)

  const [showEditPass, setShowEditPass] = useState(false)

  const onOpenCloseEditPass = () => setShowEditPass((prevState) => !prevState)

  const [showConfirmDel, setShowConfirmDel] = useState(false)

  const onOpenCloseConfirmDel = () => setShowConfirmDel((prevState) => !prevState)

  const handleDeleteUsuario = async () => {
    if (usuario?.id) {
      try {
        await axios.delete(`/api/usuarios/usuarios?id=${usuario.id}`)
        onReload()
        toastSuccessDel()
        onCloseDetalles()
      } catch (error) {
        console.error('Error al eliminar la usuario:', error)
      }
    } else {
      console.error('Uusario o ID no disponible')
    }
  }

  const [usuarioData, setUsuarioData] = useState(usuario)

  useEffect(() => {
    setUsuarioData(usuario)
  }, [usuario])

  const actualizarUsuario = (nuevaData) => {
    setUsuarioData((prevState) => ({
      ...prevState,
      ...nuevaData,
    }))
  }

  let isActive = ''

  if (usuarioData.isactive === 1) {
    isActive = 'Activo'
  } else {
    isActive = 'Inactivo'
  }

  const permissions = useMemo(() => {

    if (!usuario) return {}

    return {

      showAdmin: ['admin'].includes(user.nivel),

    }

  }, [user])

  return (

    <>

      <IconClose onOpenClose={onCloseDetalles} />

      <div className={styles.section}>
        <div className={styles.box1}>
          <div className={styles.box1_1}>
            <div>
              <h1>Nombre</h1>
              <h2>{getValueOrDefault(usuarioData?.nombre)}</h2>
            </div>
            <div>
              <h1>Usuario</h1>
              <h2>{getValueOrDefault(usuarioData?.usuario)}</h2>
            </div>
            <div>
              <h1>Folios</h1>
              <h2>{getValueOrDefault(usuarioData?.folios)}</h2>
            </div>
            <div>
              <h1>Activo</h1>
              <h2>{isActive}</h2>
            </div>
          </div>
          <div className={styles.box1_2}>
            <div>
              <h1>Folio</h1>
              <h2>{getValueOrDefault(usuarioData?.folio)}</h2>
            </div>
            <div>
              <h1>Correo</h1>
              <h2>{getValueOrDefault(usuarioData?.email)}</h2>
            </div>
            <div>
              <h1>Nivel</h1>
              <h2>{getValueOrDefault(usuarioData?.nivel)}</h2>
            </div>
          </div>
        </div>

        {permissions.showAdmin &&

          <>

            <IconKey usuario={usuario} onOpenCloseEditPass={onOpenCloseEditPass} />

            <IconEdit onOpenEdit={onOpenCloseEdit} />

          </>

        }

      </div>

      <BasicModal title='modificar usuario' show={showEdit} onClose={onOpenCloseEdit}>
        <UsuarioEditForm reload={reload} onReload={onReload} usuarioData={usuarioData} actualizarUsuario={actualizarUsuario} onOpenCloseEdit={onOpenCloseEdit} onToastSuccessMod={onToastSuccessMod} />
      </BasicModal>

      <BasicModal title='Modificar contraseña' show={showEditPass} onClose={onOpenCloseEditPass}>
        <EditPass usuario={usuario} onOpenCloseEditPass={onOpenCloseEditPass} onToastSuccessUsuarioMod={onToastSuccessMod} />
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
        onConfirm={handleDeleteUsuario}
        onCancel={onOpenCloseConfirmDel}
        content='¿ Estas seguro de eliminar el usuario ?'
      />

    </>

  )
}
