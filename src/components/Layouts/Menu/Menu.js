import { Image } from 'semantic-ui-react'
import Link from 'next/link'
import styles from './Menu.module.css'
import { useEffect, useState } from 'react'

export function Menu() {

  const [theme, setTheme] = useState('light')

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') || 'light'
    setTheme(savedTheme)
  }, [])

  const logoSrc = theme === 'dark' ? '/img/logo.png' : '/img/logoDark.png'

  return (

    <>
    
      <div className={styles.mainTop}>
        <h1>Nota</h1>
        <Link href='/'>
          <Image src={logoSrc} />
        </Link>
        <h1>Smart</h1>
      </div>
    
    </>

  )
}
