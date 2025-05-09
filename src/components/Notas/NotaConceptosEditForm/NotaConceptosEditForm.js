import { useState, useEffect, useMemo } from 'react';
import { IconClose, IconDel } from '@/components/Layouts';
import { Button, Dropdown, Form, FormField, FormGroup, Input, Label, Message } from 'semantic-ui-react';
import axios from 'axios';
import { FaTrash } from 'react-icons/fa';
import styles from './NotaConceptosEditForm.module.css';

export function NotaConceptosEditForm(props) {

  const { user, reload, onReload, onOpenCloseEditConcep, onOpenCloseConfirm, conceptToEdit, onEditConcept } = props

  const [isLoading, setIsLoading] = useState(false)

  const [newConcept, setNewConcept] = useState(conceptToEdit || { tipo: '', concepto: '', precio: '', cantidad: '' })
  const [errors, setErrors] = useState({})

  const calculateTotal = (precio, cantidad) => {
    return parseFloat(precio || 0) * parseInt(cantidad || 0)
  }

  const handleChange = (e, { name, value }) => {
    setNewConcept((prevState) => {
      const updatedConcept = { ...prevState, [name]: value }

      if (name === 'precio' || name === 'cantidad') {
        updatedConcept.total = calculateTotal(updatedConcept.precio, updatedConcept.cantidad)
      }

      return updatedConcept;
    })
  }

  const validateForm = () => {
    const newErrors = {}

    if (!newConcept.tipo) {
      newErrors.tipo = 'El campo es requerido';
    }
    if (!newConcept.concepto) {
      newErrors.concepto = 'El campo es requerido';
    }
    if (!newConcept.cantidad || newConcept.cantidad <= 0) {
      newErrors.cantidad = 'El campo es requerido';
    }
    if (!newConcept.precio || newConcept.precio <= 0) {
      newErrors.precio = 'El campo es requerido';
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0;
  }

  const handleUpdateConcept = async () => {
    if (!validateForm()) {
      return;
    }

    setIsLoading(true)

    try {
      const response = await axios.put(`/api/notas/conceptos?id=${newConcept.id}`, {
        tipo: newConcept.tipo,
        concepto: newConcept.concepto,
        precio: newConcept.precio,
        cantidad: newConcept.cantidad,
        total: newConcept.total
      })

      if (response.status === 200 && response.data) {
        onEditConcept(newConcept)
        onReload()
        onOpenCloseEditConcep()
      } else {
        console.error('Error al actualizar el concepto: Respuesta del servidor no fue exitosa', response)
      }
    } catch (error) {
      console.error('Error al actualizar el concepto:', error)
    } finally {
        setIsLoading(false)
    }
  }

  const opcionesSerprod = [
    { key: 1, text: 'Servicio', value: 'Servicio' },
    { key: 2, text: 'Producto', value: 'Producto' }
  ]

  const permissions = useMemo(() => {

    if(!user) return {}

    return{

      showAdmin: user.nivel === 'admin'

    }

  }, [user])

  return (
    <>
      <IconClose onOpenClose={onOpenCloseEditConcep} />

      <div className={styles.addConceptForm}>
        <Form>
          <FormGroup widths='equal'>
            <FormField error={!!errors.tipo}>
              <Label>Tipo</Label>
              <Dropdown
                name="tipo"
                placeholder='Seleccionar'
                fluid
                selection
                options={opcionesSerprod}
                value={newConcept.tipo}
                onChange={handleChange}
              />
              {errors.tipo && <Message>{errors.tipo}</Message>}
            </FormField>

            <FormField error={!!errors.concepto}>
              <Label>Concepto</Label>
              <Input
                type="text"
                name="concepto"
                value={newConcept.concepto}
                onChange={handleChange}
              />
              {errors.concepto && <Message>{errors.concepto}</Message>}
            </FormField>

            <FormField error={!!errors.precio}>
              <Label>Precio</Label>
              <Input
                type="number"
                name="precio"
                value={newConcept.precio}
                onChange={handleChange}
              />
              {errors.precio && <Message>{errors.precio}</Message>}
            </FormField>

            <FormField error={!!errors.cantidad}>
              <Label>Qty</Label>
              <Input
                type="number"
                name="cantidad"
                value={newConcept.cantidad}
                onChange={handleChange}
              />
              {errors.cantidad && <Message>{errors.cantidad}</Message>}
            </FormField>
          </FormGroup>
          <Button primary loading={isLoading} onClick={handleUpdateConcept}>
            Guardar
          </Button>
        </Form>

        {permissions.showAdmin &&
          <IconDel setShowConfirmDel={() => onOpenCloseConfirm(newConcept)} />
        }

      </div>
    </>
  )
}
