import { Confirm, IconClose, IconDel, IconEdit, SkeletonPlaceholder, ToastSuccess } from '@/components/Layouts'
import { FaInfoCircle, FaPlus } from 'react-icons/fa'
import { BasicModal } from '@/layouts'
import { formatCurrency, formatDateIncDet, getValueOrDefault } from '@/helpers'
import { BiQr } from 'react-icons/bi'
import { useEffect, useState } from 'react'
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
import { getValueOrDel } from '@/helpers/getValueOrDel/getValueOrDel'
import { NotaAbonos } from '../NotaAbonos'
import { NotaAbonosForm } from '../NotaAbonosForm'
import { NotaAbonosEditForm } from '../NotaAbonosEditForm'
import { NotaProductoBaseEditForm } from '../NotaProductoBaseEditForm'
import { ClienteDetalles } from '@/components/Clientes'

import { useDispatch, useSelector } from 'react-redux'
import { updateConcepto, updateAbono, updateIVA, fetchNotaById, updateAnticipo } from '@/store/notas/notaSlice'
import { NotaAnticipos } from '../NotaAnticipos'
import { selectAbonos, selectAnticipos, selectConceptos, selectNota } from '@/store/notas/notaSelectors'
import ProductoBaseViewer from '../ProductoBaseViewer/ProductoBaseViewer'
import { setCliente } from '@/store/clientes/clienteSlice'
import { NotaAnticiposForm } from '../NotaAnticiposForm'
import { NotaAnticiposEditForm } from '../NotaAnticiposEditForm'

export function NotaDetalles(props) {
  const { user, isAdmin, isSuperUser, isPremium, reload, onReload, onCloseDetalles, onAddConcept, onAddAbono, onAddAnticipo, onDeleteConcept, onDeleteAbono, onDeleteAnticipo, onToastSuccess, onToastSuccessMod, onToastSuccessDel } = props

  const dispatch = useDispatch()
  const nota = useSelector(selectNota)
  const abonos = useSelector(selectAbonos)
  const conceptos = useSelector(selectConceptos)
  const anticipos = useSelector(selectAnticipos)

  const [isSyncingNota, setIsSyncingNota] = useState(false)

  const syncNota = async () => {
    setIsSyncingNota(true)
    await dispatch(fetchNotaById(nota.id))
    setIsSyncingNota(false)
  }

  const [showConcep, setShowForm] = useState(false)
  const [showAbono, setShowAbonoForm] = useState(false)
  const [showAnticipo, setShowAnticipoForm] = useState(false)
  const tieneProductoBase = [...(nota?.abonos || []), ...(nota?.anticipos || [])].some(a => a.producto_base === 1)
  const [showEditConcep, setShowEditConcept] = useState(false)
  const [currentConcept, setCurrentConcept] = useState(null)
  const [showConfirm, setShowConfirm] = useState(false)
  const [showEditAbono, setShowEditAbono] = useState(false)
  const [currentAbono, setCurrentAbono] = useState(null)
  const [showConfirmAbono, setShowConfirmAbono] = useState(false)
  const [showEditAnticipo, setShowEditAnticipo] = useState(false)
  const [currentAnticipo, setCurrentAnticipo] = useState(null)
  const [showConfirmAnticipo, setShowConfirmAnticipo] = useState(false)
  const [tituloAnticipo, setTituloAnticipo] = useState('Agregar anticipo');
  const [tituloEditAnticipo, setTituloEditAnticipo] = useState('Modificar anticipo');
  const yaTieneAnticipo = anticipos.some(a => a.tipo === 'Anticipo')
  
  const [toastSuccess, setToastSuccess] = useState(false)

  const [showEditNota, setShowEditNota] = useState(false)
  const onOpenEditNota = () => setShowEditNota((prevState) => !prevState)

  const [showProductoBaseModal, setShowProductoBaseModal] = useState(false)

  const [showCliente, setShowCliente] = useState(false)

  const onOpenCliente = () => {

    dispatch(setCliente({
      id: nota.cliente_id,
      cliente: nota.cliente_nombre,
      contacto: nota.cliente_contacto,
      cel: nota.cliente_cel,
      direccion: nota.cliente_direccion,
      email: nota.cliente_email,
      folio: nota.cliente_folio,
      negocio_id: nota.negocio_id,
      negocio_nombre: nota.negocio_nombre,
      usuario_id: nota.usuario_id,
      usuario_nombre: nota.usuario_nombre
    }))

    setShowCliente(true)
  }

  const onCloseCliente = () => {
    dispatch(setCliente(null))
    syncNota()
    setShowCliente(false)
  }

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

  const onOpenCloseConfirmAbono = (abono) => {
    if (!abono || !abono.id) {
      console.error('Abono no válido:', abono)
      return;
    }
    setShowConfirmAbono((prevState) => !prevState)
    setCurrentAbono(abono.id)
  }

  const onOpenCloseConfirmAnticipo = (anticipo) => {
    if (!anticipo || !anticipo.id) {
      console.error('Anticipo no válido:', anticipo)
      return;
    }
    setShowConfirmAnticipo((prevState) => !prevState)
    setCurrentAnticipo(anticipo.id)
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

  const onOpenCloseAbono = (abono) => {
    setShowAbonoForm((prevState) => !prevState)
    setCurrentAbono(abono.id)
  }

  const onOpenCloseEditAbono = (abono) => {
    setShowEditAbono((prevState) => !prevState)
    setCurrentAbono(abono)
  }

  const handleDeleteAbono = () => {
    onDeleteAbono(currentAbono)
    setShowConfirmAbono(false)
    setShowEditAbono(false)
  }

  const onOpenCloseAnticipo = (anticipo) => {
    setShowAnticipoForm((prevState) => !prevState)
    setCurrentAnticipo(anticipo.id)
  }

  const onOpenCloseEditAnticipo = (anticipo) => {
    setShowEditAnticipo((prevState) => !prevState)
    setCurrentAnticipo(anticipo)
    
    const tipo = anticipo?.tipo?.toLowerCase()
      if (tipo === 'anticipo') {
        setTituloEditAnticipo('Modificar anticipo')
      } else {
        setTituloEditAnticipo('Modificar abono')
      }
  }

  const handleDeleteAnticipo = () => {
    onDeleteAnticipo(currentAnticipo)
    setShowConfirmAnticipo(false)
    setShowEditAnticipo(false)
  }

  const [showEditProductoBase, setShowEditProductoBase] = useState(false)

  const [qrCode, setQrCode] = useState('')
  const [showQR, setShowQR] = useState(false)

  const onOpenCloseQR = async () => {
    setShowQR((prevState) => !prevState)

    await generarPDF(nota, datoPDF, nota?.conceptos || [], nota?.abonos || [], saldoRestante, totalAbonado, saldoAnterior, productoBase)
  }

  useEffect(() => {
    if (nota?.folio) {
      const pdfUrl = `https://notasmart.app/api/download-pdf/nota_${nota.folio}.pdf`;
      QRCode.toDataURL(pdfUrl).then(setQrCode).catch(console.error)
    }
  }, [nota])

  const onEditConcept = (conceptoActualizado) => {
    dispatch(updateConcepto(conceptoActualizado))
  }

  const onEditProductoBase = (abonoActualizado) => {
    dispatch(updateAbono(abonoActualizado))
  }

  const onEditAbono = (abonoActualizado) => {
    dispatch(updateAbono(abonoActualizado))
  }

  const onEditAnticipo = (anticipoActualizado) => {
    dispatch(updateAnticipo(anticipoActualizado))
  }

  const [ivaValue, setIvaValue] = useState('')
  const [toggleIVA, setToggleIVA] = useState(false)

  useEffect(() => {
    if ((ivaValue === '' || ivaValue === null) && nota?.iva !== undefined && nota?.iva !== null) {
      setIvaValue(String(nota.iva))
    }
  }, [nota])

  

  const subtotal = (nota?.conceptos || []).reduce(
    (sum, concepto) => sum + (concepto.total || 0),
    0
  )

  const iva = ivaValue ? (subtotal * parseFloat(ivaValue)) / 100 : 0
  const total = subtotal + iva

  const updateIVA = async (ivaPercentage, ivaTotalValue) => {
    try {
      await axios.put(`/api/notas/ivaTotal?id=${nota.id}`, {
        iva: ivaPercentage,
        iva_total: ivaTotalValue,
      })

      // Actualiza el estado local de nota?con el nuevo IVA
      setNotaState(prev => ({
        ...prev,
        iva: ivaPercentage,
        iva_total: ivaTotalValue
      }))

      // Si usas nota para PDF o algo más, puedes actualizarlo también
      setNotaData(prev => ({
        ...prev,
        iva: ivaPercentage,
        iva_total: ivaTotalValue
      }))
    } catch (error) {
      console.error("Error al actualizar IVA:", error)
    }
  }

  const handleIvaChange = async (e) => {
    const value = e.target.value

    // Solo números de 0 a 99 permitidos
    if (/^\d{0,2}$/.test(value)) {
      setIvaValue(value)

      const parsed = parseFloat(value)
      const updatedIva = isNaN(parsed) ? 0 : (subtotal * parsed) / 100

      await updateIVA(parsed, updatedIva)
    }
  }

  useEffect(() => {
    if (toggleIVA) {
      const parsed = parseFloat(ivaValue)
      const updatedIva = isNaN(parsed) ? 0 : (subtotal * parsed) / 100
      updateIVA(parsed, updatedIva)
    }
  }, [subtotal, toggleIVA])

  const onIVA = () => {
    const newToggle = !toggleIVA
    setToggleIVA(newToggle)

    if (newToggle) {
      const parsed = parseFloat(ivaValue)
      const updatedIva = isNaN(parsed) ? 0 : (subtotal * parsed) / 100
      updateIVA(parsed, updatedIva)
    } else {
      updateIVA(0, 0)
    }
  }

  // Opcional: guardar el toggle en localStorage
  useEffect(() => {
    const savedToggleIVA = localStorage.getItem('ontoggleIVA')
    if (savedToggleIVA) {
      setToggleIVA(JSON.parse(savedToggleIVA))
    }
  }, [])

  useEffect(() => {
    localStorage.setItem('ontoggleIVA', JSON.stringify(toggleIVA))
  }, [toggleIVA])


  const handleDelete = async () => {
    if (!nota?.id || !nota?.folio) {
      console.error("Nota o ID no disponible")
      return;
    }

    try {
      await axios.delete(`/api/notas/notas?id=${nota.id}&folio=${nota.folio}`)
      onOpenClose()
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

  const calcularSaldoRestante = () => {
    const abonos = nota?.abonos || []
    const anticipos = nota?.anticipos || []
    const todos = [...abonos, ...anticipos]

    const productoBase = todos.find(a => Number(a.producto_base) === 1)
    if (!productoBase) return 0

    const montoBase = productoBase.monto || 0
    const pagosNormales = todos.filter(a => Number(a.producto_base) !== 1)

    const totalPagado = pagosNormales.reduce((acc, p) => acc + (p.monto || 0), 0)
    return montoBase - totalPagado
  }

  const calcularSaldoAnterior = () => {
    const abonos = nota?.abonos || []
    const anticipos = nota?.anticipos || []
    const todos = [...abonos, ...anticipos]

    const productoBase = todos.find(a => Number(a.producto_base) === 1)
    if (!productoBase) return 0

    const montoBase = productoBase.monto || 0
    const pagosNormales = todos.filter(a => Number(a.producto_base) !== 1)

    if (pagosNormales.length === 0) return montoBase

    const totalPagado = pagosNormales.reduce((acc, p) => acc + (p.monto || 0), 0)
    const ultimoPago = pagosNormales[pagosNormales.length - 1]
    const saldoAnterior = montoBase - (totalPagado - (ultimoPago?.monto || 0))

    return saldoAnterior
  }

  const productoBase = Array.isArray(nota?.abonos) || Array.isArray(nota?.anticipos)
    ? [...(nota?.abonos || []), ...(nota?.anticipos || [])].find(a => Number(a.producto_base) === 1)
    : null

  const saldoAnterior = calcularSaldoAnterior()
  const totalAbonado = (productoBase?.monto || 0) - calcularSaldoRestante()
  const saldoRestante = calcularSaldoRestante()

  return (
    <>
      <IconClose onOpenClose={onCloseDetalles} />

      {toastSuccess && <ToastSuccess contain='Concepto agregado exitosamente' onClose={() => setToastSuccess(false)} />}

      <div className={styles.main}>
        <div className={styles.sectionDatos}>
          <div className={styles.datos_1}>
            <div>
              <h1>Nota</h1>
              <h2>{getValueOrDefault(nota?.nota)}</h2>
            </div>
            <div>
              <div className={styles.infCliente}>
                <h1>Cliente</h1>
                {(nota?.cliente_nombre_real || nota?.cliente_id) && (
                  <FaInfoCircle onClick={onOpenCliente} />
                )}
              </div>
              <SkeletonPlaceholder isLoading={isSyncingNota}>
                <h2>
                  {nota?.cliente_nombre_real
                    ? nota?.cliente_nombre_real
                    : getValueOrDel(nota?.cliente_nombre, !nota?.cliente_id)}
                </h2>
              </SkeletonPlaceholder>
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

        <RowHeadModal rowMain={nota?.forma_pago !== 'abonos' && nota?.forma_pago !== 'anticipo'} />

        {
          nota?.forma_pago === 'abonos' ? (
            <NotaAbonos
              user={user}
              isAdmin={isAdmin}
              isSuperUser={isSuperUser}
              isPremium={isPremium}
              onOpenCloseConfirm={onOpenCloseConfirm}
              onOpenCloseEditAbono={onOpenCloseEditAbono}
              handleDeleteAbono={handleDeleteAbono}
            />
          ) : nota?.forma_pago === 'anticipo' ? (
            <NotaAnticipos
              user={user}
              isAdmin={isAdmin}
              isSuperUser={isSuperUser}
              isPremium={isPremium}
              onOpenCloseConfirmAnticipo={onOpenCloseConfirmAnticipo}
              onOpenCloseEditAnticipo={onOpenCloseEditAnticipo}
              handleDeleteAnticipo={handleDeleteAnticipo}
            />
          ) : (
            <NotaConceptos
              user={user}
              isAdmin={isAdmin}
              isSuperUser={isSuperUser}
              isPremium={isPremium}
              onOpenCloseConfirm={onOpenCloseConfirm}
              onOpenCloseEditConcep={onOpenCloseEditConcep}
              handleDeleteConcept={handleDeleteConcept}
            />
          )
        }

        {(isAdmin || isSuperUser || user.id === nota.usuario_id) && nota?.forma_pago && (
          <div className={styles.iconPlus}>
            {(['abonos', 'anticipo'].includes(nota?.forma_pago) && calcularSaldoRestante() <= 0) ? null : (
              <div onClick={() => {
                if (nota.forma_pago === 'abonos' || nota.forma_pago === 'anticipo') {
                  if (!tieneProductoBase) {
                    setShowProductoBaseModal(true)
                  } else {
                    if (nota.forma_pago === 'abonos') {
                      setShowAbonoForm(true)
                    } else {
                      setTituloAnticipo(yaTieneAnticipo ? 'Agregar abono' : 'Agregar anticipo')
                      setShowAnticipoForm(true)
                    }
                  }
                } else {
                  setShowForm(true)
                }
              }}>
                <FaPlus />
              </div>
            )}
          </div>
        )}

        <div className={styles.sectionTotal}>
          {nota?.forma_pago === 'abonos' || nota?.forma_pago === 'anticipo' ? (
            saldoRestante <= 0 ? (
              <h1 className={styles.pagado}>PAGADO</h1>
            ) : (
              <>
                <div className={styles.sectionTotal_1}>
                  <h1>Saldo anterior:</h1>
                  <h1>Total abonado:</h1>
                  <h1>Saldo restante:</h1>
                </div>
                <div className={styles.sectionTotal_2}>
                  <h1>{formatCurrency(saldoAnterior)}</h1>
                  <h1>{formatCurrency(totalAbonado)}</h1>
                  <h1>{formatCurrency(saldoRestante)}</h1>
                </div>
              </>
            )
          ) : (
            <>
              <div className={styles.sectionTotal_1}>
                <h1>Total:</h1>
              </div>
              <div className={styles.sectionTotal_2}>
                <h1>{formatCurrency(total)}</h1>
              </div>
            </>
          )}
        </div>

        <ProductoBaseViewer
          data={nota.abonos}
          visible={nota.forma_pago === 'abonos'}
          onEdit={() => setShowEditProductoBase(true)}
          isLoading={isSyncingNota}
        />

        <ProductoBaseViewer
          data={nota.anticipos}
          visible={nota.forma_pago === 'anticipo'}
          onEdit={() => setShowEditProductoBase(true)}
          isLoading={isSyncingNota}
        />

        {(isAdmin || isSuperUser || user.id === nota?.usuario_id) &&
          <IconEdit onOpenEdit={onOpenEditNota} />
        }

        <div className={styles.mainQRPDF}>
          <div className={styles.qrMain}>
            <div onClick={onOpenCloseQR}>
              <BiQr />
            </div>
          </div>

          <NotaPDF nota={nota} datoPDF={datoPDF} conceptos={nota?.conceptos || []} abonos={nota?.abonos || []} saldoRestante={saldoRestante} totalAbonado={totalAbonado} saldoAnterior={saldoAnterior} productoBase={productoBase} ivaValue={ivaValue} />
        </div>

        {(isAdmin || isSuperUser) &&
          <IconDel setShowConfirmDel={setShowConfirmDel} />
        }

        {isAdmin &&
          <div className={styles.h1UsuarioNombre}>
            <h1>Usuario: {getValueOrDefault(nota?.usuario_nombre)}</h1>
            <h1>Negocio: {nota?.negocio_nombre}</h1>
          </div>
        }

      </div>

      <BasicModal title='modificar la nota' show={showEditNota} onClose={onOpenEditNota}>
        <NotaEditForm user={user} reload={reload} onReload={onReload} onOpenEditNota={onOpenEditNota} onToastSuccessMod={onToastSuccessMod} />
      </BasicModal>

      <BasicModal title='Agregar concepto' show={showConcep} onClose={onOpenCloseConcep}>
        <NotaConceptosForm user={user} reload={reload} onReload={onReload} onOpenCloseConcep={onOpenCloseConcep} onAddConcept={onAddConcept} onToastSuccess={onToastSuccess} />
      </BasicModal>

      <BasicModal title='Modificar concepto' show={showEditConcep} onClose={onOpenCloseEditConcep}>
        <NotaConceptosEditForm
          user={user}
          reload={reload}
          onReload={onReload}
          isAdmin={isAdmin}
          isSuperUser={isSuperUser}
          isPremium={isPremium}
          onEditConcept={onEditConcept}
          conceptToEdit={currentConcept}
          onOpenCloseEditConcep={onOpenCloseEditConcep}
          onOpenCloseConfirm={onOpenCloseConfirm}
        />
      </BasicModal>

      <BasicModal title="Agregar abono" show={showAbono} onClose={onOpenCloseAbono}>
        <NotaAbonosForm user={user} reload={reload} onReload={onReload} onOpenCloseAbono={onOpenCloseAbono} onAddAbono={onAddAbono} onToastSuccess={onToastSuccess} />
      </BasicModal>

      <BasicModal title='Modificar abono' show={showEditAbono} onClose={onOpenCloseEditAbono}>
        <NotaAbonosEditForm
          user={user}
          reload={reload}
          onReload={onReload}
          isAdmin={isAdmin}
          isSuperUser={isSuperUser}
          isPremium={isPremium}
          onEditAbono={onEditAbono}
          abonoToEdit={currentAbono}
          onOpenCloseEditAbono={onOpenCloseEditAbono}
          onOpenCloseConfirmAbono={onOpenCloseConfirmAbono}
        />
      </BasicModal>

      <BasicModal title={tituloAnticipo} show={showAnticipo} onClose={onOpenCloseAnticipo}>
        <NotaAnticiposForm
          user={user}
          reload={reload}
          onReload={onReload}
          esPrimero={!yaTieneAnticipo}
          onOpenCloseAnticipo={onOpenCloseAnticipo}
          onAddAnticipo={onAddAnticipo}
          onToastSuccess={onToastSuccess}
        />
      </BasicModal>

      <BasicModal title={tituloEditAnticipo} show={showEditAnticipo} onClose={onOpenCloseEditAnticipo}>
        <NotaAnticiposEditForm
          user={user}
          reload={reload}
          onReload={onReload}
          isAdmin={isAdmin}
          isSuperUser={isSuperUser}
          isPremium={isPremium}
          esPrimero={!yaTieneAnticipo}
          onEditAnticipo={onEditAnticipo}
          anticipoToEdit={currentAnticipo}
          onOpenCloseEditAnticipo={onOpenCloseEditAnticipo}
          onOpenCloseConfirmAnticipo={onOpenCloseConfirmAnticipo}
        />
      </BasicModal>

      <BasicModal title="Editar producto" show={showEditProductoBase} onClose={() => setShowEditProductoBase(false)}>
        <NotaProductoBaseEditForm
          show={showEditProductoBase}
          tipo={nota?.forma_pago === 'anticipo' ? 'anticipos' : 'abonos'}
          abonoToEdit={productoBase}
          onEditProductoBase={onEditProductoBase}
          onReload={onReload}
          syncNota={syncNota}
          onOpenCloseEditProductoBase={() => setShowEditProductoBase(false)}
        />
      </BasicModal>

      <BasicModal title='escanea para descargar el pdf' show={showQR} onClose={onOpenCloseQR}>
        {qrCode && (
          <QRScan qrCode={qrCode} onOpenCloseQR={onOpenCloseQR} />
        )}
      </BasicModal>

      <BasicModal title="Detalles del cliente" show={showCliente} onClose={onOpenCliente}>
        <ClienteDetalles
          user={user}
          onReload={onReload}
          syncNota={syncNota}
          onToastSuccessMod={onToastSuccessMod}
          onToastSuccessDel={onToastSuccessDel}
          onCloseDetalles={onCloseCliente}
        />
      </BasicModal>

      <Confirm
        open={showConfirm}
        onConfirm={handleDeleteConcept}
        onCancel={() => setShowConfirm(false)}
        content='¿ Estas seguro de eliminar el concepto ?'
      />

      <Confirm
        open={showConfirmAbono}
        onConfirm={handleDeleteAbono}
        onCancel={() => setShowConfirmAbono(false)}
        content='¿ Estas seguro de eliminar el abono ?'
      />

      <Confirm
        open={showConfirmAnticipo}
        onConfirm={handleDeleteAnticipo}
        onCancel={() => setShowConfirmAnticipo(false)}
        content='¿ Estas seguro de eliminar el anticipo ?'
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

/* <h1>Subtotal:</h1>

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
          </div> */


/* useEffect(() => {
    const fetchIVA = async () => {
      if (!nota.id) return
      try {
        const response = await axios.get(`/api/notas/notas?id=${nota.id}`)
        const backendIVA = response.data?.iva
        if (backendIVA !== undefined && backendIVA !== null) {
          setIvaValue(backendIVA)
        }
      } catch (err) {
        console.error("Error al cargar IVA desde backend:", err)
      }
    }

    fetchIVA()
  }, [nota.id]) */
