import { IconClose } from '@/components/Layouts'
import { useState } from 'react'
import axios from 'axios'
import { Button, Form, FormField, FormGroup, Input, Label, Message } from 'semantic-ui-react'
import styles from './ClienteEditForm.module.css'

export function ClienteEditForm(props) {

  const { reload, onReload, clienteData, actualizarCliente, onOpenCloseEdit, onToastSuccessMod } = props

  const [isLoading, setIsLoading] = useState(false)

  const [formData, setFormData] = useState({
    cliente: clienteData.cliente,
    contacto: clienteData.contacto,
    cel: clienteData.cel,
    direccion: clienteData.direccion,
    email: clienteData.email
  })

  const [errors, setErrors] = useState({})

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
      await axios.put(`/api/clientes/clientes?id=${clienteData.id}`, {
        ...formData
      })
      onReload()
      actualizarCliente(formData)
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
