import { Add, ErrorAccesso, Loading, Title, ToastDelete, ToastSuccess } from '@/components/Layouts'
import ProtectedRoute from '@/components/Layouts/ProtectedRoute/ProtectedRoute'
import { SearchUsuarios, UsuarioForm, UsuariosLista, UsuariosListSearch } from '@/components/Usuarios'
import { useAuth } from '@/contexts/AuthContext'
import { BasicLayout, BasicModal } from '@/layouts'
import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { FaSearch } from 'react-icons/fa'
import styles from './usuarios.module.css'
import { usePermissions } from '@/hooks'

export default function Usuarios() {

  const { user, loading } = useAuth()
  
  const {isAdmin, isUserSuperUser} = usePermissions()

  const [reload, setReload]  = useState(false)

  const onReload = () => setReload((prevState) => !prevState)

  const [openCloseForm, setOpenCloseForm] = useState(false)

  const onOpenCloseForm = () => setOpenCloseForm((prevState) => !prevState)

  const [search, setSearch] = useState(false)
  
  const onOpenCloseSearch = () => setSearch((prevState) => !prevState)
  
  const [resultados, setResultados] = useState([])

  const [apiError, setApiError] = useState(null)
  const [errorModalOpen, setErrorModalOpen] = useState(false)

  const onOpenCloseErrorModal = () => setErrorModalOpen((prev) => !prev)

  const [usuarios, setUsuarios] = useState(null)
  
  useEffect(() => {

    if(!user) return
    
    (async () => {
      try {

        const url = isAdmin || !user.negocio_id
        ? '/api/usuarios/usuarios'
        : `/api/usuarios/usuarios?negocio_id=${user?.negocio_id}`

        const res = await axios.get(url)
        setUsuarios(res.data)
      } catch (error) {
        console.error(error)
        setApiError(error.response?.data?.error || 'Error al cargar usuarios')
        setErrorModalOpen(true)
      }
    })()
  }, [reload, user])

  const [toastSuccess, setToastSuccessReportes] = useState(false)
  const [toastSuccessMod, setToastSuccessReportesMod] = useState(false)
  const [toastSuccessDel, setToastSuccessReportesDel] = useState(false)

  const onToastSuccess = () => {
    setToastSuccessReportes(true)
    setTimeout(() => {
      setToastSuccessReportes(false)
    }, 3000)
  }

  const onToastSuccessMod = () => {
    setToastSuccessReportesMod(true)
    setTimeout(() => {
      setToastSuccessReportesMod(false)
    }, 3000)
  }

  const onToastSuccessDel = () => {
    setToastSuccessReportesDel(true)
    setTimeout(() => {
      setToastSuccessReportesDel(false)
    }, 3000)
  }

  if (loading) {
    return <Loading size={45} loading={'L'} />
  }

  return (

    <ProtectedRoute>

      <BasicLayout relative onReload={onReload}>

        {toastSuccess && <ToastSuccess contain='Creado exitosamente' onClose={() => setToastSuccessReportes(false)} />}

        {toastSuccessMod && <ToastSuccess contain='Modificado exitosamente' onClose={() => setToastSuccessReportesMod(false)} />}

        {toastSuccessDel && <ToastDelete contain='Eliminado exitosamente' onClose={() => setToastSuccessReportesDel(false)} />}

        <Title title='usuarios' />

        <Add onOpenClose={onOpenCloseForm} />

        {!search ? (
          ''
        ) : (
          <div className={styles.searchMain}>
            <SearchUsuarios user={user} onResults={setResultados} reload={reload} onReload={onReload} isAdmin={isAdmin} isUserSuperUser={isUserSuperUser} onToastSuccessMod={onToastSuccessMod} onOpenCloseSearch={onOpenCloseSearch} />
            {resultados.length > 0 && (
              <UsuariosListSearch visitas={resultados} reload={reload} onReload={onReload} />
            )}
          </div>
        )}

        {!search ? (
          <div className={styles.iconSearchMain}>
            <div className={styles.iconSearch} onClick={onOpenCloseSearch}>
              <h1>Buscar usuario</h1>
              <FaSearch />
            </div>
          </div>
        ) : (
          ''
        )}

        <UsuariosLista user={user} loading={loading} reload={reload} onReload={onReload} isAdmin={isAdmin} isUserSuperUser={isUserSuperUser} usuarios={usuarios} setUsuarios={setUsuarios} onToastSuccessMod={onToastSuccessMod} onToastSuccess={onToastSuccess} onToastSuccessDel={onToastSuccessDel} />

      </BasicLayout>

      <BasicModal title='crear usuario' show={openCloseForm} onClose={onOpenCloseForm}>
        <UsuarioForm user={user} reload={reload} onReload={onReload} onToastSuccess={onToastSuccess} onOpenCloseForm={onOpenCloseForm} />
      </BasicModal>

      <BasicModal title="Error de acceso" show={errorModalOpen} onClose={onOpenCloseErrorModal}>
        <ErrorAccesso apiError={apiError} onOpenCloseErrorModal={onOpenCloseErrorModal} />
      </BasicModal>

    </ProtectedRoute>

  )
}
