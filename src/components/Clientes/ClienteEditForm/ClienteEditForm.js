import { IconClose } from '@/components/Layouts'
import { useEffect, useState } from 'react'
import axios from 'axios'
import { Button, Form, FormField, FormGroup, Input, Label, Message } from 'semantic-ui-react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchClientes, setCliente, updateCliente } from '@/store/clientes/clienteSlice'
import styles from './ClienteEditForm.module.css'
import { selectCliente } from '@/store/clientes/clienteSelectors'

export function ClienteEditForm(props) {

  const { reload, onReload, onOpenCloseEdit, onToastSuccessMod } = props

  const dispatch = useDispatch()
  const cliente = useSelector(selectCliente)

  const [isLoading, setIsLoading] = useState(false)

  const [formData, setFormData] = useState({
    cliente: '',
    contacto: '',
    cel: '',
    direccion: '',
    email: ''
  })

  const [errors, setErrors] = useState({})

  useEffect(() => {
    if (!cliente) return
  
    setFormData((prev) => {
      const isEqual =
        prev.cliente === cliente.cliente &&
        prev.contacto === cliente.contacto &&
        prev.cel === cliente.cel &&
        prev.direccion === cliente.direccion &&
        prev.email === cliente.email
  
      if (isEqual) return prev
  
      return {
        cliente: cliente.cliente || '',
        contacto: cliente.contacto || '',
        cel: cliente.cel || '',
        direccion: cliente.direccion || '',
        email: cliente.email || ''
      }
    })
  }, [cliente])  

  const validarForm = () => {
    const newErrors = {}

    if (!formData.cliente) {
      newErrors.cliente = 'El campo es requerido'
    }

    setErrors(newErrors)

    return Object.keys(newErrors).length === 0

  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
  }

  const handleSubmit = async (e) => {

    e.preventDefault()

    if (!validarForm()) {
      return
    }

    setIsLoading(true)

    try {
      await axios.put(`/api/clientes/clientes?id=${cliente.id}`, {
        ...formData
      })
      
      const res = await axios.get(`/api/clientes/clientes?id=${cliente.id}`) 
      dispatch(setCliente(res.data))

      onReload()
      onOpenCloseEdit()
      onToastSuccessMod()
    } catch (error) {
      console.error('Error actualizando el cliente:', error)
    } finally {
        setIsLoading(false)
    }
  }

  return (

    <>

      <IconClose onOpenClose={onOpenCloseEdit} />

      <Form>
        <FormGroup widths='equal'>
          <FormField error={!!errors.cliente}>
            <Label>
              Nombre
            </Label>
            <Input
              type="text"
              name="cliente"
              value={formData.cliente}
              onChange={handleChange}
            />
            {errors.cliente && <Message>{errors.cliente}</Message>}
          </FormField>
          <FormField>
            <Label>
              Contacto
            </Label>
            <Input
              type="text"
              name="contacto"
              value={formData.contacto}
              onChange={handleChange}
            />
          </FormField>
          <FormField>
            <Label>
              Celular
            </Label>
            <Input
              type="text"
              name="cel"
              value={formData.cel}
              onChange={handleChange}
            />
          </FormField>
          <FormField>
            <Label>
              Dirección
            </Label>
            <Input
              type="text"
              name="direccion"
              value={formData.direccion}
              onChange={handleChange}
            />
          </FormField>
          <FormField>
            <Label>
              Correo
            </Label>
            <Input
              type="text"
              name="email"
              value={formData.email}
              onChange={handleChange}
            />
          </FormField>
        </FormGroup>
        <Button primary loading={isLoading} onClick={handleSubmit}>
          Guardar
        </Button>
      </Form>

    </>

  )
}
