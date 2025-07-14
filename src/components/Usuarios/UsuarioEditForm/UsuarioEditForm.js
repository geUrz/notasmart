import { IconClose } from '@/components/Layouts'
import { useEffect, useState } from 'react'
import axios from 'axios'
import { Button, Dropdown, Form, FormField, FormGroup, Input, Label, Message } from 'semantic-ui-react'
import styles from './UsuarioEditForm.module.css'
import { BasicModal } from '@/layouts'
import { NegocioForm } from '@/components/Negocios'
import { FaPlus } from 'react-icons/fa'

export function UsuarioEditForm(props) {

  const { user, reload, onReload, isAdmin, usuarioData, actualizarUsuario, onToastSuccess, onOpenCloseEdit, onToastSuccessMod } = props

  const [isLoading, setIsLoading] = useState(false)

  const [formData, setFormData] = useState({
    nombre: usuarioData.nombre,
    usuario: usuarioData.usuario,
    email: usuarioData.email,
    nivel: usuarioData.nivel,
    negocio_id: usuarioData.negocio_id,
    negocio_nombre: usuarioData.negocio_nombre,
    isactive: usuarioData.isactive
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

    if (formData.isactive === null || formData.isactive === undefined) {
      newErrors.isactive = 'El campo es requerido'
    }

    setErrors(newErrors)

    return Object.keys(newErrors).length === 0

  }

  const [negocios, setNegocios] = useState([])
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
  }, [reload])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
  }

  const handleDropdownChange = (e, { value }) => {
    const negocioSeleccionado = negocios.find((negocio) => negocio.id === value);

    setFormData({
      ...formData,
      negocio_id: value,
      negocio_nombre: negocioSeleccionado ? negocioSeleccionado.negocio : ''
    })
  }

  const handleSubmit = async (e) => {

    e.preventDefault()

    if (!validarForm()) {
      return
    }

    setIsLoading(true)

    if (formData.plan === 'premium') {
      formData.folios = 0
    }

    try {
      await axios.put(`/api/usuarios/usuarios?id=${usuarioData.id}`, {
        ...formData,
      })

      actualizarUsuario({
        ...formData,
        negocio_nombre: formData.negocio_nombre
      })

      onReload()
      onOpenCloseEdit()
      onToastSuccessMod()
    } catch (error) {
      console.error('Error actualizando el usuario:', error)
    } finally {
      setIsLoading(false)
    }
  }

  let opcionesNivel = [
    { key: 2, text: 'UsuarioSU', value: 'usuariosu' },
    { key: 3, text: 'Usuario', value: 'usuario' }
  ];

  if (isAdmin) {
    opcionesNivel.unshift({ key: 1, text: 'Admin', value: 'admin' });
  }

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
            {errors.nombre && <Message>{errors.nombre}</Message>}
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
            {errors.usuario && <Message>{errors.usuario}</Message>}
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
              placeholder='Seleccionar'
              fluid
              selection
              options={opcionesNivel}
              value={formData.nivel}
              onChange={(e, { value }) => setFormData({ ...formData, nivel: value })}
            />
            {errors.nivel && <Message>{errors.nivel}</Message>}
          </FormField>

          {isAdmin &&

            <FormField>
              <Label>Negocio</Label>
              <Dropdown
                placeholder='Seleccionar'
                fluid
                selection
                options={negocios.map(negocio => ({
                  key: negocio.id,
                  text: negocio.negocio,
                  value: negocio.id
                }))}
                value={formData.negocio_id}
                onChange={handleDropdownChange}
              />
              <div className={styles.addNegocio}>
                <h1>Crear negocio</h1>
                <FaPlus onClick={onOpenCloseNegocioForm} />
              </div>
            </FormField>

          }

          <FormField error={!!errors.isactive}>
            <Label>
              Activo
            </Label>
            <Dropdown
              placeholder='Seleccionar'
              fluid
              selection
              options={opcionesIsActive}
              value={formData.isactive}
              onChange={(e, { value }) => setFormData({ ...formData, isactive: Number(value) })}
            />
            {errors.isactive && <Message>{errors.isactive}</Message>}
          </FormField>
        </FormGroup>
        <Button primary loading={isLoading} onClick={handleSubmit}>
          Guardar
        </Button>
      </Form>

      <BasicModal title='crear negocio' show={showNegocioForm} onClose={onOpenCloseNegocioForm}>
        <NegocioForm user={user} reload={reload} onReload={onReload} onCloseForm={onOpenCloseNegocioForm} onToastSuccess={onToastSuccess} />
      </BasicModal>

    </>

  )
}
