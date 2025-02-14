import { FaCheck, FaEdit, FaTimes, FaTrash } from 'react-icons/fa'
import { IconClose, Confirm } from '@/components/Layouts'
import { useEffect, useState } from 'react'
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

  let isActive = ''

  if (usuario.isactive === 1) {
      isActive = 'Activo'
  } else {
      isActive = 'Inactivo'
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

      <BasicModal title='modificar usuario' show={showEdit} onClose={onOpenCloseEdit}>
        <UsuarioEditForm reload={reload} onReload={onReload} usuarioData={usuarioData} actualizarUsuario={actualizarUsuario} onOpenCloseEdit={onOpenCloseEdit} onToastSuccessMod={onToastSuccessMod} />
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
