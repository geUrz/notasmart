import { Button, Dropdown, Form, FormField, Label, Input, Message } from 'semantic-ui-react';
import { useState, useEffect } from 'react';
import styles from './AnticiposEditForm.module.css';
import { IconClose, IconDel } from '@/components/Layouts';

export function AnticiposEditForm(props) {
  const { anticipo, onSave, index, onCloseEditAnticipo, onOpenCloseConfirmAnticipo } = props;

  const [editedAnticipo, setEditedAnticipo] = useState(anticipo)
  const [errors, setErrors] = useState({})

  useEffect(() => {
    setEditedAnticipo(anticipo)
  }, [anticipo])

  const calculateTotal = (monto, cantidad) => {
    return parseFloat(monto || 0) * parseInt(cantidad || 0)
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    setEditedAnticipo((prevState) => {
      const updatedAnticipo = { ...prevState, [name]: value };

      // Si cambiaron monto o cantidad, recalculamos el total
      if (name === 'monto' || name === 'cantidad') {
        updatedAnticipo.total = calculateTotal(updatedAnticipo.monto, updatedAnticipo.cantidad)
      }

      return updatedAnticipo;
    })
  };

  const handleSubmit = (e) => {
    e.preventDefault()
    const newErrors = {};

    if (!editedAnticipo.metodo_pago) newErrors.metodo_pago = 'El campo es requerido';
    if (!editedAnticipo.monto) newErrors.monto = 'El campo monto es requerido';

    setErrors(newErrors)

    onCloseEditAnticipo()

    if (Object.keys(newErrors).length === 0) {
      // Enviar el total junto con el resto de los datos
      const updatedAnticipo = { ...editedAnticipo, total: editedAnticipo.total };

      // Llamamos a onSave para enviar el anticipo con el total
      onSave(updatedAnticipo)
    }
  };

  const opcionesPago = [
    { key: 1, text: 'Efectivo', value: 'Efectivo' },
    { key: 2, text: 'Transferencia', value: 'Transferencia' },
    { key: 3, text: 'Tarjeta', value: 'Tarjeta' }
  ]

  return (
    <>
      <IconClose onOpenClose={onCloseEditAnticipo} />

      <div className={styles.addConceptForm}>
        <Form onSubmit={handleSubmit}>
          <FormField error={!!errors.metodo_pago}>
            <Label>Metodo de pago</Label>
            <Dropdown
              placeholder="Seleccionar"
              fluid
              selection
              options={opcionesPago}
              value={editedAnticipo.metodo_pago}
              onChange={(e, { value }) =>
                setEditedAnticipo({ ...editedAnticipo, metodo_pago: value })
              }
            />
            {errors.metodo_pago && <Message negative>{errors.metodo_pago}</Message>}
          </FormField>
          <FormField error={!!errors.monto}>
            <Label>Precio</Label>
            <Input
              type="number"
              name="monto"
              value={editedAnticipo.monto}
              onChange={handleInputChange}
            />
            {errors.monto && <Message negative>{errors.monto}</Message>}
          </FormField>
          <Button primary type="submit">
            Guardar
          </Button>
        </Form>

        <IconDel setShowConfirmDel={() => onOpenCloseConfirmAnticipo(index)} />

      </div>
    </>
  )
}
