import { Button, Dropdown, Form, FormField, FormGroup, Image, Input, Label, Message } from 'semantic-ui-react'
import { useState } from 'react'
import axios from 'axios'
import { useRouter } from 'next/router'
import Link from 'next/link'
import { useRedirectIfAuthenticated } from '@/hooks'
import { genUserId } from '@/helpers'
import { Loading } from '@/components/Layouts'
import { useAuth } from '@/contexts'
import styles from './signup.module.css'

export default function Signup() {

  const { loading } = useAuth()

  const router = useRouter()

  const [isLoading, setIsLoading] = useState(false)
  const [errors, setErrors] = useState({})

  const [credentials, setCredentials] = useState({
    nombre: '',
    usuario: '',
    email: '',
    nivel: '',
    plan: '',
    folios: '',
    password: '',
    confirmarPassword: ''
  });

  useRedirectIfAuthenticated()

  const [error, setError] = useState(null)

  const foliosPorPlan = {
    prueba: 3,
    basico: 50,
    emprendedor: 150,
    negocio: 250,
    empresarial: 500,
    premium: 0
  }


  const handleChange = (e, { name, value }) => {

    if (name === 'plan') {
      setCredentials(prev => ({
        ...prev,
        [name]: value,
        folios: foliosPorPlan[value] || ''
      }));
    } else {
      setCredentials(prev => ({
        ...prev,
        [name]: value
      }))
    }
  }


  const validarFormSignUp = () => {
    const newErrors = {}

    if (!credentials.nombre) {
      newErrors.nombre = 'El campo es requerido'
    }

    if (!credentials.usuario) {
      newErrors.usuario = 'El campo es requerido'
    }

    if (!credentials.nivel) {
      newErrors.nivel = 'El campo es requerido'
    }

    if (!credentials.plan) {
      newErrors.plan = 'El campo es requerido'
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
      return;
    }

    setIsLoading(true)
    setError(null);

    if (credentials.password !== credentials.confirmarPassword) {
      setError("Las contraseñas no coinciden");
      return;
    }

    const folio = genUserId(4)
    const isactive = 1

    try {
      const response = await axios.post('/api/auth/register', {
        folio,
        nombre: credentials.nombre,
        usuario: credentials.usuario,
        email: credentials.email,
        nivel: credentials.nivel,
        plan: credentials.plan,
        folios: credentials.folios,
        isactive,
        password: credentials.password
      }, {
        validateStatus: function (status) {
          return status < 500
        }
      });

      if (response.status === 201) {
        router.push('/join/signin');
        setCredentials({
          nombre: '',
          usuario: '',
          email: '',
          nivel: '',
          plan: '',
          folios: '',
          password: '',
          confirmarPassword: ''
        });
        setError(null);
      } else {
        setError(response.data?.error || "Ocurrió un error inesperado.");
      }
    } catch (error) {
      console.error("Error inesperado:", error);
      setError("Error de conexión con el servidor.");
    } finally {
      setIsLoading(false)
    }
  }

  if (loading) {
    return <Loading size={45} loading={'L'} />
  }

  return (

    <>

      <div className={styles.main}>
        <div className={styles.boxForm}>
          <div className={styles.logo}>
            <Image src='/img/logologin.webp' />
          </div>

          <div className={styles.h1}>
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
                {errors.nombre && <Message>{errors.nombre}</Message>}
              </FormField>
              <FormField error={!!errors.usuario}>
                <Label>Usuario</Label>
                <Input
                  name='usuario'
                  type='text'
                  value={credentials.usuario}
                  onChange={handleChange}
                />
                {errors.usuario && <Message>{errors.usuario}</Message>}
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
                <Dropdown
                  placeholder='Seleccionar'
                  fluid
                  selection
                  options={[
                    { key: 'Admin', text: 'Admin', value: 'admin' },
                    { key: 'Usuario', text: 'Usuario', value: 'usuario' },
                  ]}
                  name='nivel'
                  value={credentials.nivel}
                  onChange={handleChange}
                />
                {errors.nivel && <Message>{errors.nivel}</Message>}
              </FormField>
              <FormField error={!!errors.plan}>
                <Label>Plan</Label>
                <Dropdown
                  placeholder='Seleccionar'
                  fluid
                  selection
                  options={[
                    { key: 'Prueba', text: 'Prueba', value: 'prueba' },
                    { key: 'Básico', text: 'Básico', value: 'basico' },
                    { key: 'Emprendedor', text: 'Emprendedor', value: 'emprendedor' },
                    { key: 'Negocio', text: 'Negocio', value: 'negocio' },
                    { key: 'Empresarial', text: 'Empresarial', value: 'empresarial' },
                    { key: 'Premium', text: 'Premium', value: 'premium' },
                  ]}
                  name='plan'
                  value={credentials.plan}
                  onChange={handleChange}
                />
                {errors.plan && <Message>{errors.plan}</Message>}
              </FormField>
              <FormField>
                <Label>Folios</Label>
                <Input
                  name='folios'
                  type='number'
                  value={credentials.folios}
                  readOnly
                />
              </FormField>
              <FormField error={!!errors.password}>
                <Label>Contraseña</Label>
                <Input
                  name='password'
                  type='password'
                  value={credentials.password}
                  onChange={handleChange}
                />
                {errors.password && <Message>{errors.password}</Message>}
              </FormField>
              <FormField error={!!errors.confirmarPassword}>
                <Label>Confirmar contraseña</Label>
                <Input
                  name='confirmarPassword'
                  type='password'
                  value={credentials.confirmarPassword}
                  onChange={handleChange}
                />
                {errors.confirmarPassword && <Message>{errors.confirmarPassword}</Message>}
              </FormField>
            </FormGroup>
            {error && <Message>{error}</Message>}
            <Button primary loading={isLoading} type='submit'>Crear</Button>
          </Form>

          <div className={styles.link}>
            <Link href='/join/signin'>
              Iniciar sesión
            </Link>
          </div>

        </div>

        <div className={styles.footer}>
          <div className={styles.section}>
            <h1>© 2025 NotaSmart</h1>
          </div>
        </div>

      </div>

    </>

  )
}
