import { Image } from 'semantic-ui-react'
import { FaBars, FaHome, FaTimes, FaUserCircle } from 'react-icons/fa'
import { useState } from 'react'
import { FaClipboard, FaFileAlt, FaFileContract, FaFileInvoice, FaFileInvoiceDollar, FaPaperclip, FaUser, FaUsers } from 'react-icons/fa'
import Link from 'next/link'
import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/router'
import styles from './Menu.module.css'

export function Menu() {

  const {user} = useAuth()

  const router = useRouter()

  const [menu, setMenu] = useState(false)

  const onMenu = () => setMenu((prevState) => !prevState)

  return (

    <>
    
      <div className={styles.mainTop}>
        <Link href='/'>
          <Image src='img/logo.png' />
        </Link>
      </div>
    
    </>

  )
}
