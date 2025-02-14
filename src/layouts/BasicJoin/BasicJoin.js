import classNames from 'classnames'
import styles from './BasicJoin.module.css'
import { Image } from 'semantic-ui-react'

export function BasicJoin(props) {

  const {
    children,
    relative=false
  } = props

  return (
    
    <>

      <div className={styles.logo}>
        <h1>Nota</h1>
        <Image src='/img/logo.png' />
        <h1>Smart</h1>
      </div>
    
      <div className={classNames({[styles.relative] : relative})}>
        {children}
      </div>
    
    </>

  )
}
