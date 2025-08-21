import styles from './UsuariosLista.module.css'
import { useEffect, useState } from 'react'
import { map, size } from 'lodash'
import { ListEmpty, Loading } from '@/components/Layouts'
import { FaUser } from 'react-icons/fa'
import { getValueOrDefault } from '@/helpers'
import { BasicModal } from '@/layouts'
import { UsuarioDetalles } from '../UsuarioDetalles'
import { selectUsuarios } from '@/store/usuarios/usuarioSelectors'
import { useDispatch, useSelector } from 'react-redux'
import { setUsuario } from '@/store/usuarios/usuarioSlice'

export function UsuariosLista(props) {

  const { user, reload, onReload, isAdmin, isSuperUser, onToastSuccess,onToastSuccessDel } = props

  const dispatch = useDispatch()
  const usuarios = useSelector(selectUsuarios)

  const [showDetalles, setShowDetalles] = useState(false)
  const [showLoading, setShowLoading] = useState(true)

  const onOpenDetalles = (usuario) => {
    dispatch(setUsuario(usuario))
    setShowDetalles(true)
  }

  const onCloseDetalles = () => {
    dispatch(setUsuario(null))
    setShowDetalles(false)
  }

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowLoading(false)
    }, 800)

    return () => clearTimeout(timer)
  }, [])

  return (

    <>

      {!usuarios ? (
        <Loading size={45} loading={1} />
      ) : (
        size(usuarios) === 0 ? (
          <ListEmpty />
        ) : (
          <div className={styles.main}>
            {map(usuarios, (usuario) => (
              <div key={usuario.id} className={styles.section} onClick={() => onOpenDetalles(usuario)}>
                <div>
                  <div className={styles.column1}>
                    <FaUser />
                  </div>
                  <div className={styles.column2}>
                    <div>
                      <h1>Nombre</h1>
                      <h2>{getValueOrDefault(usuario?.nombre)}</h2>
                    </div>
                    <div>
                      <h1>Usuario</h1>
                      <h2>{getValueOrDefault(usuario?.usuario)}</h2>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )
      )}

      <BasicModal title='detalles del usuario' show={showDetalles} onClose={onCloseDetalles}>
        <UsuarioDetalles user={user} reload={reload} onReload={onReload} isAdmin={isAdmin} isSuperUser={isSuperUser} onCloseDetalles={onCloseDetalles} onToastSuccess={onToastSuccess} toastSuccessDel={onToastSuccessDel} />
      </BasicModal>

    </>

  )
}
