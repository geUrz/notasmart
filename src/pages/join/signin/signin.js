import { Button, Form, FormField, FormGroup, Input, Label, Message } from 'semantic-ui-react'
import { useEffect, useState, useRef } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { BasicJoin } from '@/layouts'
import { FaUser } from 'react-icons/fa'
import Link from 'next/link'
import { useRedirectIfAuthenticated } from '@/hooks'
import styles from './signin.module.css'

export default function Signin() {

  const [keyCode, setKeyCode] = useState(false)

  const handleKeyCode = (event) => {
    if(event.ctrlKey && event.key === 'l') {
      setKeyCode((prevState) => !prevState)
    }
  }

  useEffect(() => {
    window.addEventListener('keydown', handleKeyCode)

    return () => {
      window.removeEventListener('keydown', handleKeyCode)
    }
  }, [])

  const gestureAreaRef = useRef(null)

  const handleTouchStart = (e) => {
    e.currentTarget.touchStartTime = e.timeStamp
  };

  const handleTouchEnd = (e) => {
    const touchDuration = e.timeStamp - e.currentTarget.touchStartTime
    if (touchDuration > 5000) {
      setKeyCode((prevState) => !prevState)
      console.log('Toque prolongado detectado')
    }
  };

  useEffect(() => {
    const element = gestureAreaRef.current;
    if (element) {
      element.addEventListener('touchstart', handleTouchStart)
      element.addEventListener('touchend', handleTouchEnd)
    }

    return () => {
      if (element) {
        element.removeEventListener('touchstart', handleTouchStart)
        element.removeEventListener('touchend', handleTouchEnd)
      }
    };
  }, [])

  const [errors, setErrors] = useState({})

  const [credentials, setCredentials] = useState({
    emailOrUsuario: '',
    password: ''
  })

  useRedirectIfAuthenticated()

  const { login } = useAuth()
  const [error, setError] = useState(null)

  const handleChange = (e) => {
    setCredentials({
      ...credentials,
      [e.target.name]: e.target.value
    })
  }

  const validarFormSignIn = () => {
    const newErrors = {}

    if (!credentials.emailOrUsuario) {
      newErrors.emailOrUsuario = 'El campo es requerido'
    }

    if (!credentials.password) {
      newErrors.password = 'El campo es requerido'
    }

    setErrors(newErrors)

    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validarFormSignIn()) {
      return
    }
    setError(null)

    try {
      await login(credentials.emailOrUsuario, credentials.password)
    } catch (error) {
      console.error('Error capturado:', error)
      
      if (error?.status === 401) {
        setError(error.data.error || '¡ Correo o contraseña no existe !')
      } else {
        setError(error?.data?.error || '¡ Ocurrió un error inesperado !')
      }
   }
  }

  return (

    <BasicJoin relative>

      <div className={styles.user}>
        <FaUser 
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd} 
        />
        <h1>Iniciar sesión</h1>
      </div>

      <Form onSubmit={handleSubmit}>
        <FormGroup>
          <FormField error={!!errors.emailOrUsuario}>
            <Label>Usuario / Correo</Label>
            <Input
              name='emailOrUsuario'
              type='text'
              value={credentials.emailOrUsuario}
              onChange={handleChange}
            />
            {errors.emailOrUsuario && <Message className={styles.error}>{errors.emailOrUsuario}</Message>}
          </FormField>
          <FormField error={!!errors.password}>
            <Label>Contraseña</Label>
            <Input
              name='password'
              type='password'
              value={credentials.password}
              onChange={handleChange}
            />
            {errors.password && <Message className={styles.error}>{errors.password}</Message>}
          </FormField>
        </FormGroup>
        {error && <Message>{error}</Message>}
        <Button primary type='submit'>Iniciar sesión</Button>
      </Form>

      {keyCode ? (
        <div className={styles.link}>
          <Link href='/join/signup'>
            Crear usuario
          </Link>
        </div>
      ) : (
        ''
      )}

    </BasicJoin>

  )
}
