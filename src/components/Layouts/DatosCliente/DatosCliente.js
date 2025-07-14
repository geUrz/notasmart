import { getValueOrDefault } from '@/helpers'
import { IconClose } from '../IconClose/IconClose'
import styles from './DatosCliente.module.css'

export function DatosCliente(props) {

  const { folio, cliente, contacto, cel, direccion, email, onOpenCloseRes } = props

  return (

    <>

      <IconClose onOpenClose={onOpenCloseRes} />

      <div className={styles.section}>
        <div className={styles.box1}>
          <div className={styles.box1_1}>
            <div>
              <h1>Cliente</h1>
              <h2>{getValueOrDefault(cliente)}</h2>
            </div>
            <div>
              <h1>Contacto</h1>
              <h2>{getValueOrDefault(contacto)}</h2>
            </div>
            <div>
              <h1>Dirección</h1>
              <h2>{getValueOrDefault(direccion)}</h2>
            </div>
          </div>
          <div className={styles.box1_2}>
            <div>
              <h1>Folio</h1>
              <h2>{getValueOrDefault(folio)}</h2>
            </div>
            <div>
              <h1>Cel</h1>
              <h2>{getValueOrDefault(cel)}</h2>
            </div>
            <div>
              <h1>Email</h1>
              <h2>{getValueOrDefault(email)}</h2>
            </div>
          </div>
        </div>
      </div>

    </>

  )
}
