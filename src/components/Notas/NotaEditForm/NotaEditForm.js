import { IconClose } from '@/components/Layouts/IconClose/IconClose'
import { useEffect, useState } from 'react'
import axios from 'axios'
import { Button, Dropdown, Form, FormField, FormGroup, Input, Label, Message } from 'semantic-ui-react'
import { FaPlus } from 'react-icons/fa'
import { BasicModal } from '@/layouts'
import { ClienteForm } from '@/components/Clientes'
import { ErrorAccesso, ToastSuccess } from '@/components/Layouts'
import { useSelector, useDispatch } from 'react-redux'
import { selectNota, selectNotaError } from '@/store/notas/notaSelectors'
import { setNota } from '@/store/notas/notaSlice'
import styles from './NotaEditForm.module.css'
import { fetchClientes } from '@/store/clientes/clienteSlice'

export function NotaEditForm(props) {

  const { user, reload, onReload, onOpenEditNota, onToastSuccessMod } = props

  const dispatch = useDispatch()
  const nota = useSelector(selectNota)
  const errorNotas = useSelector(selectNotaError)

  const [isLoading, setIsLoading] = useState(false)

  const [show, setShow] = useState(false)

  const onOpenCloseClienteForm = () => setShow((prevState) => !prevState)

  const [formData, setFormData] = useState({
    nota: '',
    cliente_id: ''
  })

  useEffect(() => {
    if (nota) {
      setFormData({
        nota: nota.nota || '',
        cliente_id: nota.cliente_id || ''
      })
    }
  }, [nota])
  
  const [errors, setErrors] = useState({})

  const validarForm = () => {
    const newErrors = {}

    if (!formData.nota) {
      newErrors.nota = 'El campo es requerido'
    }

    if (!formData.cliente_id) {
      newErrors.cliente_id = 'El campo es requerido'
    }

    setErrors(newErrors)

    return Object.keys(newErrors).length === 0

  }

  useEffect(() => {
    if (!user) return
    dispatch(fetchClientes(user.negocio_id))
  }, [dispatch, user])
  
  const clientes = useSelector(state => state.clientes?.clientes)

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
  }

  const handleDropdownChange = (e, { value }) => {
    const clienteSeleccionado = clientes.find((cliente) => cliente.id === value);
  
    setFormData({
      ...formData,
      cliente_id: value,
      cliente_nombre: clienteSeleccionado ? clienteSeleccionado.cliente : '',
      cliente_contacto: clienteSeleccionado ? clienteSeleccionado.contacto : ''
    })
  }  

  const handleSubmit = async (e) => {

    e.preventDefault()

    if (!validarForm()) {
      return
    }

    setIsLoading(true)

    const clienteSeleccionado = clientes.find((cliente) => cliente.id === formData.cliente_id)
    const cliente_nombre = clienteSeleccionado ? clienteSeleccionado.cliente : ''
    const cliente_contacto = clienteSeleccionado ? clienteSeleccionado.contacto : ''

    try {
      await axios.put(`/api/notas/notas?id=${nota.id}`, {
        ...formData,
        cliente_nombre,
        cliente_contacto 
      })
  
      const res = await axios.get(`/api/notas/notas?id=${nota.id}`)
      dispatch(setNota(res.data))

      onReload()
      onOpenEditNota()
      onToastSuccessMod()
    } catch (error) {
      console.error('Error actualizando la nota:', error)
    } finally{
        setIsLoading(false)
    }
  }

  const [toastSuccessCliente, setToastSuccessCCliente] = useState(false)

  const onToastSuccessCliente = () => {
    setToastSuccessCCliente(true)
    setTimeout(() => {
      setToastSuccessCCliente(false)
    }, 3000)
  }


  return (

    <>

      <IconClose onOpenClose={onOpenEditNota} />

      {toastSuccessCliente && <ToastSuccess contain='Cliente creado exitosamente' onClose={() => setToastSuccessCliente(false)} />}

      <Form>
        <FormGroup widths='equal'>
          <FormField error={!!errors.nota}>
            <Label>
              Nota
            </Label>
            <Input
              type="text"
              name="nota"
              value={formData.nota}
              onChange={handleChange}
            />
            {errors.nota && <Message>{errors.nota}</Message>}
          </FormField>
          <FormField error={!!errors.cliente_id}>
            <Label>Cliente</Label>
            <Dropdown
              placeholder= {clientes.length === 0 ? 'No hay clientes' : 'Seleccionar'}
              fluid
              selection
              options={clientes.map(cliente => ({
                key: cliente.id,
                text: cliente.cliente,
                value: cliente.id
              }))}
              value={formData.cliente_id}
              onChange={handleDropdownChange}
            />
            <div className={styles.addCliente} onClick={onOpenCloseClienteForm}>
              <h1>Crear cliente</h1>
              <FaPlus />
            </div>
            {errors.cliente_id && <Message>{errors.cliente_id}</Message>}
          </FormField>
        </FormGroup>
        <Button primary loading={isLoading} onClick={handleSubmit}>
          Guardar
        </Button>
      </Form>

      <BasicModal title='crear cliente' show={show} onClose={onOpenCloseClienteForm}>
        <ClienteForm user={user} reload={reload} onReload={onReload} onCloseForm={onOpenCloseClienteForm} onToastSuccess={onToastSuccessCliente} />
      </BasicModal>

      {errorNotas && (
        <BasicModal title="Error de acceso" show={errorModalOpen} onClose={() => dispatch(setError(null))}>
          <ErrorAccesso apiError={errorNotas} onOpenCloseErrorModal={() => dispatch(setError(null))} />
        </BasicModal>
      )}

    </>

  )
}
