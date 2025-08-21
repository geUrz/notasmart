import { FaBuilding, FaFileAlt, FaHome, FaUsers } from 'react-icons/fa'
import Link from 'next/link'
import styles from './BottomMenu.module.css'
import { BiSolidUser } from 'react-icons/bi'
import { usePermissions } from '@/hooks'

export function BottomMenu() {

  const {isUserActive, isAdmin, isSuperUser} = usePermissions()

  return (

    <div className={styles.main}>
      <div className={styles.section}>

        {isUserActive ?
          <>
          {isAdmin &&
            <Link href='/negocios' className={styles.tab}>
              <div>
                <FaBuilding />
                <h1>Negocios</h1>
              </div>
            </Link>
          }
          {(isAdmin || isSuperUser) &&
            <Link href='/' className={styles.tab}>
              <div>
                <FaHome />
                <h1>Home</h1>
              </div>
            </Link>
          }
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
            {(isAdmin || isSuperUser) &&
              <Link href='/usuarios' className={styles.tab}>
              <div>
                <FaUsers />
                <h1>Usuarios</h1>
              </div>
            </Link>
            }
            <Link href='/usuario' className={styles.tab}>
              <div>
                <BiSolidUser />
                <h1>Usuario</h1>
              </div>
            </Link>

          </> : null
        }

      </div>
    </div>

  )
}
