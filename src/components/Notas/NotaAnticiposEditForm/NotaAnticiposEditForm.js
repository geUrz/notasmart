import { useState, useEffect } from 'react'
import { IconClose, IconDel } from '@/components/Layouts'
import { Button, Dropdown, Form, FormField, FormGroup, Input, Label, Message } from 'semantic-ui-react'
import axios from 'axios'
import styles from './NotaAnticiposEditForm.module.css'

export function NotaAnticiposEditForm(props) {
  const {
    reload,
    onReload,
    isAdmin,
    isPremium,
    esPrimero,
    onOpenCloseEditAnticipo,
    onOpenCloseConfirmAnticipo,
    anticipoToEdit,
    onEditAnticipo,
  } = props

  const [isLoading, setIsLoading] = useState(false)
  const [newAnticipo, setNewAnticipo] = useState({
    tipo: esPrimero ? 'Anticipo' : 'Abono',
    metodo_pago: '',
    monto: '',
    ...anticipoToEdit,
  })
  const [errors, setErrors] = useState({})

  useEffect(() => {
    if (anticipoToEdit) {
      setNewAnticipo({ ...anticipoToEdit })
    }
  }, [anticipoToEdit])

  const handleChange = (e, { name, value }) => {
    setNewAnticipo((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const validateForm = () => {
    const newErrors = {}

    if (!newAnticipo.metodo_pago) newErrors.metodo_pago = 'El campo es requerido'
    if (!newAnticipo.monto || parseFloat(newAnticipo.monto) <= 0) newErrors.monto = 'Debe ser mayor a 0'

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleUpdateAnticipo = async () => {
    if (!validateForm()) return
    setIsLoading(true)

    try {
      const response = await axios.put(`/api/notas/anticipos?id=${newAnticipo.id}`, {
        tipo: newAnticipo.tipo,
        metodo_pago: newAnticipo.metodo_pago,
        monto: parseFloat(newAnticipo.monto),
        producto_nombre: newAnticipo.producto_nombre || '',
      })

      if (response.status === 200) {
        onEditAnticipo({ ...response.data })  
        onReload()
        onOpenCloseEditAnticipo()
      } else {
        console.error('Error al actualizar el anticipo', response)
      }
    } catch (error) {
      console.error('Error al actualizar el anticipo:', error.response?.data || error.message)
    } finally {
      setIsLoading(false)
    }
  }

  const opcionesPago = [
    { key: 1, text: 'Efectivo', value: 'Efectivo' },
    { key: 2, text: 'Transferencia', value: 'Transferencia' },
    { key: 3, text: 'Tarjeta', value: 'Tarjeta' }
  ]

  return (
    <>
      <IconClose onOpenClose={onOpenCloseEditAnticipo} />

      <div className={styles.addConceptForm}>
        <Form>
          <FormGroup widths="equal">
            <FormField error={!!errors.metodo_pago}>
              <Label>Método de pago</Label>
              <Dropdown
                name="metodo_pago"
                placeholder="Seleccionar"
                fluid
                selection
                options={opcionesPago}
                value={newAnticipo.metodo_pago}
                onChange={handleChange}
              />
              {errors.metodo_pago && <Message>{errors.metodo_pago}</Message>}
            </FormField>

            <FormField error={!!errors.monto}>
              <Label>Monto</Label>
              <Input
                name="monto"
                type="number"
                value={newAnticipo.monto}
                onChange={handleChange}
              />
              {errors.monto && <Message>{errors.monto}</Message>}
            </FormField>
          </FormGroup>

          <Button primary loading={isLoading} onClick={handleUpdateAnticipo}>
            Guardar
          </Button>
        </Form>

        {(isAdmin || isPremium) && (
          <IconDel setShowConfirmDel={() => onOpenCloseConfirmAnticipo(newAnticipo)} />
        )}
      </div>
    </>
  )
}
