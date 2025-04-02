import ProtectedRoute from '@/components/Layouts/ProtectedRoute/ProtectedRoute'
import { BasicLayout, BasicModal } from '@/layouts'
import { Add, IconClose, Loading, Title, ToastDelete, ToastSuccess } from '@/components/Layouts'
import { useEffect, useState } from 'react'
import axios from 'axios'
import { useAuth } from '@/contexts/AuthContext'
import { size } from 'lodash'
import { NotaForm, NotasLista, NotasListSearch, SearchNotas } from '@/components/Notas'
import styles from './Notas.module.css'
import { FaInfoCircle, FaSearch } from 'react-icons/fa'

export default function Notas() {

  const { user, loading } = useAuth()

  const [reload, setReload] = useState(false)

  const onReload = () => setReload((prevState) => !prevState)

  const [openCloseForm, setOpenCloseForm] = useState(false)

  const [showFolios, setShowFolios] = useState(false)

  const onOpenCloseForm = () => setOpenCloseForm((prevState) => !prevState)

  const onOpenShowFolios = () => setShowFolios((prevState) => !prevState)

  const [search, setSearch] = useState(false)
    
  const onOpenCloseSearch = () => setSearch((prevState) => !prevState)
    
  const [resultados, setResultados] = useState([])

  const [notas, setNotas] = useState(null)

  const totalFolios = size(notas)

  useEffect(() => {
    if (user && user.id) {
      if (user.nivel === 'usuario') {
        (async () => {
          try {
            const res = await axios.get(`/api/notas/notas?usuario_id=${user.id}`)
            setNotas(res.data)
          } catch (error) {
            console.error(error)
          }
        })()
      } else if (user.nivel === 'admin') {
        (async () => {
          try {
            const res = await axios.get(`/api/notas/notas`)
            setNotas(res.data)
          } catch (error) {
            console.error(error)
          }
        })()
      }
    }
  }, [reload, user])

  const onOpenCloseFormFolios = () => {
    if (user && totalFolios >= user.folios) {
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

        {toastSuccess && <ToastSuccess contain='Creado exitosamente' onClose={() => setToastSuccessReportes(false)} />}

        {toastSuccessMod && <ToastSuccess contain='Modificado exitosamente' onClose={() => setToastSuccessReportesMod(false)} />}

        {toastSuccessDel && <ToastDelete contain='Eliminado exitosamente' onClose={() => setToastSuccessReportesDel(false)} />}

        <Title title='notas' />

        <Add onOpenClose={onOpenCloseFormFolios} />

        {!search ? (
          ''
        ) : (
          <div className={styles.searchMain}>
            <SearchNotas user={user} onResults={setResultados} reload={reload} onReload={onReload} onToastSuccessMod={onToastSuccessMod} onOpenCloseSearch={onOpenCloseSearch} />
            {resultados.length > 0 && (
              <NotasListSearch visitas={resultados} reload={reload} onReload={onReload} />
            )}
          </div>
        )}

        {!search ? (
          <div className={styles.iconSearchMain}>
            <div className={styles.iconSearch} onClick={onOpenCloseSearch}>
              <h1>Buscar notas</h1>
              <FaSearch />
            </div>
          </div>
        ) : (
          ''
        )}

        <NotasLista user={user} loading={loading} reload={reload} onReload={onReload} notas={notas} setNotas={setNotas} onToastSuccessMod={onToastSuccessMod} onToastSuccess={onToastSuccess} onToastSuccessDel={onToastSuccessDel} />

      </BasicLayout>

      <BasicModal title='crear nota' show={openCloseForm} onClose={onOpenCloseForm}>
        <NotaForm reload={reload} onReload={onReload} onToastSuccess={onToastSuccess} onOpenCloseForm={onOpenCloseForm} />
      </BasicModal>

      <BasicModal show={showFolios} onClose={onOpenShowFolios}>
        <IconClose onOpenClose={onOpenShowFolios} />
        <div className={styles.noFolios}>
          <FaInfoCircle />
          <h1>¡ Has agotado tus folios disponibles !</h1>
          <h2>Por favor, póngase en contacto con el administrador para resolverlo.</h2>
        </div>
      </BasicModal>

    </ProtectedRoute>

  )
}
