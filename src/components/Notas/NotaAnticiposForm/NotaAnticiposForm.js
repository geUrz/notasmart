import { useState } from 'react'
import { IconClose } from '@/components/Layouts'
import { Button, Dropdown, Form, FormField, FormGroup, Input, Label, Message } from 'semantic-ui-react'
import axios from 'axios'
import styles from './NotaAnticiposForm.module.css'
import { useDispatch, useSelector } from 'react-redux'
import { selectNota } from '@/store/notas/notaSelectors'
import { fetchNotaById } from '@/store/notas/notaSlice'

export function NotaAnticiposForm(props) {

  const { user, reload, onReload, esPrimero, onAddAnticipo, onOpenCloseAnticipo, onToastSuccess } = props

  const dispatch = useDispatch()
  const nota = useSelector(selectNota)
  
  const [isLoading, setIsLoading] = useState(false)

  const [newAnticipo, setNewAnticipo] = useState({ tipo: esPrimero ? 'Anticipo' : 'Abono', metodo_pago: '', monto: '' })
  const [errors, setErrors] = useState({})

  const handleChange = (e, { name, value }) => {
    setNewAnticipo((prevState) => ({
      ...prevState,
      [name]: value,
    }))
  }

  const validateForm = () => {
    const newErrors = {}

    if (!newAnticipo.metodo_pago) {
      newErrors.metodo_pago = 'El campo es requerido'
    }

    if (!newAnticipo.monto || newAnticipo.monto <= 0) {
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

    if (newAnticipo.tipo && newAnticipo.metodo_pago && newAnticipo.monto) {

    try {
      const response = await axios.post(`/api/notas/anticipos`, {
        nota_id: nota.id,
        usuario_id: user.id,
        ...newAnticipo,
        producto_base: 0,
      })

      if ((response.status === 200 || response.status === 201) && response.data) {
          const newAnticipo = response.data

          if (newAnticipo?.id) {
            onAddAnticipo(newAnticipo)
            setNewAnticipo({ tipo: '', metodo_pago: '', monto: '', producto_base: '' })
            dispatch(fetchNotaById(nota.id))
            onReload()
            onOpenCloseAnticipo()

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
      console.warn('Datos incompletos o inválidos para agregar abono', newAnticipo)
    }
  }

  const opcionesPago = [
    { key: 1, text: 'Efectivo', value: 'Efectivo' },
    { key: 2, text: 'Transferencia', value: 'Transferencia' },
    { key: 3, text: 'Tarjeta', value: 'Tarjeta' }
  ]

  return (

    <>

      <IconClose onOpenClose={onOpenCloseAnticipo} />

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
              value={newAnticipo.metodo_pago}
              onChange={handleChange}
            />
            {errors.metodo_pago && <Message>{errors.metodo_pago}</Message>}
          </FormField>
          <FormField error={!!errors.monto}>
            <Label>Monto</Label>
            <Input
              name='monto'
              type="number"
              value={newAnticipo.monto}
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
