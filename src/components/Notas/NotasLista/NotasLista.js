import { useState } from 'react'
import { map, size } from 'lodash'
import axios from 'axios'
import { ListEmpty, Loading, ToastSuccess } from '@/components/Layouts'
import { FaFileAlt } from 'react-icons/fa'
import { getValueOrDefault } from '@/helpers'
import { BasicModal } from '@/layouts'
import { NotaDetalles } from '../NotaDetalles'
import styles from './NotasLista.module.css'

export function NotasLista(props) {

  const { reload, onReload, notas, onToastSuccess, onToastSuccessMod, onToastSuccessDel } = props

  const [show, setShow] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  
  const [notaSeleccionado, setNotaSeleccionado] = useState(null)
  const [toastSuccess, setToastSuccess] = useState(false)
  const [toastSuccessConfirm, setToastSuccessConfirm] = useState(false)
  const [toastSuccessDelete, setToastSuccessDelete] = useState(false)

  const onShowConfirm = () => setShowConfirm((prevState) => !prevState)

  const onOpenClose = async (nota) => {

    if (!nota || !nota.id) {
      setShow(false)
      return;
    }

    try {
      const response = await axios.get(`/api/notas/conceptos?nota_id=${nota.id}`)
      nota.conceptos = response.data
      setNotaSeleccionado(nota)
      setShow((prevState) => !prevState)
    } catch (error) {
      console.error('Error al obtener los conceptos:', error)
      setShow(false)
    }
  }

  const onDeleteConcept = async (conceptoId) => {
    try {
      const response = await axios.delete(`/api/notas/conceptos`, {
        params: { concepto_id: conceptoId },
      })
      if (response.status === 200) {
        setNotaSeleccionado((prevState) => ({
          ...prevState,
          conceptos: prevState.conceptos.filter((concepto) => concepto.id !== conceptoId),
        }))
      } else {
        console.error('Error al eliminar el concepto: Respuesta del servidor no fue exitosa', response);
      }
    } catch (error) {
      console.error('Error al eliminar el concepto:', error.response || error.message || error);
    }
  }

  const onAddConcept = (concept) => {
    setNotaSeleccionado((prevState) => ({
      ...prevState,
      conceptos: [...prevState.conceptos, concept],
    }))
    onReload()
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
             <div key={nota.id} className={styles.section} onClick={() => onOpenClose(nota)}>
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
                   <h2>{getValueOrDefault(nota.cliente_cliente)}</h2>
                 </div>
               </div>
             </div>
           </div>
            ))}
          </div>
        )
      )}

      <BasicModal title='detalles de la nota' show={show} onClose={onOpenClose}>
        <NotaDetalles nota={notaSeleccionado} notaId={notaSeleccionado} reload={reload} onReload={onReload} onShowConfirm={onShowConfirm} onOpenClose={onOpenClose} onToastSuccess={onToastSuccess} onToastSuccessMod={onToastSuccessMod} onToastSuccessDel={onToastSuccessDel} onAddConcept={onAddConcept} onDeleteConcept={onDeleteConcept} notaSeleccionado={setNotaSeleccionado} />
      </BasicModal>

    </>

  )
}
