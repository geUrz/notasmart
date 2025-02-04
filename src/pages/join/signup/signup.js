import { Button, Form, FormField, FormGroup, Input, Label } from 'semantic-ui-react'
import { useState } from 'react'
import axios from 'axios'
import { useRouter } from 'next/router'
import { BasicJoin } from '@/layouts'
import { FaUserPlus } from 'react-icons/fa'
import Link from 'next/link'
import { useRedirectIfAuthenticated } from '@/hooks'
import styles from './signup.module.css'
import { genUserId } from '@/helpers'

export default function Signup() {

  const router = useRouter()

  const [errors, setErrors] = useState({})

  const [credentials, setCredentials] = useState({
    nombre: '',
    usuario: '',
    email: '',
    nivel: '',
    password: '',
    confirmarPassword: ''
  });

  useRedirectIfAuthenticated()

  const [error, setError] = useState(null)

  const handleChange = (e) => {
    setCredentials({
      ...credentials,
      [e.target.name]: e.target.value
    })
  }

  const validarFormSignUp = () => {
    const newErrors = {}

    if (!credentials.nombre) {
      newErrors.nombre = 'El campo es requerido'
    }
    
    if (!credentials.usuario) {
      newErrors.usuario = 'El campo es requerido'
    }

    if (!credentials.email) {
      newErrors.email = 'El campo es requerido'
    }

    if (!credentials.nivel) {
      newErrors.nivel = 'El campo es requerido'
    }

    if (!credentials.password) {
      newErrors.password = 'El campo es requerido'
    }

    if (!credentials.confirmarPassword) {
      newErrors.confirmarPassword = 'El campo es requerido'
    }

    setErrors(newErrors)

    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!validarFormSignUp()) {
      return
    }
    setError(null)

    if (credentials.password !== credentials.confirmarPassword) {
      setError("Las contraseñas no coinciden");
      return;
    }

    const folio = genUserId(4)
    const isactive = 1

    try {
      await axios.post('/api/auth/register', {
        folio,
        nombre: credentials.nombre,
        usuario: credentials.usuario,
        email: credentials.email,
        nivel: credentials.nivel,
        isactive,
        password: credentials.password
      })

      router.push('/join/signin')

      setCredentials({
        nombre: '',
        usuario: '',
        email: '',
        nivel: '',
        password: '',
        confirmarPassword: ''
      })

      setError(null)
    } catch (error) {
      console.error('Error capturado:', error);

      if (error.response && error.response.data && error.response.data.error) {
         setError(error.response.data.error); // Error específico del backend
      } else if (error.message) {
         setError(error.message)
      } else {
         setError('¡ Ocurrió un error inesperado !')
      }
    }
  };

  return (

    <BasicJoin relative>

      <div className={styles.user}>
        <FaUserPlus />
        <h1>Crear usuario</h1>
      </div>

      <Form onSubmit={handleSubmit}>
        <FormGroup>
        <FormField error={!!errors.nombre}>
            <Label>Nombre</Label>
            <Input
              name='nombre'
              type='text'
              value={credentials.nombre}
              onChange={handleChange}
            />
            {errors.nombre && <span className={styles.error}>{errors.nombre}</span>}
          </FormField>
          <FormField error={!!errors.usuario}>
            <Label>Usuario</Label>
            <Input
              name='usuario'
              type='text'
              value={credentials.usuario}
              onChange={handleChange}
            />
            {errors.usuario && <span className={styles.error}>{errors.usuario}</span>}
          </FormField>
          <FormField>
            <Label>Correo</Label>
            <Input
              name='email'
              type='email'
              value={credentials.email}
              onChange={handleChange}
            />
          </FormField>
          <FormField error={!!errors.nivel}>
            <Label>Nivel</Label>
            <select
              name='nivel'
              type='text'
              value={credentials.nivel}
              onChange={handleChange}
            >
              <option value=''></option>
              <option value='admin'>admin</option>
              <option value='usuario'>usuario</option>
            </select>
            {errors.nivel && <span className={styles.error}>{errors.nivel}</span>}
          </FormField>
          <FormField error={!!errors.password}>
            <Label>Contraseña</Label>
            <Input
              name='password'
              type='password'
              value={credentials.password}
              onChange={handleChange}
            />
            {errors.password && <span className={styles.error}>{errors.password}</span>}
          </FormField>
          <FormField error={!!errors.confirmarPassword}>
            <Label>Confirmar contraseña</Label>
            <Input
              name='confirmarPassword'
              type='password'
              value={credentials.confirmarPassword}
              onChange={handleChange}
            />
            {errors.confirmarPassword && <span className={styles.error}>{errors.confirmarPassword}</span>}
          </FormField>
        </FormGroup>
        {error && <p className={styles.error}>{error}</p>}
        <Button primary type='submit'>Crear usuario</Button>
      </Form>

      <div className={styles.link}>
        <Link href='/join/signin'>
          Iniciar sesión 
        </Link>
      </div>

    </BasicJoin>

  )
}
