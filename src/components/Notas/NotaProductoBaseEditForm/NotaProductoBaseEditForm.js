import { useState, useEffect } from 'react'
import { IconClose } from '@/components/Layouts'
import { Button, Form, FormField, FormGroup, Input, Label, Message } from 'semantic-ui-react'
import axios from 'axios'
import styles from './NotaProductoBaseEditForm.module.css' // Puedes crear uno nuevo si prefieres

export function NotaProductoBaseEditForm(props) {

  const { show, tipo = 'abonos', abonoToEdit, onEditProductoBase, onReload, syncNota, onOpenCloseEditProductoBase } = props

  const [isLoading, setIsLoading] = useState(false)

  const [productoBase, setProductoBase] = useState({
    producto_nombre: '',
    monto: '',
    ...abonoToEdit
  })

  const [errors, setErrors] = useState({})

  useEffect(() => {
    if (abonoToEdit && show) {
      setProductoBase({
        producto_nombre: abonoToEdit.producto_nombre || '',
        monto: abonoToEdit.monto || '',
        id: abonoToEdit.id
      })
    }
  }, [abonoToEdit, show])   

  const handleChange = (e, { name, value }) => {
    setProductoBase(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const validateForm = () => {
    const newErrors = {}
    if (!productoBase.producto_nombre) newErrors.producto_nombre = 'El campo es requerido'
    if (!productoBase.monto || parseFloat(productoBase.monto) <= 0) newErrors.monto = 'Debe ser mayor a 0'
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleUpdateProductoBase = async () => {
    if (!validateForm()) return
    setIsLoading(true)

    try {
      const response = await axios.put(`/api/notas/${tipo}?id=${productoBase.id}`, {
        tipo: 'Producto Base',
        metodo_pago: '', // Vacío o null porque no aplica
        monto: parseFloat(productoBase.monto),
        producto_nombre: productoBase.producto_nombre,
        producto_base: 1
      })

      if (response.status === 200) {
        onEditProductoBase(productoBase)
        if (syncNota) syncNota()
        onReload()
        onOpenCloseEditProductoBase()
      } else {
        console.error('Error al actualizar producto base', response)
      }
    } catch (error) {
      console.error('Error al actualizar producto base:', error.response?.data || error.message)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      <IconClose onOpenClose={onOpenCloseEditProductoBase} />

      <div className={styles.addConceptForm}>
        <Form>
          <FormGroup widths="equal">
            <FormField error={!!errors.producto_nombre}>
              <Label>Producto</Label>
              <Input
                name="producto_nombre"
                value={productoBase.producto_nombre}
                onChange={handleChange}
              />
              {errors.producto_nombre && <Message>{errors.producto_nombre}</Message>}
            </FormField>

            <FormField error={!!errors.monto}>
              <Label>Precio</Label>
              <Input
                name="monto"
                type="number"
                value={productoBase.monto}
                onChange={handleChange}
              />
              {errors.monto && <Message>{errors.monto}</Message>}
            </FormField>
          </FormGroup>

          <Button primary loading={isLoading} onClick={handleUpdateProductoBase}>
            Guardar
          </Button>
        </Form>
      </div>
    </>
  )
}
