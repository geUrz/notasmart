import { Image } from 'semantic-ui-react'
import Link from 'next/link'
import styles from './Menu.module.css'
import { useEffect, useState } from 'react'

export function Menu() {

  return (

    <>
    
      <div className={styles.mainTop}>
        <h1>Nota</h1>
        <Link href='/'>
          <Image src='/img/logo.png' />
        </Link>
        <h1>Smart</h1>
      </div>
    
    </>

  )
}
