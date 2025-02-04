import { BasicModal } from '@/layouts'
import { Loading, Title } from '@/components/Layouts'
import { useAuth } from '@/contexts/AuthContext'
import { FaEdit, FaUser } from 'react-icons/fa'
import { Button } from 'semantic-ui-react'
import { useState } from 'react'
import ProtectedRoute from '@/components/Layouts/ProtectedRoute/ProtectedRoute'
import { ModCuentaForm } from '@/components/Usuario'
import styles from './usuario.module.css'

export default function Usuario() {

  const [show, setShow] = useState(false)

  const onOpenClose = () => setShow((prevState) => !prevState)

  const { user, logout, loading } = useAuth()

  if (loading) {
    <Loading size={45} loading={1} />
  }

  return (

    <ProtectedRoute>

      <Title title='Usuario' iconBack />

        <div className={styles.main}>
          <div className={styles.section}>
            <FaUser />
            
            {user && user.usuario ?
              <>
                <h1>{user.usuario}</h1>
                <h2>Nombre: {user.nombre}</h2>
                <h2>Correo: {user.email}</h2>
                <h2>Nivel: {user.nivel}</h2>
                <h2>Folios: {user.folios}</h2>
              </> : null
            }

            <div className={styles.iconEdit}>
              <div onClick={onOpenClose}>
                <FaEdit />
              </div>
            </div>

            <Button negative onClick={logout}>
              Cerrar sesión
            </Button>
          </div>
        </div>

        <BasicModal title='modificar usuario' show={show} onClose={onOpenClose}>
          <ModCuentaForm onOpenClose={onOpenClose} />
        </BasicModal>

    </ProtectedRoute>

  )
}
