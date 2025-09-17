import styles from './UsuarioEditForm.module.css'
import { IconClose } from '@/components/Layouts'
import { useEffect, useState } from 'react'
import axios from 'axios'
import { Button, Dropdown, Form, FormField, FormGroup, Input, Label, Message } from 'semantic-ui-react'
import { BasicModal } from '@/layouts'
import { NegocioForm } from '@/components/Negocios'
import { FaPlus } from 'react-icons/fa'
import { useDispatch, useSelector } from 'react-redux'
import { selectNegocios } from '@/store/negocios/negocioSelectors'
import { fetchNegocios, updateNegocio } from '@/store/negocios/negocioSlice'
import { setUsuario, updateUsuario } from '@/store/usuarios/usuarioSlice'
import { selectUsuario } from '@/store/usuarios/usuarioSelectors'

export function UsuarioEditForm(props) {

  const { user, logout, reload, onReload, isAdmin, onToastSuccess, onOpenCloseEdit } = props

  const dispatchUsr = useDispatch()
  const usuario = useSelector(selectUsuario)

  const logOut = () => {
    if (usuario?.id === user?.id){
      logout()
    } 
  } 

  const [isLoading, setIsLoading] = useState(false)

  const [formData, setFormData] = useState({
    nombre: usuario?.nombre,
    usuario: usuario?.usuario,
    email: usuario?.email,
    nivel: usuario?.nivel,
    negocio_id: usuario?.negocio_id,
    negocio_nombre: usuario?.negocio_nombre,
    isactive: usuario?.isactive
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

  const [showNegocioForm, setShowNegocioForm] = useState(false)
  const onOpenCloseNegocioForm = () => setShowNegocioForm((prevState) => !prevState)

  const dispatch = useDispatch()
  const negocios = useSelector(selectNegocios)

  useEffect(() => {
    if (!isAdmin) return
    dispatch(fetchNegocios())
  }, [dispatch, reload, user])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
  }

  const handleDropdownChange = (e, { value }) => {
    const negocioSeleccionado = value ? negocios.find((negocio) => negocio.id === value) : null;

    setFormData({
      ...formData,
      negocio_id: value,
      negocio_nombre: negocioSeleccionado ? negocioSeleccionado.negocio : ''
    });
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
      await axios.put(`/api/usuarios/usuarios?id=${usuario?.id}`, {
        ...formData,
        negocio_id: formData.negocio_id === null ? null : formData.negocio_id,  // Aseguramos que si no se selecciona un negocio, se mande null
      })

      const res = await axios.get(`/api/usuarios/usuarios?id=${usuario?.id}`)
      dispatchUsr(updateUsuario(res.data))

      logOut()
      onReload()
      onOpenCloseEdit()
      onToastSuccess()
    } catch (error) {
      console.error('Error actualizando el usuario:', error.response?.data?.error || error.message)
    } finally {
      setIsLoading(false)
    }
  }

  const opcionesNivel = [
    ...(isAdmin ? [{ key: 'Admin', text: 'Admin', value: 'admin' }] : []),
    { key: 2, text: 'UsuarioSU', value: 'usuariosu' },
    { key: 3, text: 'Usuario', value: 'usuario' }
  ]

  const opcionesIsActive = [
    { key: 1, text: 'Activo', value: 1 },
    { key: 2, text: 'Inactivo', value: 0 }
  ]

  return (

    <>

      <div className={styles.main}>
        <div className={styles.section}>
          <IconClose onOpenClose={onOpenCloseEdit} />

          <Form>
            <FormGroup widths='equal'>
              <FormField error={!!errors.nombre}>
                <Label>
                  Nombre *
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
                  Usuario *
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
                  Nivel *
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
                  <Label>
                    Negocio *
                  </Label>
                  <Dropdown
                    placeholder={negocios.length === 0 ? 'No hay negocios' : 'Seleccionar'}
                    fluid
                    selection
                    options={[
                      { key: 'none', text: 'Ninguno', value: null },
                      ...negocios.map(negocio => ({
                        key: negocio.id,
                        text: negocio.negocio,
                        value: negocio.id
                      }))
                    ]}
                    value={formData.negocio_id}
                    onChange={handleDropdownChange}
                    disabled={negocios.length === 0}
                  />
                  <div className={styles.addNegocio}>
                    <h1>Crear negocio</h1>
                    <FaPlus onClick={onOpenCloseNegocioForm} />
                  </div>
                </FormField>

              }

              <FormField error={!!errors.isactive}>
                <Label>
                  Activo *
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
        </div>
        <div className={styles.datosOblig}>
          <h2>Datos obligatorios *</h2>
        </div>
      </div>

      <BasicModal title='crear negocio' show={showNegocioForm} onClose={onOpenCloseNegocioForm}>
        <NegocioForm user={user} reload={reload} onReload={onReload} onCloseForm={onOpenCloseNegocioForm} onToastSuccess={onToastSuccess} />
      </BasicModal>

    </>

  )
}
