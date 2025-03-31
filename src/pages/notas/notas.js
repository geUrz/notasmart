import ProtectedRoute from '@/components/Layouts/ProtectedRoute/ProtectedRoute'
import { BasicLayout, BasicModal } from '@/layouts'
import { Add, Loading, Title, ToastDelete, ToastSuccess } from '@/components/Layouts'
import { useEffect, useState } from 'react'
import axios from 'axios'
import { useAuth } from '@/contexts/AuthContext'
import { size } from 'lodash'
import { NotaForm, NotasLista } from '@/components/Notas'
import styles from './Notas.module.css'

export default function Notas() {

  const { user, loading } = useAuth()

  const [reload, setReload] = useState(false)

  const onReload = () => setReload((prevState) => !prevState)

  const [openCloseForm, setOpenCloseForm] = useState(false)

  const onOpenCloseForm = () => setOpenCloseForm((prevState) => !prevState)

  const [notas, setNotas] = useState(null)
  
  const totalFolios = size(notas)
  
  useEffect(() => {
    if(user && user.id) {
      if(user.nivel === 'usuario') {
        (async () => {
          try {
            const res = await axios.get(`/api/notas/notas?usuario_id=${user.id}`)
            setNotas(res.data)
          } catch (error) {
            console.error(error)
          }
        })()
      } else if(user.nivel === 'admin') {
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

        {user && user.folios === totalFolios ?
          null : <Add onOpenClose={onOpenCloseForm} /> 
        }

        <NotasLista user={user} loading={loading} reload={reload} onReload={onReload} notas={notas} setNotas={setNotas} onToastSuccessMod={onToastSuccessMod} onToastSuccess={onToastSuccess} onToastSuccessDel={onToastSuccessDel} />

      </BasicLayout>

      <BasicModal title='crear nota' show={openCloseForm} onClose={onOpenCloseForm}>
        <NotaForm reload={reload} onReload={onReload} onToastSuccess={onToastSuccess} onOpenCloseForm={onOpenCloseForm} />
      </BasicModal>

    </ProtectedRoute>

  )
}
