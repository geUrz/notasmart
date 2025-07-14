import styles from './RowHeadModal.module.css'

export function RowHeadModal(props) {

  const {rowMain=false} = props

  return (

    <>

      {rowMain ? (
        <div className={styles.rowConceptos}>
          <h1>Tipo</h1>
          <h1>Concepto</h1>
          <h1>Precio</h1>
          <h1>Qty</h1>
          <h1>Total</h1>
        </div>
      ) : (
        <div className={styles.rowAbonos}>
          <h1>Tipo</h1>
          <h1>Forma pago</h1>
          <h1>Fecha pago</h1>
          <h1>Monto</h1> 
        </div>
      )}

    </>

  )
}
