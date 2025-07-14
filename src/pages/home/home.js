import ProtectedRoute from '@/components/Layouts/ProtectedRoute/ProtectedRoute'
import { BasicLayout, BasicModal } from '@/layouts'
import { ErrorAccesso, Loading, Title } from '@/components/Layouts'
import { useEffect, useState } from 'react'
import axios from 'axios'
import { useAuth } from '@/contexts/AuthContext'
import styles from './home.module.css'
import { usePermissions } from '@/hooks'
import { HomeAdmin, HomeUsuario } from '@/components/Home'
import { useDispatch, useSelector } from 'react-redux'
import { selectNegocioId, selectPlan, selectPorCobrarTotalGlobal, selectPorCobrarTotalNgId, selectPrecioGranTotalGlobal, selectPrecioGranTotalNgId, selectPrecioProductoBaseTotalGlobal, selectPrecioProductoBaseTotalNgId, selectTotalFoliosNgId, selectTotalNotasGlobal, selectTotalNotasNgId } from '@/store/notas/notaSelectors'
import { fetchNotas } from '@/store/notas/notaSlice'

export default function Home() {

  const { user, loading } = useAuth()

  const dispatch = useDispatch()
  const negocioId = useSelector(selectNegocioId)
  const plan = useSelector(selectPlan)
  
  
  const { isUserActive, isAdmin, isUserSuperUser, isPremium } = usePermissions()

  const [reload, setReload] = useState(false)

  const onReload = () => setReload((prevState) => !prevState)

  const [apiError, setApiError] = useState(null)
  const [errorModalOpen, setErrorModalOpen] = useState(false)

  const onOpenCloseErrorModal = () => setErrorModalOpen((prev) => !prev)

  useEffect(() => {
    if (!user) return
    dispatch(fetchNotas(user?.negocio_id))
  }, [dispatch, user, reload])  

  if (loading) {
    return <Loading size={45} loading={'L'} />
  }
  
  return (

    <ProtectedRoute>

      <BasicLayout relative onReload={onReload} negocioId={negocioId} plan={plan}>

        <Title title='home' />

        {isUserActive && (
          isAdmin ? (
            <HomeAdmin />
          ) : isUserSuperUser ? (
            <HomeUsuario
              isPremium={isPremium}
            />
          ) : null
        )}

      </BasicLayout>

      <BasicModal title="Error de acceso" show={errorModalOpen} onClose={onOpenCloseErrorModal}>
        <ErrorAccesso apiError={apiError} onOpenCloseErrorModal={onOpenCloseErrorModal} />
      </BasicModal>

    </ProtectedRoute>

  )
}
