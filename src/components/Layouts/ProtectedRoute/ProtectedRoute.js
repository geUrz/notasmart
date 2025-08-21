import styles from './ProtectedRoute.module.css'
import { useEffect, useMemo } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '@/contexts/AuthContext';
import { Loading } from '../Loading';
import { FaInfoCircle } from 'react-icons/fa';
import { usePermissions } from '@/hooks';

export default function ProtectedRoute({ children }) {
  const { user, loading, logout } = useAuth()
  const { isAdmin, isSuperUser } = usePermissions()
  const router = useRouter()

  const isUserActive = useMemo(() => user?.isactive === 1, [user])

  useEffect(() => {
    if (!loading && !user) {
      router.push('/join/signin')
    }
  }, [loading, user, router])

  useEffect(() => {
    // Si el usuario es de nivel usuario, redirige a /notas cuando intente acceder al home
    if (router.pathname === '/' && user && user.nivel === 'usuario') {
      router.push('/notas')
    }

    // Si no es admin ni superusuario, y está en home, redirigir a /notas
    if ((router.pathname === '/' || router.pathname === '/home') && !isAdmin && !isSuperUser) {
      router.push('/notas')
    }
  }, [loading, user, router, isAdmin, isSuperUser])

  useEffect(() => {
    if (!loading && user && !isUserActive) {
      const timer = setTimeout(() => {
        logout()
      }, 5000)

      return () => clearTimeout(timer)
    }
  }, [loading, user, isUserActive, logout])

  if (loading || !user) {
    return <Loading size={45} loading={'L'} />
  }

  if (!isUserActive) {
    return (
      <div className={styles.bannerNoActive}>
        <div>
          <FaInfoCircle />
          <h1>¡ Usuario desactivado !</h1>
          <h2>Por favor, póngase en contacto con el administrador para resolverlo.</h2>
        </div>
      </div>
    )
  }

  return children;
}
