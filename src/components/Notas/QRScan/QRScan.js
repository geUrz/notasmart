import { IconClose } from '@/components/Layouts'
import styles from './QRScan.module.css'
import { Image } from 'semantic-ui-react'

export function QRScan(props) {

  const {qrCode, onOpenCloseQR} = props

  return (

    <>

      <IconClose onOpenClose={onOpenCloseQR} />

      <div className={styles.qrContainer}>
        <Image src={qrCode} alt="Código QR" className={styles.qrImage} />
      </div>

    </>

  )
}
