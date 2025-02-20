import { Button, Form, FormField, FormGroup, Input, Label } from 'semantic-ui-react'
import { IconClose } from '@/components/Layouts'
import { useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import axios from 'axios'
import styles from './UsuarioFormPDF.module.css'

export function UsuarioFormPDF(props) {

  const {user, reload, onReload, onOpenCloseFormPDF} = props

  const [fila1, setFila1] = useState('')
  const [fila2, setFila2] = useState('')
  const [fila3, setFila3] = useState('')
  const [fila4, setFila4] = useState('')
  const [fila5, setFila5] = useState('')
  const [fila6, setFila6] = useState('')
  const [fila7, setFila7] = useState('')
  const [facebook, setFacebook] = useState('')
  const [web, setWeb] = useState('')

  const crearDatoPDF = async (e) => {
    e.preventDefault()

    try {
      await axios.post('/api/usuarios/datos_pdf', {
        usuario_id: user.id,
        fila1,
        fila2,
        fila3,
        fila4,
        fila5,
        fila6,
        fila7,
        facebook,
        web
      })

      setFila1('')
      setFila2('')
      setFila3('')
      setFila4('')
      setFila5('')
      setFila6('')
      setFila7('')
      setFacebook('')
      setWeb('')

      onReload()
      onOpenCloseFormPDF()
    } catch (error) {
      console.error('Error al crear el datoPDF:', error)

    }
  }

  return (
    
    <>

    <IconClose onOpenClose={onOpenCloseFormPDF} />
    
      <div className={styles.main}>
      <Form>
          <FormGroup widths='equal'>
            <FormField>
              <Label>Fila 1</Label>
              <Input
                type="text"
                value={fila1 || ''}
                onChange={(e) => setFila1(e.target.value)}
              />
            </FormField>
            <FormField>
              <Label>Fila 2</Label>
              <Input
                type="text"
                value={fila2 || ''}
                onChange={(e) => setFila2(e.target.value)}
              />
            </FormField>
            <FormField>
              <Label>Fila 3</Label>
              <Input
                type="text"
                value={fila3 || ''}
                onChange={(e) => setFila3(e.target.value)}
              />
            </FormField>
            <FormField>
              <Label>Fila 4</Label>
              <Input
                type="text"
                value={fila4 || ''}
                onChange={(e) => setFila4(e.target.value)}
              />
            </FormField>
            <FormField>
              <Label>Fila 5</Label>
              <Input
                type="text"
                value={fila5 || ''}
                onChange={(e) => setFila5(e.target.value)}
              />
            </FormField>
            <FormField>
              <Label>Fila 6</Label>
              <Input
                type="text"
                value={fila6 || ''}
                onChange={(e) => setFila6(e.target.value)}
              />
            </FormField>
            <FormField>
              <Label>Fila 7</Label>
              <Input
                type="text"
                value={fila7 || ''}
                onChange={(e) => setFila7(e.target.value)}
              />
            </FormField>
            <FormField>
              <Label>Facebook</Label>
              <Input
                type="text"
                value={facebook || ''}
                onChange={(e) => setFacebook(e.target.value)}
                placeholder='Ejemplo: https://www.facebook.com/miperfil'
              />
            </FormField>
            <FormField>
              <Label>Página web</Label>
              <Input
                type="text"
                value={web || ''}
                onChange={(e) => setWeb(e.target.value)}
                placeholder='Ejemplo: https://www.mipagina.com'
              />
            </FormField>
          </FormGroup>
        </Form>
        <Button primary onClick={crearDatoPDF}>Guardar</Button>
      </div>
    
    </>

  )
}
