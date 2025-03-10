import { Confirm, IconClose, ToastSuccess } from '@/components/Layouts'
import { Button, Dropdown, Form, FormField, FormGroup, Input, Label, Message } from 'semantic-ui-react'
import { formatCurrency, genNVId } from '@/helpers'
import { useEffect, useState } from 'react'
import axios from 'axios'
import { useAuth } from '@/contexts/AuthContext'
import { FaCheck, FaPlus, FaTimes, FaTrash } from 'react-icons/fa'
import { RowHeadModal } from '../RowHead'
import { BiSolidToggleLeft, BiSolidToggleRight } from 'react-icons/bi'
import { ClienteForm } from '@/components/Clientes'
import { BasicModal } from '@/layouts'
import styles from './NotaForm.module.css'
import { ConceptosForm } from '../ConceptosForm'
import { ConceptosEditForm } from '../ConceptosEditForm'

export function NotaForm(props) {
  const { reload, onReload, onOpenCloseForm, onToastSuccess } = props
  const { user } = useAuth()

  const [showConfirm, setShowConfirm] = useState(false)
  const [show, setShow] = useState(false)
  const [toastSuccessCliente, setToastSuccessCliente] = useState(false)
  const [clientes, setClientes] = useState([])
  const [cliente_id, setCliente] = useState('')
  const [nota, setNota] = useState('')
  const [conceptos, setConceptos] = useState([])
  const [nuevoConcepto, setNuevoConcepto] = useState({ tipo: '', concepto: '', precio: '', cantidad: '' })
  const [toggleIVA, setToggleIVA] = useState(false)
  const [ivaValue, setIvaValue] = useState(16)
  const [conceptoAEliminar, setConceptoAEliminar] = useState(null)

  const [errors, setErrors] = useState({})
  const [showConcep, setShowForm] = useState(false)

  const onOpenCloseClienteForm = () => setShow((prevState) => !prevState)

  const onToastSuccessCliente = () => {
    setToastSuccessCliente(true)
    setTimeout(() => setToastSuccessCliente(false), 3000)
  }

  const onOpenCloseConcep = () => setShowForm((prevState) => !prevState)

  const onOpenCloseConfirm = (index) => {
    setConceptoAEliminar(index)
    setShowConfirm(true)
  }

  const [showEditConcep, setShowEditConcep] = useState(null)
  const [conceptoEdit, setConceptoEdit] = useState(null)

  const onOpenEditConcep = (index) => {
    setConceptoEdit(conceptos[index])
    setShowEditConcep(true)
  }

  const onCloseEditConcep = () => {
    setConceptoEdit(null)
    setShowEditConcep(false)
  }

  const onHideConfirm = () => setShowConfirm(false)

  const validarForm = () => {
    const newErrors = {}
    if (!cliente_id) newErrors.cliente_id = 'El campo es requerido'
    if (!nota) newErrors.nota = 'El campo es requerido'
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const fetchClientes = async () => {
    if (user && user.id) {
      try {
        const res = await axios.get(`/api/clientes/clientes?usuario_id=${user.id}`)
        setClientes(res.data)
      } catch (error) {
        console.error('Error al obtener los clientes:', error)
      }
    }
  }

  useEffect(() => {
    fetchClientes()
  }, [reload, user])

  const crearNota = async (e) => {
    e.preventDefault()

    if (!validarForm()) return

    const folio = genNVId(4)
    try {
      const res = await axios.post('/api/notas/notas', {
        usuario_id: user.id,
        folio,
        cliente_id,
        nota,
        iva: ivaValue
      })

      const notaId = res.data.id
      await Promise.all(conceptos.map(concepto =>
        axios.post('/api/notas/conceptos', {
          nota_id: notaId,
          usuario_id: user.id,
          tipo: concepto.tipo,
          concepto: concepto.concepto,
          precio: concepto.precio,
          cantidad: concepto.cantidad,
          total: concepto.total
        })
      ))

      setNota('')
      setCliente('')
      setConceptos([])
      onReload()
      onOpenCloseForm()
      onToastSuccess()
    } catch (error) {
      console.error('Error al crear la nota:', error)
    }
  }

  const añadirConcepto = (concepto) => {
    const total = concepto.precio * concepto.cantidad
    setConceptos([...conceptos, { ...concepto, total }])
  }

  const eliminarConcepto = () => {
    const nuevosConceptos = conceptos.filter((_, i) => i !== conceptoAEliminar)
    setConceptos(nuevosConceptos)
    setShowConfirm(false)
  }

  const calcularTotales = () => {
    const subtotal = conceptos.reduce((acc, curr) => acc + curr.cantidad * curr.precio, 0)
    const ivaDecimal = ivaValue / 100
    const iva = subtotal * ivaDecimal
    const total = subtotal + iva
    return { subtotal, iva, total }
  }

  const { subtotal, iva, total } = calcularTotales()

  const handleIvaChange = (e) => {
    let value = e.target.value
    if (/^\d{0,2}$/.test(value)) setIvaValue(value)
  }

  const onIVA = () => setToggleIVA(prevState => !prevState)

  return (
    <>
      <IconClose onOpenClose={onOpenCloseForm} />
      {toastSuccessCliente && <ToastSuccess contain='Creado exitosamente' onClose={() => setToastSuccessCliente(false)} />}

      <div className={styles.main}>
        <Form>
          <FormGroup widths='equal'>
            <FormField error={!!errors.nota}>
              <Label>Nota</Label>
              <Input
                type="text"
                value={nota || ''}
                onChange={(e) => setNota(e.target.value)}
              />
              {errors.nota && <Message negative>{errors.nota}</Message>}
            </FormField>
            <FormField error={!!errors.cliente_id}>
              <Label>Cliente</Label>
              <Dropdown
                placeholder='Selecciona un cliente'
                fluid
                selection
                options={clientes.map(cliente => ({
                  key: cliente.id,
                  text: cliente.cliente,
                  value: cliente.id
                }))}
                value={cliente_id}
                onChange={(e, { value }) => setCliente(value)}
              />
              <div className={styles.addCliente}>
                <h1>Crear cliente</h1>
                <FaPlus onClick={onOpenCloseClienteForm} />
              </div>
              {errors.cliente_id && <Message negative>{errors.cliente_id}</Message>}
            </FormField>
          </FormGroup>
        </Form>

        <div className={styles.section}>
          <RowHeadModal rowMain />
          {conceptos.map((concepto, index) => (
            <div key={index} className={styles.rowMap} onClick={() => onOpenEditConcep(index)}>
              <h1>{concepto.tipo}</h1>
              <h1>{concepto.concepto}</h1>
              <h1>${formatCurrency(concepto.precio * 1)}</h1>
              <h1>{concepto.cantidad}</h1>
              <h1>${formatCurrency(concepto.precio * concepto.cantidad)}</h1>
            </div>
          ))}

          <div className={styles.iconPlus}>
            <div onClick={onOpenCloseConcep}>
              <FaPlus />
            </div>
          </div>

          <div className={styles.box3}>
            <div className={styles.box3_1}>
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
                  <h1>%</h1>
                  <BiSolidToggleRight onClick={onIVA} />
                  <h1>IVA:</h1>
                </div>
              )}

              <h1>Total:</h1>
            </div>

            <div className={styles.box3_2}>
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
        </div>

        <Button primary onClick={crearNota}>Crear</Button>
      </div>

      <BasicModal title='crear cliente' show={show} onClose={onOpenCloseClienteForm}>
        <ClienteForm reload={reload} onReload={onReload} onCloseForm={onOpenCloseClienteForm} onToastSuccess={onToastSuccessCliente} />
      </BasicModal>

      <BasicModal title='Agregar concepto' show={showConcep} onClose={onOpenCloseConcep}>
        <ConceptosForm añadirConcepto={añadirConcepto} onOpenCloseConcep={onOpenCloseConcep} />
      </BasicModal>

      <BasicModal title="Editar concepto" show={showEditConcep} onClose={onOpenEditConcep}>
        <ConceptosEditForm
          concepto={conceptoEdit}
          onSave={(updatedConcepto) => {
  
            const updatedConceptos = conceptos.map((concepto) =>
              concepto === conceptoEdit ? updatedConcepto : concepto
            )
            setConceptos(updatedConceptos)      
          }}
          onCloseEditConcep={onCloseEditConcep}
          onOpenCloseConfirm={onOpenCloseConfirm}
        />
      </BasicModal>


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
        onConfirm={eliminarConcepto}
        onCancel={onHideConfirm}
        content='¿Estás seguro de eliminar el concepto?'
      />
    </>
  )
}
