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

  const [errors, setErrors] = useState({});
  const [credentials, setCredentials] = useState({
    nombre: '',
    usuario: '',
    folios: '',
    email: '',
    nivel: '',
    password: '',
    confirmarPassword: ''
  });

  const [error, setError] = useState(null);

  const handleChange = (e, { name, value }) => {
    setCredentials({
      ...credentials,
      [name]: value
    });
  };

  const validarFormSignUp = () => {
    const newErrors = {};

    if (!credentials.nombre) {
      newErrors.nombre = 'El campo es requerido'
    }

    if (!credentials.usuario) {
      newErrors.usuario = 'El campo es requerido'
    }

    if (!credentials.folios) {
      newErrors.folios = 'El campo es requerido'
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

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  const [negocios, setNegocios] = useState([])
  const [cliente_id, setCliente] = useState('')
  const [showNegocioForm, setShowNegocioForm] = useState(false)
  const onOpenCloseNegocioForm = () => setShowNegocioForm((prevState) => !prevState)

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

  const handleSubmit = async (e) => {
    e.preventDefault();

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

    // Enviar datos al backend para crear el usuario
    try {
      await axios.post('/api/usuarios/usuarios', {
        folio,
        nombre: credentials.nombre,
        usuario: credentials.usuario,
        folios: credentials.folios,
        email: credentials.email,
        nivel: credentials.nivel,
        isactive,
        password: credentials.password
      });

      setCredentials({
        nombre: '',
        usuario: '',
        folios: '',
        email: '',
        nivel: '',
        password: '',
        confirmarPassword: ''
      });

      setError(null);
      onReload()
      onOpenCloseForm()
      onToastSuccess()
    } catch (error) {
      console.error('Error capturado:', error);

      if (error.response && error.response.data && error.response.data.error) {
        setError(error.response.data.error);
      } else if (error.message) {
        setError(error.message);
      } else {
        setError('¡ Ocurrió un error inesperado !');
      }
    } finally {
        setIsLoading(false)
    }
  };

  return (
    <>
      <IconClose onOpenClose={onOpenCloseForm} />

      <div className={styles.main}>
        <div className={styles.container}>
          <Form onSubmit={handleSubmit}>
            <FormGroup widths='equal'>
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
              <FormField error={!!errors.email}>
                <Label>Correo</Label>
                <Input
                  name='email'
                  type='email'
                  value={credentials.email}
                  onChange={handleChange}
                />
                {errors.email && <Message>{errors.email}</Message>}
              </FormField>
              <FormField>
                <Label>Folios</Label>
                <Input
                  name='folios'
                  type='number'
                  value={credentials.folios}
                  onChange={handleChange}
                />
                {errors.folios && <Message>{errors.folios}</Message>}
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
              <FormField>
                <Label>Negocio</Label>
                <Dropdown
                  placeholder='Seleccionar'
                  fluid
                  selection
                  options={negocios.map(negocio => ({
                    key: negocio.id,
                    text: negocio.nombre,
                    value: negocio.id
                  }))}
                  value={cliente_id}
                  onChange={(e, { value }) => setCliente(value)}
                />
                <div className={styles.addNegocio}>
                  <h1>Crear negocio</h1>
                  <FaPlus onClick={onOpenCloseNegocioForm} />
                </div>
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
            <Button primary loading={isLoading} type='submit'>
              Crear
            </Button>
          </Form>
        </div>
      </div>

      <BasicModal title='crear negocio' show={showNegocioForm} onClose={onOpenCloseNegocioForm}>
        <NegocioForm reload={reload} onReload={onReload} onCloseForm={onOpenCloseNegocioForm} onToastSuccess={onToastSuccess} />
      </BasicModal>

    </>
  )
}
