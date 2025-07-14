import { useState, useEffect } from 'react'
import { IconClose, IconDel } from '@/components/Layouts'
import { Button, Dropdown, Form, FormField, FormGroup, Input, Label, Message } from 'semantic-ui-react'
import axios from 'axios'
import styles from './NotaAbonosEditForm.module.css'

export function NotaAbonosEditForm(props) {
  const {
    reload,
    onReload,
    isAdmin,
    isPremium,
    onOpenCloseEditAbono,
    onOpenCloseConfirmAbono,
    abonoToEdit,
    onEditAbono,
  } = props

  const [isLoading, setIsLoading] = useState(false)
  const [newAbono, setNewAbono] = useState({
    tipo: 'Abono',
    metodo_pago: '',
    monto: '',
    ...abonoToEdit,
  })
  const [errors, setErrors] = useState({})

  useEffect(() => {
    if (abonoToEdit) {
      setNewAbono({ ...abonoToEdit })
    }
  }, [abonoToEdit])

  const handleChange = (e, { name, value }) => {
    setNewAbono((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const validateForm = () => {
    const newErrors = {}

    if (!newAbono.metodo_pago) newErrors.metodo_pago = 'El campo es requerido'
    if (!newAbono.monto || parseFloat(newAbono.monto) <= 0) newErrors.monto = 'Debe ser mayor a 0'

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleUpdateAbono = async () => {
    if (!validateForm()) return
    setIsLoading(true)

    try {
      const response = await axios.put(`/api/notas/abonos?id=${newAbono.id}`, {
        tipo: newAbono.tipo,
        metodo_pago: newAbono.metodo_pago,
        monto: parseFloat(newAbono.monto),
        producto_nombre: newAbono.producto_nombre || '',
      })

      if (response.status === 200) {
        onEditAbono({ ...response.data })  
        onReload()
        onOpenCloseEditAbono()
      } else {
        console.error('Error al actualizar el abono', response)
      }
    } catch (error) {
      console.error('Error al actualizar el abono:', error.response?.data || error.message)
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
      <IconClose onOpenClose={onOpenCloseEditAbono} />

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
                value={newAbono.metodo_pago}
                onChange={handleChange}
              />
              {errors.metodo_pago && <Message>{errors.metodo_pago}</Message>}
            </FormField>

            <FormField error={!!errors.monto}>
              <Label>Monto</Label>
              <Input
                name="monto"
                type="number"
                value={newAbono.monto}
                onChange={handleChange}
              />
              {errors.monto && <Message>{errors.monto}</Message>}
            </FormField>
          </FormGroup>

          <Button primary loading={isLoading} onClick={handleUpdateAbono}>
            Guardar
          </Button>
        </Form>

        {(isAdmin || isPremium) && (
          <IconDel setShowConfirmDel={() => onOpenCloseConfirmAbono(newAbono)} />
        )}
      </div>
    </>
  )
}
