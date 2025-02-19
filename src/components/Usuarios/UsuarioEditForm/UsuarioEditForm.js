import { IconClose } from '@/components/Layouts'
import { useEffect, useState } from 'react'
import axios from 'axios'
import { Button, Dropdown, Form, FormField, FormGroup, Input, Label, Message } from 'semantic-ui-react'
import styles from './UsuarioEditForm.module.css'

export function UsuarioEditForm(props) {

  const { reload, onReload, usuarioData, actualizarUsuario, onOpenCloseEdit, onToastSuccessMod } = props

  const [formData, setFormData] = useState({
    nombre: usuarioData.nombre,
    usuario: usuarioData.usuario,
    email: usuarioData.email,
    nivel: usuarioData.nivel,
    folios: usuarioData.folios,
    isactive: usuarioData.isactive,
    newPassword: '',
    confirmPassword: ''
  })

  const [errors, setErrors] = useState({})

  const validarForm = () => {
    const newErrors = {}

    if (!formData.usuario) {
      newErrors.usuario = 'El campo es requerido'
    }

    if (!formData.nombre) {
      newErrors.nombre = 'El campo es requerido'
    }

    if (!formData.nivel) {
      newErrors.nivel = 'El campo es requerido'
    }

    if (!formData.folios) {
      newErrors.folios = 'El campo es requerido'
    }

    if (!formData.isactive) {
      newErrors.isactive = 'El campo es requerido'
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

    if (formData.newPassword && formData.newPassword !== formData.confirmPassword) {
      setError('Las contraseñas no coinciden')
      return
    }

    try {
      await axios.put(`/api/usuarios/usuarios?id=${usuarioData.id}`, {
        nombre: formData.nombre,
        usuario: formData.usuario,
        email: formData.email,
        nivel: formData.nivel,
        folios: usuarioData.folios,
        isactive: formData.isactive,
        newPassword: formData.newPassword
      })
      
      onReload()
      actualizarUsuario(formData)
      onOpenCloseEdit()
      onToastSuccessMod()
    } catch (error) {
      console.error('Error actualizando el usuario:', error)
    }
  }

  const opcionesNivel = [
    { key: 1, text: 'Admin', value: 'admin' },
    { key: 2, text: 'Usuario', value: 'usuario' }
  ]

  const opcionesIsActive = [
    { key: 1, text: 'Activo', value: 1 },
    { key: 2, text: 'Inactivo', value: 0 }
  ]

  return (

    <>

      <IconClose onOpenClose={onOpenCloseEdit} />

      <Form>
        <FormGroup widths='equal'>
          <FormField error={!!errors.nombre}>
            <Label>
              Nombre
            </Label>
            <Input
              type="text"
              name="nombre"
              value={formData.nombre}
              onChange={handleChange}
            />
            {errors.nombre && <Message negative>{errors.nombre}</Message>}
          </FormField>
          <FormField error={!!errors.usuario}>
            <Label>
              Usuario
            </Label>
            <Input
              type="text"
              name="usuario"
              value={formData.usuario}
              onChange={handleChange}
            />
            {errors.usuario && <Message negative>{errors.usuario}</Message>}
          </FormField>
          <FormField>
            <Label>
              Correo
            </Label>
            <Input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
            />
          </FormField>
          <FormField error={!!errors.nivel}>
            <Label>
              Nivel
            </Label>
            <Dropdown
              placeholder='Selecciona una opción'
              fluid
              selection
              options={opcionesNivel}
              value={formData.nivel}
              onChange={(e, { value }) => setFormData({ ...formData, nivel: value })}
            />
            {errors.nivel && <Message negative>{errors.nivel}</Message>}
          </FormField>
          <FormField error={!!errors.folios}>
            <Label>
              Folios
            </Label>
            <Input
              type="text"
              name="folios"
              value={formData.folios}
              onChange={handleChange}
            />
            {errors.folios && <Message negative>{errors.folios}</Message>}
          </FormField>
          <FormField error={!!errors.isactive}>
            <Label>
              Activo
            </Label>
            <Dropdown
              placeholder='Selecciona una opción'
              fluid
              selection
              options={opcionesIsActive}
              value={formData.isactive}
              onChange={(e, { value }) => setFormData({ ...formData, isactive: Number(value) })}
            />
            {errors.isactive && <Message negative>{errors.isactive}</Message>}
          </FormField>
          <FormField>
            <Label>Nueva contraseña</Label>
            <Input
              name='newPassword'
              type='password'
              value={formData.newPassword}
              onChange={handleChange}
            />
          </FormField>
          <FormField>
            <Label>Confirmar nueva contraseña</Label>
            <Input
              name='confirmPassword'
              type='password'
              value={formData.confirmPassword}
              onChange={handleChange}
            />
          </FormField>
        </FormGroup>
        <Button primary onClick={handleSubmit}>
          Guardar
        </Button>
      </Form>

    </>

  )
}
