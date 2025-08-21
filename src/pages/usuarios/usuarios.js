import styles from './usuarios.module.css'
import { Add, ErrorAccesso, Loading, Search, Title, ToastDelete, ToastSuccess } from '@/components/Layouts'
import ProtectedRoute from '@/components/Layouts/ProtectedRoute/ProtectedRoute'
import { SearchUsuarios, UsuarioForm, UsuariosLista, UsuariosListSearch } from '@/components/Usuarios'
import { useAuth } from '@/contexts/AuthContext'
import { BasicLayout, BasicModal } from '@/layouts'
import React, { useEffect, useState } from 'react'
import { usePermissions } from '@/hooks'
import { useDispatch, useSelector } from 'react-redux'
import { selectUsuariosError } from '@/store/usuarios/usuarioSelectors'
import { fetchUsuarios } from '@/store/usuarios/usuarioSlice'

export default function Usuarios() {

  const { user, loading } = useAuth()

  const { isAdmin, isSuperUser } = usePermissions()

  const [reload, setReload] = useState(false)

  const onReload = () => setReload((prevState) => !prevState)

  const [openCloseForm, setOpenCloseForm] = useState(false)

  const onOpenCloseForm = () => setOpenCloseForm((prevState) => !prevState)

  const [search, setSearch] = useState(false)

  const onOpenCloseSearch = () => setSearch((prevState) => !prevState)

  const [resultados, setResultados] = useState([])

  const [apiError, setApiError] = useState(null)
  const [errorModalOpen, setErrorModalOpen] = useState(false)
  const error = useSelector(selectUsuariosError)

  const onOpenCloseErrorModal = () => setErrorModalOpen((prev) => !prev)

  const dispatch = useDispatch()

  useEffect(() => {
    if (error) {
      setApiError(error)
      setErrorModalOpen(true)  
    }
  }, [error])

  useEffect(() => {
    if (!user) return
    dispatch(fetchUsuarios(user?.negocio_id))
  }, [dispatch, reload, user])  

  const [toastSuccess, setToastSuccessReportes] = useState(false)
  const [toastSuccessDel, setToastSuccessReportesDel] = useState(false)

  const onToastSuccess = () => {
    setToastSuccessReportes(true)
    setTimeout(() => {
      setToastSuccessReportes(false)
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

        {toastSuccess && <ToastSuccess onClose={() => setToastSuccessReportes(false)} />}

        {toastSuccessDel && <ToastDelete onClose={() => setToastSuccessReportesDel(false)} />}

        <Title title='usuarios' />

        <Add onOpenClose={onOpenCloseForm} />

        <Search
          title='usuario'
          search={search}
          onOpenCloseSearch={onOpenCloseSearch}
          user={user}
          reload={reload}
          onReload={onReload}
          isAdmin={isAdmin} 
          isSuperUser={isSuperUser}
          resultados={resultados}
          setResultados={setResultados}
          SearchComponent={SearchUsuarios}
          SearchListComponent={UsuariosListSearch}
          onToastSuccess={onToastSuccess}
        />

        <UsuariosLista user={user} loading={loading} reload={reload} onReload={onReload} isAdmin={isAdmin} isSuperUser={isSuperUser} onToastSuccess={onToastSuccess} onToastSuccessDel={onToastSuccessDel} />

      </BasicLayout>

      <BasicModal title='crear usuario' show={openCloseForm} onClose={onOpenCloseForm}>
        <UsuarioForm user={user} reload={reload} isAdmin={isAdmin} onReload={onReload} onToastSuccess={onToastSuccess} onOpenCloseForm={onOpenCloseForm} />
      </BasicModal>

      <BasicModal title="Error de acceso" show={errorModalOpen} onClose={onOpenCloseErrorModal}>
        <ErrorAccesso apiError={apiError} onOpenCloseErrorModal={onOpenCloseErrorModal} />
      </BasicModal>

    </ProtectedRoute>

  )
}
