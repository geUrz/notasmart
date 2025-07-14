import { IconClose, Confirm, IconKey, EditPass, IconEdit, IconDel } from '@/components/Layouts'
import { useEffect, useState } from 'react'
import { BasicModal } from '@/layouts'
import axios from 'axios'
import { getValueOrDefault } from '@/helpers'
import styles from './UsuarioDetalles.module.css'
import { UsuarioEditForm } from '../UsuarioEditForm'
import { FaInfinity } from 'react-icons/fa'

export function UsuarioDetalles(props) {

  const { user, reload, onReload, isAdmin, isSuperUser, usuario, onCloseDetalles, onToastSuccess, onToastSuccessMod, toastSuccessDel } = props

  const negocioId = user.negocio_id
  
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
              <h1>Nivel</h1>
              <h2>{getValueOrDefault(usuarioData?.nivel)}</h2>
            </div>
            {negocioId &&
              <div>
                <h1>Plan</h1>
                <h2>{getValueOrDefault(usuarioData?.plan)}</h2>
              </div>
            }
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
              <h1>Negocio</h1>
              <h2>{getValueOrDefault(usuarioData?.negocio_nombre)}</h2>
            </div>
            {negocioId &&
              <div>
                <h1>Folios</h1>
                <h2>
                  {usuarioData?.plan === 'premium' ?
                    <FaInfinity /> :
                    getValueOrDefault(usuarioData?.folios)
                  }
                </h2>
              </div>
            }
          </div>
        </div>

        {(isAdmin || isSuperUser) &&

          <>

            <IconKey onOpenCloseEditPass={onOpenCloseEditPass} />

            <IconEdit onOpenEdit={onOpenCloseEdit} />

            <IconDel setShowConfirmDel={onOpenCloseConfirmDel} />

          </>

        }

      </div>

      <BasicModal title='modificar usuario' show={showEdit} onClose={onOpenCloseEdit}>
        <UsuarioEditForm user={user} reload={reload} onReload={onReload} isAdmin={isAdmin} isSuperUser={isSuperUser} usuarioData={usuarioData} actualizarUsuario={actualizarUsuario} onOpenCloseEdit={onOpenCloseEdit} onToastSuccess={onToastSuccess} onToastSuccessMod={onToastSuccessMod} />
      </BasicModal>

      <BasicModal title='Modificar contraseña' show={showEditPass} onClose={onOpenCloseEditPass}>
        <EditPass usuario={usuario} onOpenCloseEditPass={onOpenCloseEditPass} onToastSuccessUsuarioMod={onToastSuccessMod} />
      </BasicModal>

      <Confirm
        open={showConfirmDel}
        onConfirm={handleDeleteUsuario}
        onCancel={onOpenCloseConfirmDel}
        content='¿ Estas seguro de eliminar el usuario ?'
      />

    </>

  )
}
