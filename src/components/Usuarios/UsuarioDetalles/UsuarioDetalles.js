import styles from './UsuarioDetalles.module.css'
import { IconClose, Confirm, IconKey, EditPass, IconEdit, IconDel } from '@/components/Layouts'
import { useState } from 'react'
import { BasicModal } from '@/layouts'
import axios from 'axios'
import { getValueOrDefault } from '@/helpers'
import { UsuarioEditForm } from '../UsuarioEditForm'
import { FaInfinity } from 'react-icons/fa'
import { useSelector } from 'react-redux'
import { selectUsuario } from '@/store/usuarios/usuarioSelectors'

export function UsuarioDetalles(props) {

  const { user, reload, onReload, isAdmin, isSuperUser, onCloseDetalles, onToastSuccess, toastSuccessDel } = props
  
  const usuario = useSelector(selectUsuario)
  
  const negocioId = user?.negocio_id
  
  const [showEdit, setShowEdit] = useState(false)

  const onOpenCloseEdit = () => setShowEdit((prevState) => !prevState)

  const [showEditPass, setShowEditPass] = useState(false)

  const onOpenCloseEditPass = () => setShowEditPass((prevState) => !prevState)

  const [showConfirmDel, setShowConfirmDel] = useState(false)

  const onOpenCloseConfirmDel = () => setShowConfirmDel((prevState) => !prevState)

  const handleDeleteUsuario = async () => {
    if (usuario?.id) {
      try {
        await axios.delete(`/api/usuarios/usuarios?id=${usuario?.id}`)
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

  if (usuario?.isactive === 1) {
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
              <h2>{getValueOrDefault(usuario?.nombre)}</h2>
            </div>
            <div>
              <h1>Usuario</h1>
              <h2>{getValueOrDefault(usuario?.usuario)}</h2>
            </div>
            <div>
              <h1>Nivel</h1>
              <h2>{getValueOrDefault(usuario?.nivel)}</h2>
            </div>
            {negocioId &&
              <div>
                <h1>Plan</h1>
                <h2>{getValueOrDefault(usuario?.plan)}</h2>
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
              <h2>{getValueOrDefault(usuario?.folio)}</h2>
            </div>
            <div>
              <h1>Correo</h1>
              <h2>{getValueOrDefault(usuario?.email)}</h2>
            </div>
            <div>
              <h1>Negocio</h1>
              <h2>{getValueOrDefault(usuario?.negocio_nombre)}</h2>
            </div>
            {negocioId &&
              <div>
                <h1>Folios</h1>
                <h2>
                  {usuario?.plan === 'premium' ?
                    <FaInfinity /> :
                    getValueOrDefault(usuario?.folios)
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
        <UsuarioEditForm user={user} reload={reload} onReload={onReload} isAdmin={isAdmin} isSuperUser={isSuperUser} onOpenCloseEdit={onOpenCloseEdit} onToastSuccess={onToastSuccess} />
      </BasicModal>

      <BasicModal title='Modificar contraseña' show={showEditPass} onClose={onOpenCloseEditPass}>
        <EditPass onOpenCloseEditPass={onOpenCloseEditPass} onToastSuccess={onToastSuccess} />
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
