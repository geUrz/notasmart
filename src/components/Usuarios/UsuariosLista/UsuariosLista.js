import { useEffect, useState } from 'react'
import { map, size } from 'lodash'
import { ListEmpty, Loading } from '@/components/Layouts'
import { FaUser } from 'react-icons/fa'
import { getValueOrDefault } from '@/helpers'
import { BasicModal } from '@/layouts'
import { UsuarioDetalles } from '../UsuarioDetalles'
import styles from './UsuariosLista.module.css'

export function UsuariosLista(props) {

  const { user, reload, onReload, usuarios, onToastSuccess, onToastSuccessMod, onToastSuccessDel } = props

  const [showDetalles, setShowDetalles] = useState(false)
  const [usuarioSeleccionado, setUsuarioSeleccionado] = useState(null)
  const [showLoading, setShowLoading] = useState(true)

  const onOpenDetalles = (usuario) => {
    setUsuarioSeleccionado(usuario)
    setShowDetalles(true)
  }

  const onCloseDetalles = () => {
    setUsuarioSeleccionado(null)
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
        <UsuarioDetalles reload={reload} onReload={onReload} usuario={usuarioSeleccionado} onCloseDetalles={onCloseDetalles} onToastSuccessMod={onToastSuccessMod} onToastSuccessDel={onToastSuccessDel} />
      </BasicModal>

    </>

  )
}
