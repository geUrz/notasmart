import { Button, Dropdown, Form, FormField, FormGroup, Label, Input, Message } from 'semantic-ui-react'
import { useState } from 'react'
import { IconClose } from '@/components/Layouts'
import styles from './AnticiposForm.module.css'

export function AnticiposForm(props) {
  const { añadirAnticipo, esPrimero, onOpenCloseConcep } = props
  const [nuevoAnticipo, setNuevoAnticipo] = useState({
    tipo: esPrimero ? 'Anticipo' : 'Abono',
    metodo_pago: '',
    monto: ''
  })
  
  const [isLoading, setIsLoading] = useState(false)
  const [errors, setErrors] = useState({})

  const opcionesPago = [
    { key: 1, text: 'Efectivo', value: 'Efectivo' },
    { key: 2, text: 'Transferencia', value: 'Transferencia' },
    { key: 3, text: 'Tarjeta', value: 'Tarjeta' }
  ]

  const validarFormConceptos = () => {
    const newErrors = {}
    if (!nuevoAnticipo.metodo_pago) newErrors.metodo_pago = 'El metodo_pago es requerido'
    if (!nuevoAnticipo.monto || nuevoAnticipo.monto <= 0) newErrors.monto = 'La monto es requerida y debe ser mayor a 0'

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleAddAbono = async () => {
    if (!validarFormConceptos()) return
    setIsLoading(true)
  
    try {
      const fechaActual = new Date().toISOString()
  
      const anticipoConFecha = {
        ...nuevoAnticipo,
        fecha_pago: fechaActual
      }
  
      await añadirAnticipo(anticipoConFecha)
      setNuevoAnticipo({ tipo: esPrimero ? 'Anticipo' : 'Abono', metodo_pago: '', fecha_pago: '', monto: '' });
      onOpenCloseConcep()
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      <IconClose onOpenClose={onOpenCloseConcep} />
      <Form>
        <FormGroup widths='equal'>
          <FormField error={!!errors.metodo_pago}>
            <Label>Metodo de pago</Label>
            <Dropdown
              placeholder='Seleccionar'
              fluid
              selection
              options={opcionesPago}
              value={nuevoAnticipo.metodo_pago}
              onChange={(e, { value }) => setNuevoAnticipo({ ...nuevoAnticipo, metodo_pago: value })}
            />
            {errors.metodo_pago && <Message>{errors.metodo_pago}</Message>}
          </FormField>
          <FormField error={!!errors.monto}>
            <Label>Monto</Label>
            <Input
              type="number"
              value={nuevoAnticipo.monto}
              onChange={(e) => setNuevoAnticipo({ ...nuevoAnticipo, monto: e.target.value === '' ? '' : parseInt(e.target.value) })}
            />
            {errors.monto && <Message>{errors.monto}</Message>}
          </FormField>
        </FormGroup>
        <Button primary loading={isLoading} onClick={handleAddAbono}>Agregar</Button>
      </Form>
    </>
  )
}
