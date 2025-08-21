import styles from './NegocioEditForm.module.css'
import { IconClose } from '@/components/Layouts'
import { useState } from 'react'
import axios from 'axios'
import { Button, Dropdown, Form, FormField, FormGroup, Input, Label, Message } from 'semantic-ui-react'
import { useDispatch, useSelector } from 'react-redux'
import { selectNegocio } from '@/store/negocios/negocioSelectors'
import { updateNegocio } from '@/store/negocios/negocioSlice'

export function NegocioEditForm(props) {

  const { reload, onReload, onOpenCloseEdit, onToastSuccess } = props

  const dispatch = useDispatch()
  const negocio = useSelector(selectNegocio)
  
  const [isLoading, setIsLoading] = useState(false)

  const [formData, setFormData] = useState({
    negocio: negocio.negocio,
    cel: negocio.cel,
    direccion: negocio.direccion,
    email: negocio.email,
    plan: negocio.plan,
    folios: negocio.folios
  })

  const [errors, setErrors] = useState({})

  const validarForm = () => {
    const newErrors = {}

    if (!formData.negocio) {
      newErrors.negocio = 'El campo es requerido'
    }

    if (!formData.plan) {
      newErrors.plan = 'El campo es requerido'
    }

    setErrors(newErrors)

    return Object.keys(newErrors).length === 0

  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
  }

  const handleSubmit = async (e) => {

    e.preventDefault()

    if (!validarForm()) {
      return
    }

    setIsLoading(true)

    try {
      await axios.put(`/api/negocios/negocios?id=${negocio.id}`, {
        ...formData,
        folios: Number(formData.folios)
      })

      const res = await axios.get(`/api/negocios/negocios?id=${negocio.id}`)
      dispatch(updateNegocio(res.data))

      onReload()
      onOpenCloseEdit()
      onToastSuccess()
    } catch (error) {
      console.error('Error actualizando el negocio:', error)
    } finally {
        setIsLoading(false)
    }
  }

  const opcionesPlan = [
    { key: 1, text: 'Prueba', value: 'prueba' },
    { key: 2, text: 'Básico', value: 'basico' },
    { key: 3, text: 'Emprendedor', value: 'emprendedor' },
    { key: 4, text: 'Negocio', value: 'negocio' },
    { key: 5, text: 'Empresarial', value: 'empresarial' },
    { key: 6, text: 'Premium', value: 'premium' }
  ]

  const foliosPorPlan = {
    prueba: 3,
    basico: 50,
    emprendedor: 150,
    negocio: 250,
    empresarial: 500,
    premium: 0
  }

  return (

    <>

      <IconClose onOpenClose={onOpenCloseEdit} />

      <Form>
        <FormGroup widths='equal'>
          <FormField error={!!errors.negocio}>
            <Label>
              Negocio
            </Label>
            <Input
              type="text"
              name="negocio"
              value={formData.negocio}
              onChange={handleChange}
            />
            {errors.negocio && <Message>{errors.negocio}</Message>}
          </FormField>
          <FormField>
            <Label>
              Celular
            </Label>
            <Input
              type="text"
              name="cel"
              value={formData.cel}
              onChange={handleChange}
            />
          </FormField>
          <FormField>
            <Label>
              Dirección
            </Label>
            <Input
              type="text"
              name="direccion"
              value={formData.direccion}
              onChange={handleChange}
            />
          </FormField>
          <FormField>
            <Label>
              Correo
            </Label>
            <Input
              type="text"
              name="email"
              value={formData.email}
              onChange={handleChange}
            />
          </FormField>
          <FormField error={!!errors.plan}>
            <Label>
              Plan
            </Label>
            <Dropdown
              placeholder='Seleccionar'
              fluid
              selection
              options={opcionesPlan}
              value={formData.plan}
              onChange={(e, { value }) => {
                setFormData({
                  ...formData,
                  plan: value,
                  folios: foliosPorPlan[value] || ''
                })
              }}
            />
            {errors.plan && <Message>{errors.plan}</Message>}
          </FormField>
          <FormField>
            <Label>
              Folios
            </Label>
            <Input
              name="folios"
              type="number"
              value={formData.folios}
              readOnly
            />
          </FormField>
        </FormGroup>
        <Button primary loading={isLoading} onClick={handleSubmit}>
          Guardar
        </Button>
      </Form>

    </>

  )
}
