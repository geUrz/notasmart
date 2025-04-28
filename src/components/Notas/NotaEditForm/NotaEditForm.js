import { IconClose } from '@/components/Layouts/IconClose/IconClose'
import { useEffect, useState } from 'react'
import axios from 'axios'
import { Button, Dropdown, Form, FormField, FormGroup, Input, Label, Message } from 'semantic-ui-react'
import { FaPlus } from 'react-icons/fa'
import { BasicModal } from '@/layouts'
import { ClienteForm } from '@/components/Clientes'
import { ToastSuccess } from '@/components/Layouts'
import styles from './NotaEditForm.module.css'

export function NotaEditForm(props) {

  const { user, reload, onReload, notaData, actualizarNota, onOpenEditNota, onToastSuccessMod } = props

  const [isLoading, setIsLoading] = useState(false)

  const [show, setShow] = useState(false)

  const onOpenCloseClienteForm = () => setShow((prevState) => !prevState)

  const [formData, setFormData] = useState({
    nota: notaData.nota,
    cliente_id: notaData.cliente_id
  })
  
  
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

  const [clientes, setClientes] = useState([])
  
  const fetchClientes = async () => {
    if (user && user.id) {
      if(user.nivel == 'admin'){
        try {
          const res = await axios.get(`/api/clientes/clientes`)
          setClientes(res.data)
        } catch (error) {
          console.error('Error al obtener los clientes:', error)
        }
      }else if(user.nivel == 'usuario'){
        try {
          const res = await axios.get(`/api/clientes/clientes?usuario_id=${user.id}`)
          setClientes(res.data)
        } catch (error) {
          console.error('Error al obtener los clientes:', error)
        }
      }
    }
  }

  useEffect(() => {
    fetchClientes()
  }, [reload, user])

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
      await axios.put(`/api/notas/notas?id=${notaData.id}`, {
        ...formData,
        cliente_nombre,
        cliente_contacto 
      })
  
      actualizarNota({
        ...formData,
        cliente_nombre,
        cliente_contacto
      }) 

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
              placeholder='Seleccionar'
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
        <ClienteForm reload={reload} onReload={onReload} onCloseForm={onOpenCloseClienteForm} onToastSuccess={onToastSuccessCliente} />
      </BasicModal>

    </>

  )
}
