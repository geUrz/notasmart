import { Confirm, IconClose, IconDel, IconEdit, ToastSuccess } from '@/components/Layouts'
import { FaPlus } from 'react-icons/fa'
import { BasicModal } from '@/layouts'
import { formatCurrency, formatDateIncDet, getValueOrDefault, getValueOrWhite } from '@/helpers'
import { BiQr, BiSolidToggleLeft, BiSolidToggleRight } from 'react-icons/bi'
import { useEffect, useMemo, useState } from 'react'
import { NotaConceptos } from '../NotaConceptos'
import { NotaPDF } from '../NotaPDF'
import { NotaConceptosForm } from '../NotaConceptosForm'
import axios from 'axios'
import { RowHeadModal } from '../RowHead'
import { NotaEditForm } from '../NotaEditForm'
import { NotaConceptosEditForm } from '../NotaConceptosEditForm'
import QRCode from 'qrcode'
import styles from './NotaDetalles.module.css'
import { QRScan } from '../QRScan'
import { generarPDF } from '../generarPDF'
import { Form, FormField, FormGroup, Input } from 'semantic-ui-react'
import { getValueOrDel } from '@/helpers/getValueOrDel/getValueOrDel'

export function NotaDetalles(props) {
  const { user, nota, notaId, reload, onReload, onOpenClose, onAddConcept, onDeleteConcept, onToastSuccess, onToastSuccessMod, onToastSuccessDel, notaSeleccionado } = props
  
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

  const [qrCode, setQrCode] = useState('')
  const [showQR, setShowQR] = useState(false)

  const onOpenCloseQR = async () => {
    setShowQR((prevState) => !prevState)
  
    await generarPDF(nota, datoPDF, nota?.conceptos || [])
  }

  useEffect(() => {
    if (nota?.folio) {
      const pdfUrl = `https://notasmart.app/api/download-pdf/nota_${nota.folio}.pdf`;
      QRCode.toDataURL(pdfUrl).then(setQrCode).catch(console.error)
    }
  }, [nota])

  const [notaState, setNotaState] = useState(nota)

  useEffect(() => {
    setNotaState(nota)
  }, [nota])

  const onEditConcept = (conceptoActualizado) => {
    if (!notaState) return;

    setNotaState((prevNota) => {
      const conceptosActualizados = prevNota.conceptos.map((c) =>
        c.id === conceptoActualizado.id ? conceptoActualizado : c
      )

      return {
        ...prevNota,
        conceptos: conceptosActualizados,
      }
    })

    onReload()
  }

  const [toggleIVA, setToggleIVA] = useState(false)

  const onIVA = () => {
    setToggleIVA((prevState) => !prevState)
  
    const updatedIvaValue = toggleIVA ? 0 : (subtotal * ivaValue) / 100;
  
    addIVA(ivaValue, updatedIvaValue) 
  }

  const addIVA = async (ivaPercentage, ivaTotalValue) => {
    try {
      const res = await axios.put(`/api/notas/ivaTotal?id=${nota.id}`, {
        iva: ivaPercentage,     
        iva_total: ivaTotalValue, 
      })
  
    } catch (error) {
      console.error("Error al actualizar IVA:", error)
    }
  }

  const updateIVA = async (ivaPercentage, ivaTotalValue) => {
    try {
      const res = await axios.put(`/api/notas/ivaTotal?id=${nota.id}`, {
        iva: ivaPercentage,   
        iva_total: ivaTotalValue,  
      })
  
    } catch (error) {
      console.error("Error al actualizar IVA:", error)
    }
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

  const [ivaValue, setIvaValue] = useState(null)

  useEffect(() => {
    if (nota) {
      setIvaValue(nota.iva)
    }
  }, [nota])

  const subtotal = (notaState?.conceptos || []).reduce(
    (sum, concepto) => sum + concepto.precio * concepto.cantidad,
    0
  )

  const iva = ivaValue ? (subtotal * ivaValue) / 100 : 0
  const total = subtotal + iva

  const handleIvaChange = async (e) => {
    let value = e.target.value;
  
    if (/^\d{0,2}$/.test(value)) {
      setIvaValue(value)
  
      const updatedIvaValue = value ? (subtotal * value) / 100 : 0;

      await updateIVA(value, updatedIvaValue)
    }
  }  

  useEffect(() => {
    if (nota && nota.iva) {
      setIvaValue(nota.iva)
    }
  }, [nota])
  

  const handleDelete = async () => {
    if (!nota?.id || !nota?.folio) {
      console.error("Nota o ID no disponible")
      return;
    }
  
    try {
      await axios.delete(`/api/notas/notas?id=${nota.id}&folio=${nota.folio}`) 
      onOpenClose()
      notaSeleccionado(null)
      onReload()
      onToastSuccessDel()
    } catch (error) {
      console.error("Error al eliminar la nota:", error)
    }
  }

  const [datoPDF, setDatoPDF] = useState(null)

  useEffect(() => {
    if (user && user.id) {
      (async () => {
        try {
          const res = await axios.get(`/api/usuarios/datos_pdf?usuario_id=${user.id}`)
          setDatoPDF(res.data)
        } catch (error) {
          console.error(error)
        }
      })()
    }
  }, [reload])

  const [notaData, setNotaData] = useState(nota)

  useEffect(() => {
    setNotaData(nota)
  }, [nota])

  const actualizarNota = (nuevaData) => {
    setNotaData((prevState) => ({
      ...prevState,
      ...nuevaData,
    }))
  }

  const permissions = useMemo(() => {
    if(!user) return {}
  
    return{
      showAdmin: user.nivel === 'admin'
    }
  }, [user])

  return (
    <>
      <IconClose onOpenClose={onOpenClose} />

      {toastSuccess && <ToastSuccess contain='Concepto agregado exitosamente' onClose={() => setToastSuccess(false)} />}

      <div className={styles.main}>
        <div className={styles.sectionDatos}>
          <div className={styles.datos_1}>
            <div>
              <h1>Nota</h1>
              <h2>{getValueOrDefault(notaData?.nota)}</h2>
            </div>
            <div>
              <h1>Cliente</h1>
              <h2>{getValueOrDel(notaData?.cliente_nombre, !notaData?.cliente_id)}</h2>
            </div>
            <div>
              <h1>Atención a</h1>
              <h2>{getValueOrWhite(notaData?.cliente_contacto)}</h2>
            </div>
          </div>
          <div className={styles.datos_2}>
            <div>
              <h1>Folio</h1>
              <h2>{getValueOrDefault(notaData?.folio)}</h2>
            </div>
            <div>
              <h1>Fecha</h1>
              <h2>{getValueOrDefault(formatDateIncDet(notaData?.createdAt))}</h2>
            </div>
          </div>
        </div>

        <RowHeadModal rowMain />

        <NotaConceptos user={user} conceptos={notaState?.conceptos || []} onOpenCloseConfirm={onOpenCloseConfirm} onOpenCloseEditConcep={onOpenCloseEditConcep} handleDeleteConcept={handleDeleteConcept} />

        <div className={styles.iconPlus}>
          <div onClick={onOpenCloseConcep}>
            <FaPlus />
          </div>
        </div>

        <div className={styles.sectionTotal}>
          <div className={styles.sectionTotal_1}>
            <h1>Subtotal:</h1>

            {!toggleIVA ? (
                <div className={styles.toggleOFF} onClick={onIVA}>
                  <BiSolidToggleLeft />
                  <h1>IVA:</h1>
                </div>
              ) : (
                <div className={styles.toggleON}>
                  <Form>
                    <FormGroup>
                      <FormField>
                        <Input
                          value={ivaValue}
                          onChange={handleIvaChange}
                          className={styles.ivaInput}
                        />
                      </FormField>
                    </FormGroup>
                  </Form>
                  <h2>%</h2>
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
                <h1>{formatCurrency(subtotal)}</h1>
                <h1>{formatCurrency(iva)}</h1>
              </>
            )}

            {!toggleIVA ? (
              <h1>{formatCurrency(subtotal)}</h1>
            ) : (
              <h1>{formatCurrency(total)}</h1>
            )}
          </div>
        </div>

        <IconEdit onOpenEdit={onOpenEditNota} />

        <div className={styles.mainQRPDF}>
          <div className={styles.qrMain}>
            <div onClick={onOpenCloseQR}>
              <BiQr/>
            </div>
          </div>

          <NotaPDF nota={notaData} datoPDF={datoPDF} conceptos={notaState?.conceptos || []} ivaValue={ivaValue} />
        </div>

        {permissions.showAdmin &&
          <>
            <IconDel setShowConfirmDel={setShowConfirmDel} />
            <div className={styles.h1UsuarioNombre}>
              <h1>{getValueOrDefault(notaData?.usuario_nombre)}</h1>
            </div>
          </>
        }

      </div>

      <BasicModal title='modificar la nota' show={showEditNota} onClose={onOpenEditNota}>
        <NotaEditForm user={user} reload={reload} onReload={onReload} notaData={notaData} actualizarNota={actualizarNota} onOpenEditNota={onOpenEditNota} onToastSuccessMod={onToastSuccessMod} />
      </BasicModal>

      <BasicModal title='Agregar concepto' show={showConcep} onClose={onOpenCloseConcep}>
        <NotaConceptosForm user={user} reload={reload} onReload={onReload} onOpenCloseConcep={onOpenCloseConcep} onAddConcept={onAddConcept} notaId={notaId?.id || []} onToastSuccess={onToastSuccess} />
      </BasicModal>

      <BasicModal title='Modificar concepto' show={showEditConcep} onClose={onOpenCloseEditConcep}>
        <NotaConceptosEditForm
          user={user}
          reload={reload}
          onReload={onReload}
          onEditConcept={onEditConcept}
          conceptToEdit={currentConcept}
          onOpenCloseEditConcep={onOpenCloseEditConcep}
          onOpenCloseConfirm={onOpenCloseConfirm}
        />
      </BasicModal>

      <BasicModal title='escanea para descargar el pdf' show={showQR} onClose={onOpenCloseQR}>
        {qrCode && (
          <QRScan qrCode={qrCode} onOpenCloseQR={onOpenCloseQR} />
        )}
      </BasicModal>

      <Confirm
        open={showConfirm}
        onConfirm={handleDeleteConcept}
        onCancel={() => setShowConfirm(false)}
        content='¿ Estas seguro de eliminar el concepto ?'
      />

      <Confirm
        open={showConfirmDel}
        onConfirm={handleDelete}
        onCancel={onOpenCloseConfirmDel}
        content='¿ Estas seguro de eliminar la nota ?'
      />
    </>
  )
}
