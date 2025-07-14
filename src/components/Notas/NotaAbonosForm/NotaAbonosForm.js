import { useState } from 'react'
import { IconClose } from '@/components/Layouts'
import { Button, Dropdown, Form, FormField, FormGroup, Input, Label, Message } from 'semantic-ui-react'
import axios from 'axios'
import styles from './NotaAbonosForm.module.css'
import { useDispatch, useSelector } from 'react-redux'
import { selectNota } from '@/store/notas/notaSelectors'
import { fetchNotaById } from '@/store/notas/notaSlice'

export function NotaAbonosForm(props) {

  const { user, reload, onReload, onAddAbono, onOpenCloseAbono, onToastSuccess } = props
  
  const dispatch = useDispatch()
  const nota = useSelector(selectNota)

  const [isLoading, setIsLoading] = useState(false)

  const [newAbono, setNewAbono] = useState({ tipo: 'Abono', metodo_pago: '', monto: '' })
  const [errors, setErrors] = useState({})

  const handleChange = (e, { name, value }) => {
    setNewAbono((prevState) => ({
      ...prevState,
      [name]: value,
    }))
  }

  const validateForm = () => {
    const newErrors = {}

    if (!newAbono.metodo_pago) {
      newErrors.metodo_pago = 'El campo es requerido'
    }

    if (!newAbono.monto || newAbono.monto <= 0) {
      newErrors.monto = 'El campo es requerido'
    }

    setErrors(newErrors)

    return Object.keys(newErrors).length === 0
  }

  const handleAddConcept = async () => {

    if (!validateForm()) {
      return
    }

    setIsLoading(true)

    if (newAbono.tipo && newAbono.metodo_pago && newAbono.monto) {

    try {
      const response = await axios.post(`/api/notas/abonos`, {
        nota_id: nota?.id,
        usuario_id: user.id,
        ...newAbono,
        producto_base: 0,
      })

      if ((response.status === 200 || response.status === 201) && response.data) {
          const newAbono = response.data

          if (newAbono?.id) {
            onAddAbono(newAbono)
            setNewAbono({ tipo: '', metodo_pago: '', monto: '', producto_base: '' })
            dispatch(fetchNotaById(nota.id))
            onReload()
            onOpenCloseAbono()

          } else {
            console.error('Error al agregar el abono: El ID no se encuentra en la respuesta del servidor', response);
          }
        } else {
          console.error('Error al agregar el abono: Respuesta del servidor no fue exitosa', response)
        }
      } catch (error) {
        //console.error('Error al agregar el abono:', error.response?.data || error.message || error)
      } finally {
          setIsLoading(false)
      }
    } else {
      console.warn('Datos incompletos o inválidos para agregar abono', newAbono)
    }
  }

  const opcionesPago = [
    { key: 1, text: 'Efectivo', value: 'Efectivo' },
    { key: 2, text: 'Transferencia', value: 'Transferencia' },
    { key: 3, text: 'Tarjeta', value: 'Tarjeta' }
  ]

  return (

    <>

      <IconClose onOpenClose={onOpenCloseAbono} />

      <div className={styles.addConceptForm}>
        <Form>
          <FormGroup widths='equal'>
          <FormField error={!!errors.metodo_pago}>
            <Label>Metodo de pago</Label>
            <Dropdown
              name='metodo_pago'
              placeholder='Seleccionar'
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
              name='monto'
              type="number"
              value={newAbono.monto}
              onChange={handleChange}
            />
            {errors.monto && <Message>{errors.monto}</Message>}
          </FormField>
          </FormGroup>
          <Button primary loading={isLoading} onClick={handleAddConcept}>
            Agregar
          </Button>
        </Form>

      </div>

    </>

  )
}
