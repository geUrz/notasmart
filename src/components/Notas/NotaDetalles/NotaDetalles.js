import { Confirm, IconClose, Loading, ToastSuccess } from '@/components/Layouts'
import { FaCheck, FaEdit, FaPlus, FaTimes, FaTrash } from 'react-icons/fa'
import { BasicModal } from '@/layouts'
import { formatCurrency, formatDateIncDet, getValueOrDefault } from '@/helpers'
import { BiSolidToggleLeft, BiSolidToggleRight } from 'react-icons/bi'
import { useEffect, useState } from 'react'
import { NotaConceptos, ReciboConceptos } from '../NotaConceptos'
import { NotaPDF, ReciboPDF } from '../NotaPDF'
import { NotaConceptosForm, ReciboConceptosForm } from '../NotaConceptosForm'
import axios from 'axios'
import { Button, Form, FormField, FormGroup, TextArea } from 'semantic-ui-react'
import { RowHeadModal } from '../RowHead'
import { NotaEditForm, ReciboEditForm } from '../NotaEditForm'
import { NotaConceptosEditForm, ReciboConceptosEditForm } from '../NotaConceptosEditForm'
import styles from './NotaDetalles.module.css'

export function NotaDetalles(props) {

  const { user, loading, nota, notaId, reload, onReload, onOpenClose, onAddConcept, onDeleteConcept, onShowConfirm, onToastSuccess, onToastSuccessMod, onToastSuccessDel, notaSeleccionado } = props

  const [showConcep, setShowForm] = useState(false)
  const [showEditConcep, setShowEditConcept] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [currentConcept, setCurrentConcept] = useState(null)
  const [toastSuccess, setToastSuccess] = useState(false)

  const [showEditNota, setShowEditNota] = useState(false)
  const onOpenEditNota = () => setShowEditNota((prevState) => !prevState)

  const [showConfirmDel, setShowConfirmDel] = useState(false)
  const onOpenCloseConfirmDel = () => setShowConfirmDel((prevState) => !prevState)

  const onOpenCloseConfirm = (concepto) => {
    if (!concepto || !concepto.id) {
      console.error('Concepto no válido:', concepto)
      return;
    }
    setShowConfirm((prevState) => !prevState)
    setCurrentConcept(concepto.id)
  }


  const onOpenCloseConcep = (concepto) => {
    setShowForm((prevState) => !prevState)
    setCurrentConcept(concepto.id)
  }

  const onOpenCloseEditConcep = (concepto) => {
    setShowEditConcept((prevState) => !prevState)
    setCurrentConcept(concepto)
  }

  const handleDeleteConcept = () => {
    onDeleteConcept(currentConcept)
    setShowConfirm(false)
    setShowEditConcept(false)
  }

  const [toggleIVA, setToggleIVA] = useState(false)

  const onIVA = () => {
    setToggleIVA((prevState) => !prevState)
  }

  useEffect(() => {
    const savedToggleIVA = localStorage.getItem('ontoggleIVA')
    if (savedToggleIVA) {
      setToggleIVA(JSON.parse(savedToggleIVA))
    }
  }, [])

  useEffect(() => {
    localStorage.setItem('ontoggleIVA', JSON.stringify(toggleIVA))
  }, [toggleIVA])

  const subtotal = (nota?.conceptos || []).reduce(
    (sum, concepto) => sum + concepto.precio * concepto.cantidad,
    0
  )
  const iva = subtotal * 0.16
  const total = subtotal + iva

  const handleDelete = async () => {
    if (!nota?.id) {
      console.error("Nota o ID no disponible")
      return;
    }

    try {
      await axios.delete(`/api/notas/notas?id=${nota.id}`)
      onOpenClose()
      notaSeleccionado(null)
      onReload()
      onToastSuccessDel()
    } catch (error) {
      console.error("Error al eliminar la nota:", error)
    }
  }

  if (loading) {
    return <Loading size={45} loading={1} />
  }

  return (

    <>

      <IconClose onOpenClose={onOpenClose} />

      {toastSuccess && <ToastSuccess contain='Concepto agregado exitosamente' onClose={() => setToastSuccess(false)} />}

      <div className={styles.main}>
        <div className={styles.sectionDatos}>
          <div className={styles.datos_1}>
            <div>
              <h1>Nota</h1>
              <h2>{getValueOrDefault(nota?.nota)}</h2>
            </div>
            <div>
              <h1>Cliente</h1>
              <h2>{getValueOrDefault(nota?.cliente_cliente)}</h2>
            </div>
            <div>
              <h1>Atención a</h1>
              <h2>{getValueOrDefault(nota?.cliente_contacto)}</h2>
            </div>
          </div>
          <div className={styles.datos_2}>
            <div>
              <h1>Folio</h1>
              <h2>{getValueOrDefault(nota?.folio)}</h2>
            </div>
            <div>
              <h1>Fecha</h1>
              <h2>{getValueOrDefault(formatDateIncDet(nota?.createdAt))}</h2>
            </div>
          </div>
        </div>

        <RowHeadModal rowMain />

        <NotaConceptos conceptos={nota?.conceptos || []} onOpenCloseConfirm={onOpenCloseConfirm} onOpenCloseEditConcep={onOpenCloseEditConcep} handleDeleteConcept={handleDeleteConcept} />

        <div className={styles.iconPlus}>
          <div onClick={onOpenCloseConcep}>
            <FaPlus />
          </div>
        </div>

        <div className={styles.sectionTotal}>
          <div className={styles.sectionTotal_1}>
            <h1>Subtotal:</h1>

            {!toggleIVA ? (

              <div className={styles.toggleOFF}>
                <BiSolidToggleLeft onClick={onIVA} />
                <h1>IVA:</h1>
              </div>

            ) : (

              <div className={styles.toggleON}>
                <BiSolidToggleRight onClick={onIVA} />
                <h1>IVA:</h1>
              </div>

            )}

            <h1>Total:</h1>
          </div>

          <div className={styles.sectionTotal_2}>

            {!toggleIVA ? (
              <>

                <h1>-</h1>
                <h1>-</h1>

              </>
            ) : (
              <>

                <h1>${formatCurrency(subtotal)}</h1>
                <h1>${formatCurrency(iva)}</h1>

              </>
            )}

            {!toggleIVA ? (
              <h1>${formatCurrency(subtotal)}</h1>
            ) : (
              <h1>${formatCurrency(total)}</h1>
            )}

          </div>
        </div>

        <div className={styles.iconEdit} onClick={onOpenEditNota}>
          <div><FaEdit /></div>
        </div>
        <div className={styles.iconDel}>
          <div><FaTrash onClick={() => setShowConfirmDel(true)} /></div>
        </div>

        <NotaPDF nota={nota} conceptos={nota?.conceptos || []} />

      </div>

      <BasicModal title='modificar la nota' show={showEditNota} onClose={onOpenEditNota}>
        <NotaEditForm reload={reload} onReload={onReload} nota={nota} onOpenEditNota={onOpenEditNota} onToastSuccessMod={onToastSuccessMod} />
      </BasicModal>

      <BasicModal title='Agregar concepto' show={showConcep} onClose={onOpenCloseConcep}>
        <NotaConceptosForm reload={reload} onReload={onReload} onOpenCloseConcep={onOpenCloseConcep} onAddConcept={onAddConcept} notaId={notaId?.id || []} onToastSuccess={onToastSuccess} />
      </BasicModal>

      <BasicModal title='Modificar concepto' show={showEditConcep} onClose={onOpenCloseEditConcep}>
        <NotaConceptosEditForm
          reload={reload}
          onReload={onReload}
          conceptToEdit={currentConcept}
          onOpenCloseEditConcep={onOpenCloseEditConcep}
          onOpenCloseConfirm={onOpenCloseConfirm}
        />
      </BasicModal>

      {/* <BasicModal title='datos del cliente' show={showCliente} onClose={onOpenCloseCliente}>
        <DatosCliente
          folio={getValueOrDefault(nota?.cliente_folio)}
          nombre={getValueOrDefault(nota?.cliente_nombre)}
          cel={getValueOrDefault(nota?.cliente_cel)}
          direccion={getValueOrDefault(nota?.cliente_direccion)}
          email={getValueOrDefault(nota?.cliente_email)}
          onOpenCloseCliente={onOpenCloseCliente} />
      </BasicModal> */}

      <Confirm
        open={showConfirm}
        cancelButton={
          <div className={styles.iconClose}>
            <FaTimes />
          </div>
        }
        confirmButton={
          <div className={styles.iconCheck}>
            <FaCheck />
          </div>
        }
        onConfirm={handleDeleteConcept}
        onCancel={() => setShowConfirm(false)}
        onClick={() => onOpenCloseConfirm}
        content='¿ Estas seguro de eliminar el concepto ?'
      />

      <Confirm
        open={showConfirmDel}
        cancelButton={
          <div className={styles.iconClose}>
            <FaTimes />
          </div>
        }
        confirmButton={
          <div className={styles.iconCheck}>
            <FaCheck />
          </div>
        }
        onConfirm={handleDelete}
        onCancel={onOpenCloseConfirmDel}
        content='¿ Estas seguro de eliminar la nota ?'
      />

    </>

  )
}
