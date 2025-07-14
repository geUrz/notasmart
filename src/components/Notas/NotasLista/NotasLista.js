import { useState } from 'react'
import { map, size } from 'lodash'
import axios from 'axios'
import { ListEmpty, Loading, ToastSuccess } from '@/components/Layouts'
import { FaFileAlt } from 'react-icons/fa'
import { getValueOrDefault } from '@/helpers'
import { BasicModal } from '@/layouts'
import { NotaDetalles } from '../NotaDetalles'
import styles from './NotasLista.module.css'
import { getValueOrDel } from '@/helpers/getValueOrDel'
import { useDispatch, useSelector } from 'react-redux'
import { setNota } from '@/store/notas/notaSlice'
import { selectNota, selectNotas } from '@/store/notas/notaSelectors'

export function NotasLista(props) {

  const { user, reload, onReload, isAdmin, isSuperUser, isPremium, onToastSuccess, onToastSuccessMod, onToastSuccessDel } = props

  const dispatch = useDispatch()
  const nota = useSelector(selectNota)
  const notas = useSelector(selectNotas)
  
  const [showDetalles, setShowDetalles] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  
  const [toastSuccess, setToastSuccess] = useState(false)
  const [toastSuccessConfirm, setToastSuccessConfirm] = useState(false)
  const [toastSuccessDelete, setToastSuccessDelete] = useState(false)

  const onShowConfirm = () => setShowConfirm((prevState) => !prevState)

  const onOpenDetalles = (nota) => {
    dispatch(setNota(nota))
    setShowDetalles(true)
  }  

  const onCloseDetalles = () => {
    dispatch(setNota(null))
    setShowDetalles(false)
  }

  const onDeleteConcept = async (conceptoId) => {
    try {
      const response = await axios.delete(`/api/notas/conceptos`, {
        params: { concepto_id: conceptoId },
      })
  
      if (response.status === 200) {
 
        const res = await axios.get(`/api/notas/notas?id=${nota.id}`)
        dispatch(setNota(res.data))
  
        onReload()
      }
    } catch (error) {
      console.error('Error al eliminar el concepto:', error.response || error.message || error)
    }
  }  

  const onDeleteAbono = async (abonoId) => {
    try {
      const response = await axios.delete(`/api/notas/abonos`, {
        params: { abono_id: abonoId },
      })
  
      if (response.status === 200) {

        const res = await axios.get(`/api/notas/notas?id=${nota.id}`)
        dispatch(setNota(res.data))
  
        onReload()
      }
    } catch (error) {
      console.error('Error al eliminar el abono:', error.response || error.message || error)
    }
  }

  const onDeleteAnticipo = async (anticipoId) => {
    try {
      const response = await axios.delete(`/api/notas/anticipos`, {
        params: { anticipo_id: anticipoId },
      })
  
      if (response.status === 200) {

        const res = await axios.get(`/api/notas/notas?id=${nota.id}`)
        dispatch(setNota(res.data))
  
        onReload()
      }
    } catch (error) {
      console.error('Error al eliminar el anticipo:', error.response || error.message || error)
    }
  }

  const onAddConcept = (nuevoConcepto) => {
    if (!nota) return
    dispatch(setNota({
      ...nota,
      conceptos: [...(nota.conceptos || []), nuevoConcepto]
    }))
  }  
  
  const onAddAbono = (nuevoAbono) => {
    if (!nota) return
    dispatch(setNota({
      ...nota,
      abonos: [...(nota.abonos || []), nuevoAbono]
    }))
  }

  const onAddAnticipo = (nuevoAnticipo) => {
    if (!nota) return
    dispatch(setNota({
      ...nota,
      anticipos: [...(nota.anticipos || []), nuevoAnticipo]
    }))
  }  

  return (

    <>

      {toastSuccess && <ToastSuccess contain='Concepto creado exitosamente' onClose={() => setToastSuccess(false)} />}

      {toastSuccessConfirm && <ToastSuccess contain='Nota eliminada exitosamente' onClose={() => setToastSuccessConfirm(false)} />}

      {toastSuccessDelete && <ToastSuccess contain='Concepto eliminado exitosamente' onClose={() => setToastSuccessConfirm(false)} />}

      {!notas ? (
        <Loading size={45} loading={1} />
      ) : (
        size(notas) === 0 ? (
          <ListEmpty />
        ) : (
          <div className={styles.main}>
            {map(notas, (nota) => (
             <div key={nota.id} className={styles.section} onClick={() => onOpenDetalles(nota)}>
             <div>
               <div className={styles.column1}>
                 <FaFileAlt />
               </div>
               <div className={styles.column2}>
                 <div>
                   <h1>Nota</h1>
                   <h2>{getValueOrDefault(nota.nota)}</h2>
                 </div>
                 <div>
                   <h1>Cliente</h1>
                   <h2>{getValueOrDel(nota?.cliente_nombre, !nota?.cliente_id)}</h2>
                 </div>
               </div>
             </div>
           </div>
            ))}
          </div>
        )
      )}

      <BasicModal title='detalles de la nota' show={showDetalles} onClose={onCloseDetalles}>
        <NotaDetalles user={user} isAdmin={isAdmin} isSuperUser={isSuperUser} isPremium={isPremium} reload={reload} onReload={onReload} onShowConfirm={onShowConfirm} onCloseDetalles={onCloseDetalles} onToastSuccess={onToastSuccess} onToastSuccessMod={onToastSuccessMod} onToastSuccessDel={onToastSuccessDel} onAddConcept={onAddConcept} onAddAbono={onAddAbono} onAddAnticipo={onAddAnticipo} onDeleteConcept={onDeleteConcept} onDeleteAbono={onDeleteAbono} onDeleteAnticipo={onDeleteAnticipo} />
      </BasicModal>

    </>

  )
}
