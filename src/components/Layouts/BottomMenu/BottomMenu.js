import { FaFileAlt, FaHome, FaUser, FaUsers } from 'react-icons/fa'
import Link from 'next/link'
import { useAuth } from '@/contexts/AuthContext'
import styles from './BottomMenu.module.css'

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
                <FaFileAlt />
                <h1>Notas</h1>
              </div>
            </Link>
            <Link href='/clientes' className={styles.tab}>
              <div>
                <FaUsers />
                <h1>Clientes</h1>
              </div>
            </Link>
            {user && user.nivel === 'admin' &&
              <Link href='/usuarios' className={styles.tab}>
              <div>
                <FaUsers />
                <h1>Usuarios</h1>
              </div>
            </Link>
            }
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
