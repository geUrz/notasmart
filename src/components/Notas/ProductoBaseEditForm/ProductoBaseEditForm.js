import { Button, Form, FormField, FormGroup, Input, Label, Message } from 'semantic-ui-react'
import { useEffect, useState } from 'react'
import styles from './ProductoBaseEditForm.module.css'
import { IconClose, IconDel } from '@/components/Layouts'

export function ProductoBaseEditForm({ productoBase, onSave, onCancel, onDelete  }) {
  const [producto_nombre, setProductoNombre] = useState('')
  const [monto, setMonto] = useState('')
  const [errors, setErrors] = useState({})

  useEffect(() => {
    if (productoBase) {
      setProductoNombre(productoBase.producto_nombre || '')
      setMonto(productoBase.monto?.toString() || '')
    }
  }, [productoBase])

  const validar = () => {
    const newErrors = {}
    if (!producto_nombre) newErrors.producto_nombre = 'El campo es requerido'
    if (!monto || isNaN(monto) || Number(monto) <= 0) newErrors.monto = 'Monto inválido'
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = () => {
    if (!validar()) return
    onSave({ ...productoBase, producto_nombre, monto: Number(monto) })
  }

  return (
    <>
      <IconClose onOpenClose={onCancel} />

      <Form>
        <FormGroup widths='equal'>
          <FormField error={!!errors.producto_nombre}>
            <Label>Producto</Label>
            <Input
              type="text"
              value={producto_nombre}
              onChange={(e) => setProductoNombre(e.target.value)}
            />
            {errors.producto_nombre && <Message>{errors.producto_nombre}</Message>}
          </FormField>
          <FormField error={!!errors.monto}>
            <Label>Precio</Label>
            <Input
              type="number"
              value={monto}
              onChange={(e) => setMonto(e.target.value)}
            />
            {errors.monto && <Message>{errors.monto}</Message>}
          </FormField>
        </FormGroup>
        <Button primary onClick={handleSubmit}>Guardar</Button>
      
      <IconDel setShowConfirmDel={onDelete} />
      
      </Form>


    </>
  )
}
