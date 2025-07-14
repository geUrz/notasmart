// UsuarioForm.js
import { Button, Dropdown, Form, FormField, FormGroup, Input, Label, Message } from 'semantic-ui-react'
import { useEffect, useState } from 'react'
import axios from 'axios'
import { IconClose } from '@/components/Layouts'
import { genUserId } from '@/helpers'
import styles from './UsuarioForm.module.css'
import { BasicModal } from '@/layouts'
import { FaPlus } from 'react-icons/fa'
import { NegocioForm } from '@/components/Negocios'

export function UsuarioForm(props) {
  const { user, reload, onReload, onOpenCloseForm, onToastSuccess } = props;

  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)
  const [negocios, setNegocios] = useState([])
  const [showNegocioForm, setShowNegocioForm] = useState(false)

  const [credentials, setCredentials] = useState({
    nombre: '',
    usuario: '',
    email: '',
    nivel: '',
    negocio_id: '',
    negocio_nombre: '',
    password: '',
    confirmarPassword: ''
  })

  const [errors, setErrors] = useState({})

  const onOpenCloseNegocioForm = () => setShowNegocioForm(prev => !prev)

  useEffect(() => {
    (async () => {
      try {
        const res = await axios.get('/api/negocios/negocios')
        setNegocios(res.data)
      } catch (error) {
        console.error(error)
      }
    })()
  }, [reload, user])

  const handleChange = (e, { name, value }) => {
    if (name === 'plan') {
      setCredentials(prev => ({
        ...prev,
        plan: value,
        folios: foliosPorPlan[value] || ''
      }))
    } else if (name === 'negocio_id') {
      const negocioSeleccionado = negocios.find(n => n.id === value)
      setCredentials(prev => ({
        ...prev,
        negocio_id: value,
        negocio_nombre: negocioSeleccionado ? negocioSeleccionado.negocio : ''
      }))
    } else {
      setCredentials(prev => ({
        ...prev,
        [name]: value
      }))
    }
  }

  const validarFormSignUp = () => {
    const newErrors = {}
    if (!credentials.nombre) newErrors.nombre = 'El campo es requerido'
    if (!credentials.usuario) newErrors.usuario = 'El campo es requerido'
    if (!credentials.nivel) newErrors.nivel = 'El campo es requerido'
    if (!credentials.password) newErrors.password = 'El campo es requerido'
    if (!credentials.confirmarPassword) newErrors.confirmarPassword = 'El campo es requerido'
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validarFormSignUp()) return

    if (credentials.password !== credentials.confirmarPassword) {
      setError("Las contraseñas no coinciden")
      return
    }

    const folio = genUserId(4)
    const isactive = 1

    setIsLoading(true)
    setError(null)

    try {
      await axios.post('/api/usuarios/usuarios', {
        ...credentials,
        folio,
        isactive
      })

      setCredentials({
        nombre: '',
        usuario: '',
        email: '',
        nivel: '',
        negocio_id: '',
        negocio_nombre: '',
        password: '',
        confirmarPassword: ''
      })

      onReload()
      onOpenCloseForm()
      onToastSuccess()
    } catch (error) {
      console.error('Error capturado:', error)
      setError(error.response?.data?.error || error.message || '¡ Ocurrió un error inesperado !')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      <IconClose onOpenClose={onOpenCloseForm} />
      <div className={styles.main}>
        <div className={styles.container}>
          <Form onSubmit={handleSubmit}>
            <FormGroup widths='equal'>
              <FormField error={!!errors.nombre}>
                <Label>Nombre</Label>
                <Input name='nombre' type='text' value={credentials.nombre} onChange={handleChange} />
                {errors.nombre && <Message>{errors.nombre}</Message>}
              </FormField>
              <FormField error={!!errors.usuario}>
                <Label>Usuario</Label>
                <Input name='usuario' type='text' value={credentials.usuario} onChange={handleChange} />
                {errors.usuario && <Message>{errors.usuario}</Message>}
              </FormField>
              <FormField>
                <Label>Correo</Label>
                <Input name='email' type='email' value={credentials.email} onChange={handleChange} />
              </FormField>
              <FormField error={!!errors.nivel}>
                <Label>Nivel</Label>
                <Dropdown
                  name='nivel'
                  placeholder='Seleccionar'
                  fluid
                  selection
                  options={[
                    { key: 'Admin', text: 'Admin', value: 'admin' },
                    { key: 'UsuarioSU', text: 'UsuarioSU', value: 'usuariosu' },
                    { key: 'Usuario', text: 'Usuario', value: 'usuario' }
                  ]}
                  value={credentials.nivel}
                  onChange={handleChange}
                />
                {errors.nivel && <Message>{errors.nivel}</Message>}
              </FormField>
              <FormField>
                <Label>Negocio</Label>
                <Dropdown
                  placeholder='Seleccionar'
                  fluid
                  selection
                  name='negocio_id'
                  options={negocios.map(negocio => ({
                    key: negocio.id,
                    text: negocio.negocio,
                    value: negocio.id
                  }))}
                  value={credentials.negocio_id}
                  onChange={handleChange}
                />
                <div className={styles.addNegocio}>
                  <h1>Crear negocio</h1>
                  <FaPlus onClick={onOpenCloseNegocioForm} />
                </div>
              </FormField>
              <FormField error={!!errors.password}>
                <Label>Contraseña</Label>
                <Input name='password' type='password' value={credentials.password} onChange={handleChange} />
                {errors.password && <Message>{errors.password}</Message>}
              </FormField>
              <FormField error={!!errors.confirmarPassword}>
                <Label>Confirmar contraseña</Label>
                <Input name='confirmarPassword' type='password' value={credentials.confirmarPassword} onChange={handleChange} />
                {errors.confirmarPassword && <Message>{errors.confirmarPassword}</Message>}
              </FormField>
            </FormGroup>
            {error && <Message>{error}</Message>}
            <Button primary loading={isLoading} type='submit'>Crear</Button>
          </Form>
        </div>
      </div>

      <BasicModal title='crear negocio' show={showNegocioForm} onClose={onOpenCloseNegocioForm}>
        <NegocioForm reload={reload} onReload={onReload} onCloseForm={onOpenCloseNegocioForm} onToastSuccess={onToastSuccess} />
      </BasicModal>
    </>
  )
}
