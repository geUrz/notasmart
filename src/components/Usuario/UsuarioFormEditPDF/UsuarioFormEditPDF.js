import { Button, Form, FormField, FormGroup, Input, Label, Message } from 'semantic-ui-react'
import styles from './UsuarioFormEditPDF.module.css'
import { IconClose } from '@/components/Layouts'
import { useState } from 'react'
import axios from 'axios'

export function UsuarioFormEditPDF(props) {

  const{datoPDF, reload, onReload, onOpenCloseFormPDF} = props

  const [formData, setFormData] = useState({
    fila1: datoPDF.fila1,
    fila2: datoPDF.fila2,
    fila3: datoPDF.fila3,
    fila4: datoPDF.fila4,
    fila5: datoPDF.fila5,
    fila6: datoPDF.fila6,
    fila7: datoPDF.fila7,
    facebook: datoPDF.facebook,
    web: datoPDF.web
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
  }

  const handleSubmit = async (e) => {

    e.preventDefault()

    try {
      await axios.put(`/api/usuarios/datos_pdf?id=${datoPDF.id}`, {
        ...formData,
      })
      onReload()
      onOpenCloseFormPDF()
    } catch (error) {
      console.error('Error actualizando el datoPDF:', error)
    }
  }

  return (
    
    <>

    <IconClose onOpenClose={onOpenCloseFormPDF} />
    
    <div className={styles.main}>
    <Form>
        <FormGroup widths='equal'>
          <FormField>
            <Label>
              Fila 1
            </Label>
            <Input
              type="text"
              name="fila1"
              value={formData.fila1}
              onChange={handleChange}
            />
          </FormField>
          <FormField>
            <Label>
              Fila 2
            </Label>
            <Input
              type="text"
              name="fila2"
              value={formData.fila2}
              onChange={handleChange}
            />
          </FormField>
          <FormField>
            <Label>
              Fila 3
            </Label>
            <Input
              type="text"
              name="fila3"
              value={formData.fila3}
              onChange={handleChange}
            />
          </FormField>
          <FormField>
            <Label>
              Fila 4
            </Label>
            <Input
              type="text"
              name="fila4"
              value={formData.fila4}
              onChange={handleChange}
            />
          </FormField>
          <FormField>
            <Label>
              Fila 5
            </Label>
            <Input
              type="text"
              name="fila5"
              value={formData.fila5}
              onChange={handleChange}
            />
          </FormField>
          <FormField>
            <Label>
              Fila 6
            </Label>
            <Input
              type="text"
              name="fila6"
              value={formData.fila6}
              onChange={handleChange}
            />
          </FormField>
          <FormField>
            <Label>
              Fila 7
            </Label>
            <Input
              type="text"
              name="fila7"
              value={formData.fila7}
              onChange={handleChange}
            />
          </FormField>
          <FormField>
            <Label>
              Facebook
            </Label>
            <Input
              type="text"
              name="facebook"
              value={formData.facebook}
              onChange={handleChange}
            />
          </FormField>
          <FormField>
            <Label>
              Página web
            </Label>
            <Input
              type="text"
              name="web"
              value={formData.web}
              onChange={handleChange}
            />
          </FormField>
        </FormGroup>
        <Button primary onClick={handleSubmit}>
          Guardar
        </Button>
      </Form>
    </div>
    
    </>

  )
}
