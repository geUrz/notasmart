import styles from './UsuariosListSearch.module.css'
import { map, size } from 'lodash'
import { ListEmpty, Loading } from '@/components/Layouts'
import { FaUsers } from 'react-icons/fa'
import { BasicModal } from '@/layouts'
import { useEffect, useState } from 'react'
import { UsuarioDetalles } from '../UsuarioDetalles'
import { getStatusClass } from '@/helpers/getStatusClass/getStatusClass'
import { useDispatch, useSelector } from 'react-redux'
import { clearSearchResults, searchUsuarios, setUsuario } from '@/store/usuarios/usuarioSlice'
import { selectSearchResults } from '@/store/usuarios/usuarioSelectors'

export function UsuariosListSearch(props) {

  const { user, reload, onReload, isAdmin, isSuperUser, query, onToastSuccess } = props

  const dispatch = useDispatch()
  const usuarios = useSelector(selectSearchResults)

  const [showDetalles, setShowDetalles] = useState(false)

  const onOpenDetalles = (usuario) => {
    dispatch(setUsuario(usuario))
    setShowDetalles(true)
  }

  const onCloseDetalles = () => {
    dispatch(setUsuario(null))
    setShowDetalles(false)
  }

  useEffect(() => {
      if (query.trim().length > 0) {
        dispatch(searchUsuarios(query))
      }
    }, [query, dispatch])
  
    useEffect(() => {
      return () => {
        dispatch(clearSearchResults())
      }
    }, [dispatch])

  return (

    <>

      {!usuarios ? (
        <Loading size={45} loading={1} />
      ) : (
        size(usuarios) === 0 ? (
          <ListEmpty />
        ) : (
          <div className={styles.main}>
            {map(usuarios, (usuario) => {
              const statusClass = getStatusClass(usuario.estado)

              return (
                <div key={usuario.id} className={styles.section} onClick={() => onOpenDetalles(usuario)}>
                  <div className={`${styles[statusClass]}`}>
                    <div className={styles.column1}>
                      <FaUsers />
                    </div>
                    <div className={styles.column2}>
                      <div >
                        <h1>Nombre</h1>
                        <h2>{usuario.nombre}</h2>
                      </div>
                      <div >
                        <h1>Usuario</h1>
                        <h2>{usuario.usuario}</h2>
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )
      )}

      <BasicModal title='detalles del usuario' show={showDetalles} onClose={onCloseDetalles}>
        <UsuarioDetalles
          user={user}
          reload={reload}
          onReload={onReload}
          isAdmin={isAdmin}
          isSuperUser={isSuperUser}
          onCloseDetalles={onCloseDetalles}
          onToastSuccess={onToastSuccess}
        />
      </BasicModal>

    </>

  )
}
