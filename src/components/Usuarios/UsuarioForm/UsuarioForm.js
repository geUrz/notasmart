// UsuarioForm.js
import { Button, Dropdown, Form, FormField, FormGroup, Input, Label, Message } from 'semantic-ui-react'
import { useEffect, useState } from 'react'
import axios from 'axios'
import { ErrorAccesso, IconClose } from '@/components/Layouts'
import { genUserId } from '@/helpers'
import styles from './UsuarioForm.module.css'
import { BasicModal } from '@/layouts'
import { FaPlus } from 'react-icons/fa'
import { NegocioForm } from '@/components/Negocios'
import { useDispatch, useSelector } from 'react-redux'
import { selectNegocios } from '@/store/negocios/negocioSelectors'
import { fetchNegocios } from '@/store/negocios/negocioSlice'
import { setUsuario } from '@/store/usuarios/usuarioSlice'

export function UsuarioForm(props) {
  const { user, reload, onReload, isAdmin, onOpenCloseForm, onToastSuccess } = props;

  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)
  const [apiError, setApiError] = useState(null)
  const [errorModalOpen, setErrorModalOpen] = useState(false)

  const onOpenCloseErrorModal = () => setErrorModalOpen((prev) => !prev)

  const [showNegocioForm, setShowNegocioForm] = useState(false)

  const onOpenCloseNegocioForm = () => setShowNegocioForm(prev => !prev)

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

  const dispatch = useDispatch()
  const negocios = useSelector(selectNegocios)

  useEffect(() => {
    if (!isAdmin) return
    dispatch(fetchNegocios())
  }, [dispatch, reload, user])

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
      const payload = {
        ...credentials,
        folio,
        isactive
      }

      if (!isAdmin) {
        payload.negocio_id = user?.negocio_id
        payload.negocio_nombre = user?.negocio_nombre
      }

      await axios.post('/api/usuarios/usuarios', payload)

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
      console.error(error)
      setApiError(error.response?.data?.error || 'Error al cargar usuarios')
      setErrorModalOpen(true)
      setError('No se encontraron usuarios')
      setUsuario([])
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
                <Label>Nombre *</Label>
                <Input name='nombre' type='text' value={credentials.nombre} onChange={handleChange} />
                {errors.nombre && <Message>{errors.nombre}</Message>}
              </FormField>
              <FormField error={!!errors.usuario}>
                <Label>Usuario *</Label>
                <Input name='usuario' type='text' value={credentials.usuario} onChange={handleChange} />
                {errors.usuario && <Message>{errors.usuario}</Message>}
              </FormField>
              <FormField>
                <Label>Correo</Label>
                <Input name='email' type='email' value={credentials.email} onChange={handleChange} />
              </FormField>
              <FormField error={!!errors.nivel}>
                <Label>Nivel *</Label>
                <Dropdown
                  name='nivel'
                  placeholder='Seleccionar'
                  fluid
                  selection
                  options={[
                    ...(isAdmin ? [{ key: 'Admin', text: 'Admin', value: 'admin' }] : []),
                    { key: 'UsuarioSU', text: 'UsuarioSU', value: 'usuariosu' },
                    { key: 'Usuario', text: 'Usuario', value: 'usuario' }
                  ]}
                  value={credentials.nivel}
                  onChange={handleChange}
                />
                {errors.nivel && <Message>{errors.nivel}</Message>}
              </FormField>

              {isAdmin &&
                <FormField>
                  <Label>Negocio</Label>
                  <Dropdown
                    placeholder={negocios.length === 0 ? 'No hay negocios' : 'Seleccionar'}
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
                    disabled={negocios.length === 0}
                  />
                  <div className={styles.addNegocio}>
                    <h1>Crear negocio</h1>
                    <FaPlus onClick={onOpenCloseNegocioForm} />
                  </div>
                </FormField>
              }

              <FormField error={!!errors.password}>
                <Label>Contraseña *</Label>
                <Input name='password' type='password' value={credentials.password} onChange={handleChange} />
                {errors.password && <Message>{errors.password}</Message>}
              </FormField>
              <FormField error={!!errors.confirmarPassword}>
                <Label>Confirmar contraseña *</Label>
                <Input name='confirmarPassword' type='password' value={credentials.confirmarPassword} onChange={handleChange} />
                {errors.confirmarPassword && <Message>{errors.confirmarPassword}</Message>}
              </FormField>
            </FormGroup>
            {error && <Message>{error}</Message>}
            <Button primary loading={isLoading} type='submit'>Crear</Button>
          </Form>
        </div>
        <div className={styles.datosOblig}>
          <h2>Datos obligatorios *</h2>
        </div>
      </div>

      <BasicModal title='crear negocio' show={showNegocioForm} onClose={onOpenCloseNegocioForm}>
        <NegocioForm reload={reload} onReload={onReload} onCloseForm={onOpenCloseNegocioForm} onToastSuccess={onToastSuccess} />
      </BasicModal>

      <BasicModal title="Error de acceso" show={errorModalOpen} onClose={onOpenCloseErrorModal}>
        <ErrorAccesso apiError={apiError} onOpenCloseErrorModal={onOpenCloseErrorModal} />
      </BasicModal>

    </>
  )
}
