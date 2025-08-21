import styles from './Notas.module.css'
import ProtectedRoute from '@/components/Layouts/ProtectedRoute/ProtectedRoute'
import { BasicLayout, BasicModal } from '@/layouts'
import { Add, ErrorAccesso, IconClose, Loading, Search, Title, ToastDelete, ToastSuccess } from '@/components/Layouts'
import { useEffect, useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { NotaForm, NotasLista, NotasListSearch, SearchNotas } from '@/components/Notas'
import { FaArrowCircleRight, FaInfoCircle } from 'react-icons/fa'
import Link from 'next/link'
import { usePermissions } from '@/hooks'
import { useDispatch, useSelector } from 'react-redux'
import { fetchNotas } from '@/store/notas/notaSlice'
import { selectNotaError, selectTotalFolios, selectTotalNotas } from '@/store/notas/notaSelectors'

export default function Notas() {

  const { user, loading } = useAuth()
  
  const { isAdmin, isSuperUser, isPremium } = usePermissions()
  
  const [reload, setReload] = useState(false)

  const onReload = () => setReload((prevState) => !prevState)

  const [openCloseForm, setOpenCloseForm] = useState(false)

  const [showFolios, setShowFolios] = useState(false)
  
  const onOpenCloseForm = () => setOpenCloseForm((prevState) => !prevState)
  
  const [showNoNegocioId, setShowNoNegocioId] = useState(false)
  
  const onOpenShowNoNegocioId = () => setShowNoNegocioId((prevState) => !prevState)

  const onOpenShowFolios = () => setShowFolios((prevState) => !prevState)

  const [search, setSearch] = useState(false)

  const onOpenCloseSearch = () => setSearch((prevState) => !prevState)

  const [resultados, setResultados] = useState([])

  const dispatch = useDispatch()
  const totalNotas = useSelector(selectTotalNotas)
  const totalFolios = useSelector(selectTotalFolios)
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

  const onOpenCloseFormFolios = () => {
    if (!isAdmin && !user?.negocio_id) {
      onOpenShowNoNegocioId()
    } else if (!isAdmin && !isPremium && totalNotas >= totalFolios) {
      onOpenShowFolios()
    } else {
      onOpenCloseForm()
    }
  }  

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

        <Title title='notas' />

        <Add onOpenClose={onOpenCloseFormFolios} />

        <Search
          title='nota'
          search={search}
          onOpenCloseSearch={onOpenCloseSearch}
          user={user}
          reload={reload}
          onReload={onReload}
          resultados={resultados}
          setResultados={setResultados}
          SearchComponent={SearchNotas}
          SearchListComponent={NotasListSearch}
          onToastSuccess={onToastSuccess}
        />

        <NotasLista user={user} loading={loading} reload={reload} onReload={onReload} isAdmin={isAdmin} isSuperUser={isSuperUser} isPremium={isPremium} onToastSuccess={onToastSuccess} onToastSuccessDel={onToastSuccessDel} />

      </BasicLayout>

      <BasicModal title='crear nota' show={openCloseForm} onClose={onOpenCloseForm}>
        <NotaForm user={user} reload={reload} onReload={onReload} isAdmin={isAdmin} onToastSuccess={onToastSuccess} onOpenCloseForm={onOpenCloseForm} />
      </BasicModal>

      <BasicModal show={showFolios} onClose={onOpenShowFolios}>
        <IconClose onOpenClose={onOpenShowFolios} />
        <div className={styles.noFolios}>
          <FaInfoCircle />
          <h1>¡Has agotado tus folios disponibles!</h1>
          <h2>Por favor, póngase en contacto con el administrador para resolverlo.</h2>
          <Link
            href="https://api.whatsapp.com/send?phone=526861349399&text=%C2%A1Me%20interesa%20adquirir%20m%C3%A1s%20folios!"
            target="_blank"
            rel="noopener noreferrer"
          >
            <div className={styles.section2}>
              <h2>Solicitar folios</h2> 
              <FaArrowCircleRight />
            </div>
          </Link>
        </div>
      </BasicModal>

      <BasicModal show={showNoNegocioId} onClose={onOpenShowNoNegocioId}>
        <IconClose onOpenClose={onOpenShowNoNegocioId} />
        <div className={styles.noFolios}>
          <FaInfoCircle />
          <h1>¡Este usuario no tiene un negocio!</h1>
          <h2>Por favor, póngase en contacto con el administrador para resolverlo.</h2>
        </div>
      </BasicModal>

      <BasicModal title="Error de acceso" show={errorModalOpen} onClose={onOpenCloseErrorModal}>
        <ErrorAccesso apiError={apiError} />
      </BasicModal>

    </ProtectedRoute>

  )
}
