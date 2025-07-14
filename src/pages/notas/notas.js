import ProtectedRoute from '@/components/Layouts/ProtectedRoute/ProtectedRoute'
import { BasicLayout, BasicModal } from '@/layouts'
import { Add, ErrorAccesso, IconClose, Loading, Search, Title, ToastDelete, ToastSuccess } from '@/components/Layouts'
import { useEffect, useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { NotaForm, NotasLista, NotasListSearch, SearchNotas } from '@/components/Notas'
import styles from './Notas.module.css'
import { FaArrowCircleRight, FaInfoCircle, FaSearch } from 'react-icons/fa'
import Link from 'next/link'
import { usePermissions } from '@/hooks'
import { useDispatch, useSelector } from 'react-redux'
import { fetchNotas } from '@/store/notas/notaSlice'
import { selectNotaError, selectTotalFoliosNgId, selectTotalNotasNgId } from '@/store/notas/notaSelectors'

export default function Notas() {

  const { user, loading } = useAuth()

  const { isAdmin, isSuperUser, isPremium } = usePermissions()

  const [reload, setReload] = useState(false)

  const onReload = () => setReload((prevState) => !prevState)

  const [openCloseForm, setOpenCloseForm] = useState(false)

  const [showFolios, setShowFolios] = useState(false)

  const onOpenCloseForm = () => setOpenCloseForm((prevState) => !prevState)

  const onOpenShowFolios = () => setShowFolios((prevState) => !prevState)

  const [search, setSearch] = useState(false)

  const onOpenCloseSearch = () => setSearch((prevState) => !prevState)

  const [resultados, setResultados] = useState([])

  const dispatch = useDispatch()
  const totalNotasNgId = useSelector(selectTotalNotasNgId)
  const totalFoliosNgId = useSelector(selectTotalFoliosNgId)
  const errorNotas = useSelector(selectNotaError)

  useEffect(() => {
    if (!user) return
    dispatch(fetchNotas(user?.negocio_id))
  }, [dispatch, user, reload])

  const onOpenCloseFormFolios = () => {
    if (!isAdmin && !isPremium && totalNotasNgId >= totalFoliosNgId) {
      onOpenShowFolios()
    } else {
      onOpenCloseForm()
    }
  }

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

        {toastSuccess && <ToastSuccess onClose={() => setToastSuccessReportes(false)} />}

        {toastSuccessMod && <ToastSuccess onClose={() => setToastSuccessReportesMod(false)} />}

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
          onToastSuccessMod={onToastSuccessMod}
        />

        <NotasLista user={user} loading={loading} reload={reload} onReload={onReload} isAdmin={isAdmin} isSuperUser={isSuperUser} isPremium={isPremium} onToastSuccessMod={onToastSuccessMod} onToastSuccess={onToastSuccess} onToastSuccessDel={onToastSuccessDel} />

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
            Solicitar folios <FaArrowCircleRight />
          </Link>
        </div>
      </BasicModal>

      {/* {errorNotas && (
        <BasicModal title="Error de acceso" show={true} onClose={() => dispatch(setError(null))}>
          <ErrorAccesso apiError={errorNotas} onOpenCloseErrorModal={() => dispatch(setError(null))} />
        </BasicModal>
      )} */}

    </ProtectedRoute>

  )
}
