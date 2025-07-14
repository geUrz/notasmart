import { Button, Dropdown, Form, FormField, Label, Input, Message } from 'semantic-ui-react';
import { useState, useEffect } from 'react';
import styles from './AbonosEditForm.module.css';
import { IconClose, IconDel } from '@/components/Layouts';

export function AbonosEditForm(props) {
  const { abono, onSave, index, onCloseEditAbono, onOpenCloseConfirmAbono } = props;

  const [editedAbono, setEditedAbono] = useState(abono)
  const [errors, setErrors] = useState({})

  useEffect(() => {
    setEditedAbono(abono)
  }, [abono])

 
  const calculateTotal = (monto, cantidad) => {
    return parseFloat(monto || 0) * parseInt(cantidad || 0)
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    setEditedAbono((prevState) => {
      const updatedAbono = { ...prevState, [name]: value };

      // Si cambiaron monto o cantidad, recalculamos el total
      if (name === 'monto' || name === 'cantidad') {
        updatedAbono.total = calculateTotal(updatedAbono.monto, updatedAbono.cantidad)
      }

      return updatedAbono;
    })
  };

  const handleSubmit = (e) => {
    e.preventDefault()
    const newErrors = {};

    if (!editedAbono.metodo_pago) newErrors.metodo_pago = 'El campo es requerido';
    if (!editedAbono.monto) newErrors.monto = 'El campo monto es requerido';

    setErrors(newErrors)

    onCloseEditAbono()

    if (Object.keys(newErrors).length === 0) {
      // Enviar el total junto con el resto de los datos
      const updatedAbono = { ...editedAbono, total: editedAbono.total };

      // Llamamos a onSave para enviar el abono con el total
      onSave(updatedAbono)
    }
  };

  const opcionesPago = [
    { key: 1, text: 'Efectivo', value: 'Efectivo' },
    { key: 2, text: 'Transferencia', value: 'Transferencia' },
    { key: 3, text: 'Tarjeta', value: 'Tarjeta' }
  ]

  return (
    <>
      <IconClose onOpenClose={onCloseEditAbono} />

      <div className={styles.addConceptForm}>
        <Form onSubmit={handleSubmit}>
          <FormField error={!!errors.metodo_pago}>
            <Label>Metodo de pago</Label>
            <Dropdown
              placeholder="Seleccionar"
              fluid
              selection
              options={opcionesPago}
              value={editedAbono.metodo_pago}
              onChange={(e, { value }) =>
                setEditedAbono({ ...editedAbono, metodo_pago: value })
              }
            />
            {errors.metodo_pago && <Message negative>{errors.metodo_pago}</Message>}
          </FormField>
          <FormField error={!!errors.monto}>
            <Label>Precio</Label>
            <Input
              type="number"
              name="monto"
              value={editedAbono.monto}
              onChange={handleInputChange}
            />
            {errors.monto && <Message negative>{errors.monto}</Message>}
          </FormField>
          <Button primary type="submit">
            Guardar
          </Button>
        </Form>

        <IconDel setShowConfirmDel={() => onOpenCloseConfirmAbono(index)} />

      </div>
    </>
  )
}
