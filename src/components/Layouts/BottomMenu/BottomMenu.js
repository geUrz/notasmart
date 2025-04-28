import { FaBuilding, FaFileAlt, FaHome, FaUser, FaUsers } from 'react-icons/fa'
import Link from 'next/link'
import { useAuth } from '@/contexts/AuthContext'
import styles from './BottomMenu.module.css'
import { useMemo } from 'react'
import { BiSolidUser, BiUser } from 'react-icons/bi'

export function BottomMenu() {

  const { user } = useAuth()

  const permissions = useMemo(() => {

    if(!user) return {}

    return{
      showAdmin : user?.nivel === 'admin',
      showAdminAct : user?.isactive === 1
    }

  }, [user])

  return (

    <div className={styles.main}>
      <div className={styles.section}>

        {permissions.showAdminAct ?
          <>
          {permissions.showAdmin &&
            <Link href='/negocios' className={styles.tab}>
              <div>
                <FaBuilding />
                <h1>Negocios</h1>
              </div>
            </Link>
          }
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
            {permissions.showAdmin &&
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
