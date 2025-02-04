import { FaFileInvoiceDollar, FaHome, FaPlusCircle, FaUser, FaUsers } from 'react-icons/fa'
import Link from 'next/link'
import styles from './BottomMenu.module.css'
import { useAuth } from '@/contexts/AuthContext'

export function BottomMenu() {

  const { user } = useAuth()

  return (

    <div className={styles.main}>
      <div className={styles.section}>

        {user && user.isactive === 1 ?
          <>
            <Link href='/' className={styles.tab}>
              <div>
                <FaHome />
                <h1>Home</h1>
              </div>
            </Link>
            <Link href='/notas' className={styles.tab}>
              <div>
                <FaPlusCircle />
                <h1>Notas</h1>
              </div>
            </Link>
            <Link href='/clientes' className={styles.tab}>
              <div>
                <FaUsers />
                <h1>Clientes</h1>
              </div>
            </Link>
            <Link href='/cuentas' className={styles.tab}>
              <div>
                <FaFileInvoiceDollar />
                <h1>Cuentas</h1>
              </div>
            </Link>

            <Link href='/usuario' className={styles.tab}>
              <div>
                <FaUser />
                <h1>Usuario</h1>
              </div>
            </Link>

          </> : null
        }

      </div>
    </div>

  )
}
