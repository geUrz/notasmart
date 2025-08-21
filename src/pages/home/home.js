import styles from './home.module.css'
import ProtectedRoute from '@/components/Layouts/ProtectedRoute/ProtectedRoute'
import { BasicLayout, BasicModal } from '@/layouts'
import { ErrorAccesso, Loading, Title } from '@/components/Layouts'
import { useEffect, useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { usePermissions } from '@/hooks'
import { HomeUsuario } from '@/components/Home'
import { useDispatch, useSelector } from 'react-redux'
import { selectNegocioId, selectNotaError, selectPlan } from '@/store/notas/notaSelectors'
import { fetchNotas } from '@/store/notas/notaSlice'

export default function Home() {

  const { user, loading } = useAuth()
  
  const dispatch = useDispatch()
  const negocioId = useSelector(selectNegocioId)
  const plan = useSelector(selectPlan)
  
  const { isAdmin, isSuperUser, isPremium } = usePermissions()

  const [reload, setReload] = useState(false)

  const onReload = () => setReload((prevState) => !prevState)

  const [apiError, setApiError] = useState(null)
  const [errorModalOpen, setErrorModalOpen] = useState(false)
  const error = useSelector(selectNotaError)

  const onOpenCloseErrorModal = () => setErrorModalOpen((prev) => !prev)

  useEffect(() => {
      if (error) {
        setApiError(error)
        setErrorModalOpen(true)  
      }
    }, [error])

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

        {(isAdmin || isSuperUser) &&
          <HomeUsuario
            isPremium={isPremium}
          />
        }

      </BasicLayout>

      <BasicModal title="Error de acceso" show={errorModalOpen} onClose={onOpenCloseErrorModal}>
        <ErrorAccesso apiError={apiError} onOpenCloseErrorModal={onOpenCloseErrorModal} />
      </BasicModal>

    </ProtectedRoute>

  )
}
