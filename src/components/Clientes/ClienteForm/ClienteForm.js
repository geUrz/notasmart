import styles from './ClienteForm.module.css'
import { IconClose } from '@/components/Layouts'
import { Button, Form, FormField, FormGroup, Input, Label, Message } from 'semantic-ui-react'
import { useState } from 'react'
import { genCLId } from '@/helpers'
import axios from 'axios'
import { useDispatch } from 'react-redux'
import { fetchClientes } from '@/store/clientes/clienteSlice'

export function ClienteForm(props) {

  const { user, reload, onReload, onToastSuccess, onCloseForm } = props

  const dispatch = useDispatch()
  
  const [isLoading, setIsLoading] = useState(false)

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

    setErrors(newErrors)

    return Object.keys(newErrors).length === 0
  }

  const crearCliente = async (e) => {
    e.preventDefault()

    if(!validarForm()){
      return
    }

    setIsLoading(true)

    const folio = genCLId(4)

    try {
      await axios.post ('/api/clientes/clientes', {
        usuario_id: user.id,
        usuario_nombre: user.nombre,
        folio,
        cliente, 
        contacto, 
        cel, 
        email,
        direccion,
        negocio_id: user.negocio_id,
        negocio_nombre: user.negocio_nombre 
      })

      dispatch(fetchClientes(user.negocio_id))

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
    } finally {
        setIsLoading(false)
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
            {errors.cliente && <Message>{errors.cliente}</Message>}
          </FormField>
          <FormField>
            <Label>Contacto</Label>
            <Input
              type="text"
              value={contacto}
              onChange={(e) => setContacto(e.target.value)}
            />
          </FormField>
          <FormField>
            <Label>Celular</Label>
            <Input
              type="number"
              value={cel}
              onChange={(e) => setCel(e.target.value)}
            />
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
        <Button primary loading={isLoading} onClick={crearCliente}>Crear</Button>
      </Form>

    </>

  )
}
