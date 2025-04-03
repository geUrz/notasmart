import { Button, Dropdown, Form, FormField, FormGroup, Image, Input, Label, Message } from 'semantic-ui-react'
import { useState } from 'react'
import axios from 'axios'
import { useRouter } from 'next/router'
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
    folios: '',
    password: '',
    confirmarPassword: ''
  });

  useRedirectIfAuthenticated()

  const [error, setError] = useState(null)

  const handleChange = (e, { name, value }) => {
    setCredentials({
      ...credentials,
      [name]: value
    });
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

    if (!credentials.folios) {
      newErrors.folios = 'El campo es requerido'
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
    e.preventDefault();

    if (!validarFormSignUp()) {
      return;
    }

    setError(null);

    if (credentials.password !== credentials.confirmarPassword) {
      setError("Las contraseñas no coinciden");
      return;
    }

    const folio = genUserId(4);
    const isactive = 1;

    try {
      const response = await axios.post('/api/auth/register', {
        folio,
        nombre: credentials.nombre,
        usuario: credentials.usuario,
        email: credentials.email,
        nivel: credentials.nivel,
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
    }
  }


  return (

    <>

      <div className={styles.main}>
        <div className={styles.boxForm}>
          <div className={styles.logo}>
            <Image src='/img/logologin.jpg' />
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
                {errors.nombre && <Message className={styles.error}>{errors.nombre}</Message>}
              </FormField>
              <FormField error={!!errors.usuario}>
                <Label>Usuario</Label>
                <Input
                  name='usuario'
                  type='text'
                  value={credentials.usuario}
                  onChange={handleChange}
                />
                {errors.usuario && <Message className={styles.error}>{errors.usuario}</Message>}
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
                {errors.nivel && <Message className={styles.error}>{errors.nivel}</Message>}
              </FormField>
              <FormField error={!!errors.folios}>
                <Label>Folios</Label>
                <Input
                  name='folios'
                  type='number'
                  value={credentials.folios}
                  onChange={handleChange}
                />
                {errors.folios && <Message className={styles.error}>{errors.folios}</Message>}
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
              <FormField error={!!errors.confirmarPassword}>
                <Label>Confirmar contraseña</Label>
                <Input
                  name='confirmarPassword'
                  type='password'
                  value={credentials.confirmarPassword}
                  onChange={handleChange}
                />
                {errors.confirmarPassword && <Message className={styles.error}>{errors.confirmarPassword}</Message>}
              </FormField>
            </FormGroup>
            {error && <Message>{error}</Message>}
            <Button primary type='submit'>Crear usuario</Button>
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
