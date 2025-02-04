import { IconClose } from '@/components/Layouts'
import { Button, Form, FormField, FormGroup, Input, Label, Message } from 'semantic-ui-react'
import { useState } from 'react'
import { genCLId } from '@/helpers'
import axios from 'axios'
import styles from './ClienteForm.module.css'
import { useAuth } from '@/contexts/AuthContext'

export function ClienteForm(props) {

  const { reload, onReload, onToastSuccess, onCloseForm } = props

  const {user} = useAuth()

  const [cliente, setCliente] = useState('')
  const [contacto, setContacto] = useState('')
  const [cel, setCel] = useState('')
  const [email, setEmail] = useState('')
  const [direccion, setDireccion] = useState('')

  const [errors, setErrors] = useState({})

  const validarForm = () => {
    const newErrors = {}

    if (!cliente) {
      newErrors.cliente = 'El campo es requerido'
    }

    if (!contacto) {
      newErrors.contacto = 'El campo es requerido'
    }

    setErrors(newErrors)

    return Object.keys(newErrors).length === 0
  }

  const crearCliente = async (e) => {
    e.preventDefault()

    if(!validarForm()){
      return
    }

    const folio = genCLId(4)

    try {
      await axios.post ('/api/clientes/clientes', {
        usuario_id: user.id,
        folio,
        cliente, 
        contacto, 
        cel, 
        email,
        direccion 
      })

      setCliente('')
      setContacto('')
      setCel('')
      setEmail('')
      setDireccion('')

      onReload()
      onCloseForm()
      onToastSuccess()

    } catch (error) {
        console.error('Error al crear el cliente:', error)
    }

  }

  return (

    <>

      <IconClose onOpenClose={onCloseForm} />

      <Form>
        <FormGroup widths='equal'>
          <FormField error={!!errors.cliente}>
            <Label>Cliente</Label>
            <Input
              type="text"
              value={cliente}
              onChange={(e) => setCliente(e.target.value)}
            />
            {errors.cliente && <Message negative>{errors.cliente}</Message>}
          </FormField>
          <FormField error={!!errors.contacto}>
            <Label>Contacto</Label>
            <Input
              type="text"
              value={contacto}
              onChange={(e) => setContacto(e.target.value)}
            />
            {errors.contacto && <Message negative>{errors.contacto}</Message>}
          </FormField>
          <FormField error={!!errors.cel}>
            <Label>Celular</Label>
            <Input
              type="number"
              value={cel}
              onChange={(e) => setCel(e.target.value)}
            />
            {errors.cel && <Message negative>{errors.cel}</Message>}
          </FormField>
          <FormField>
            <Label>Correo</Label>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </FormField>
          <FormField>
            <Label>Dirección</Label>
            <Input
              type="text"
              value={direccion}
              onChange={(e) => setDireccion(e.target.value)}
            />
          </FormField>
        </FormGroup>
        <Button primary onClick={crearCliente}>Crear</Button>
      </Form>

    </>

  )
}
