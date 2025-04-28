import { useState } from 'react'
import axios from 'axios'
import { useAuth } from '@/contexts/AuthContext'
import { Form, Button, Input, Label, FormGroup, FormField, Message } from 'semantic-ui-react'
import { EditPass, IconClose, IconKey, ToastSuccess } from '@/components/Layouts'
import styles from './ModCuentaForm.module.css'
import { BasicModal } from '@/layouts'

export function ModCuentaForm(props) {

  const { onOpenClose } = props

  const [isLoading, setIsLoading] = useState(false)

  const [showEditPass, setShowEditPass] = useState(false)

  const onOpenCloseEditPass = () => setShowEditPass((prevState) => !prevState)

  const { user, logout } = useAuth()

  const [formData, setFormData] = useState({
    newNombre: user.nombre || '',
    newUsuario: user.usuario || '',
    newEmail: user.email || '',
    newPassword: ''
  })

  const [error, setError] = useState(null)
  const [errors, setErrors] = useState({})

  const validarFormUser = () => {
    const newErrors = {}

    if (!formData.newNombre) {
      newErrors.newNombre = 'El campo es requerido';
    }

    if (!formData.newUsuario) {
      newErrors.newUsuario = 'El campo es requerido';
    }

    if (!formData.newEmail) {
      newErrors.newEmail = 'El campo es requerido';
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  }

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!validarFormUser()) {
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      await axios.put('/api/auth/updateUser', {
        userId: user.id,
        newNombre: formData.newNombre,
        newUsuario: formData.newUsuario,
        newEmail: formData.newEmail
      })

      logout()

    } catch (error) {
      console.error('Error al actualizar el perfil:', error);
      if (error.response && error.response.data && error.response.data.error) {
        setError(error.response.data.error);
      } else {
        setError('Ocurrió un error inesperado');
      }
    } finally {
      setIsLoading(false)
    }
  }

  const [toastSuccessMod, setToastSuccessMod] = useState(false)

  const onToastSuccessMod = () => {
    setToastSuccessMod(true)
    setTimeout(() => {
      setToastSuccessMod(false)
    }, 3000)
  }

  return (

    <>

    {toastSuccessMod && <ToastSuccess contain='Modificado exitosamente' onClose={() => setToastSuccessMod(false)} />}

      <IconClose onOpenClose={onOpenClose} />

      <Form>
        <FormGroup>
          <FormField error={!!errors.newNombre}>
            <Label>Nombre</Label>
            <Input
              name='newNombre'
              type='text'
              value={formData.newNombre}
              onChange={handleChange}
            />
            {errors.newNombre && <Message>{errors.newNombre}</Message>}
          </FormField>
          <FormField error={!!errors.newUsuario}>
            <Label>Usuario</Label>
            <Input
              name='newUsuario'
              type='text'
              value={formData.newUsuario}
              onChange={handleChange}
            />
            {errors.newUsuario && <Message>{errors.newUsuario}</Message>}
          </FormField>
          <FormField error={!!errors.newEmail}>
            <Label>Correo</Label>
            <Input
              name='newEmail'
              type='email'
              value={formData.newEmail}
              onChange={handleChange}
            />
            {errors.newEmail && <Message>{errors.newEmail}</Message>}
          </FormField>
        </FormGroup>
        <IconKey onOpenCloseEditPass={onOpenCloseEditPass} />
        {error && <Message>{error}</Message>}
        <Button primary loading={isLoading} onClick={handleSubmit}>Guardar</Button>
      </Form>

      <BasicModal title='Modificar contraseña' show={showEditPass} onClose={onOpenCloseEditPass}>
        <EditPass usuario={user} onOpenCloseEditPass={onOpenCloseEditPass} onToastSuccessUsuarioMod={onToastSuccessMod} />
      </BasicModal>

    </>

  )
}
