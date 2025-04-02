import { Add, Loading, Title, ToastDelete, ToastSuccess } from '@/components/Layouts'
import ProtectedRoute from '@/components/Layouts/ProtectedRoute/ProtectedRoute'
import { useAuth } from '@/contexts/AuthContext'
import { BasicLayout, BasicModal } from '@/layouts'
import axios from 'axios'
import { useEffect, useState } from 'react'
import { ClienteForm, ClientesLista, ClientesListSearch, SearchClientes } from '@/components/Clientes'
import styles from './clientes.module.css'
import { FaSearch } from 'react-icons/fa'

export default function Clientes() {

  const { user, loading } = useAuth()

  const [reload, setReload] = useState(false)

  const onReload = () => setReload((prevState) => !prevState)

  const [openForm, setOpenForm] = useState(false)

  const onOpenCloseForm = () => setOpenForm((prevState) => !prevState)

  const [search, setSearch] = useState(false)
    
  const onOpenCloseSearch = () => setSearch((prevState) => !prevState)
    
  const [resultados, setResultados] = useState([])

  const [clientes, setClientes] = useState(null)

  useEffect(() => {
    if(user && user.id) {
      if (user.nivel === 'admin') {
        (async () => {
          try {
            const res = await axios.get(`/api/clientes/clientes`)
            setClientes(res.data)
          } catch (error) {
            console.error(error)
          }
        })()
      } else {
        (async () => {
          try {
            const res = await axios.get(`/api/clientes/clientes?usuario_id=${user.id}`)
            setClientes(res.data)
          } catch (error) {
            console.error(error)
          }
        })()
      }
    }
  }, [reload, user])

  const [toastSuccess, setToastSuccess] = useState(false)
  const [toastSuccessMod, setToastSuccessMod] = useState(false)
  const [toastSuccessDel, setToastSuccessDel] = useState(false)

  const onToastSuccess = () => {
    setToastSuccess(true)
    setTimeout(() => {
      setToastSuccess(false)
    }, 3000)
  }

  const onToastSuccessMod = () => {
    setToastSuccessMod(true)
    setTimeout(() => {
      setToastSuccessMod(false)
    }, 3000)
  }

  const onToastSuccessDel = () => {
    setToastSuccessDel(true)
    setTimeout(() => {
      setToastSuccessDel(false)
    }, 3000)
  }

  if (loading) {
    return <Loading size={45} loading={'L'} />
  }

  return (

    <ProtectedRoute>

      <BasicLayout relative onReload={onReload}>

        {toastSuccess && <ToastSuccess contain='Creado exitosamente' onClose={() => setToastSuccess(false)} />}

        {toastSuccessMod && <ToastSuccess contain='Modificado exitosamente' onClose={() => setToastSuccessMod(false)} />}

        {toastSuccessDel && <ToastDelete contain='Eliminado exitosamente' onClose={() => setToastSuccessDel(false)} />}

        <Title title='clientes'  />

        <Add onOpenClose={onOpenCloseForm} />

        {!search ? (
          ''
        ) : (
          <div className={styles.searchMain}>
            <SearchClientes user={user} onResults={setResultados} reload={reload} onReload={onReload} onToastSuccessMod={onToastSuccessMod} onOpenCloseSearch={onOpenCloseSearch} />
            {resultados.length > 0 && (
              <ClientesListSearch visitas={resultados} reload={reload} onReload={onReload} />
            )}
          </div>
        )}

        {!search ? (
          <div className={styles.iconSearchMain}>
            <div className={styles.iconSearch} onClick={onOpenCloseSearch}>
              <h1>Buscar clientes</h1>
              <FaSearch />
            </div>
          </div>
        ) : (
          ''
        )}
        
        <ClientesLista reload={reload} onReload={onReload} clientes={clientes} onToastSuccessMod={onToastSuccessMod} onToastSuccessDel={onToastSuccessDel} />


      </BasicLayout>

      <BasicModal title='crear cliente' show={openForm} onClose={onOpenCloseForm}>
        <ClienteForm reload={reload} onReload={onReload} onCloseForm={onOpenCloseForm} onToastSuccess={onToastSuccess} />
      </BasicModal>

    </ProtectedRoute>

  )
}
