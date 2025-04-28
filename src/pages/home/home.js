import ProtectedRoute from '@/components/Layouts/ProtectedRoute/ProtectedRoute'
import { BasicLayout, BasicModal } from '@/layouts'
import { Loading, Title } from '@/components/Layouts'
import { useEffect, useState } from 'react'
import axios from 'axios'
import { size, sum } from 'lodash'
import { useAuth } from '@/contexts/AuthContext'
import { FaArrowDown, FaDollarSign, FaFileAlt, FaInfinity } from 'react-icons/fa'
import { formatCurrency } from '@/helpers'
import styles from './home.module.css'

export default function Home() {

  const { user, loading } = useAuth()

  const [reload, setReload] = useState(false)

  const onReload = () => setReload((prevState) => !prevState)

  const [users, setUsers] = useState([])
  const [notas, setNotas] = useState(null)

  const totalNotas = size(notas)
  const totalIVA = notas ? sum(notas.map(nota => nota.iva_total || 0)) : 0
  
  const sumTotalFolios = () => {
    if (user.nivel === 'admin') {
      return users.reduce((total, user) => total + (parseInt(user.folios) || 0), 0)
    }
    return parseInt(user.folios) || 0
  }
  
  useEffect(() => {
    if (user) {
      if (user.nivel === 'admin') {
        (async () => {
          try {
            const res = await axios.get('/api/usuarios/usuarios')
            setUsers(res.data)
          } catch (error) {
            console.error(error)
          }
        })()
      } else {
        (async () => {
          try {
            const res = await axios.get(`/api/usuarios/usuarios?usuario_id=${user.id}`)
            setUsers(res.data)
          } catch (error) {
            console.error(error)
          }
        })()
      }
    }
  }, [user])
  
  useEffect(() => {
    if (user) {
      if (user.nivel === 'admin') {
        (async () => {
          try {
            const res = await axios.get(`/api/notas/notas`)
            setNotas(res.data)
          } catch (error) {
            console.error(error)
          }
        })()
      } else {
        (async () => {
          try {
            const res = await axios.get(`/api/notas/notas?usuario_id=${user.id}`)
            setNotas(res.data)
          } catch (error) {
            console.error(error)
          }
        })()
      }
    }
  }, [reload, user])

  const [conceptos, setConceptos] = useState(null)

  const sumTotalPrice = () => {
    if (!conceptos) return 0;
    return conceptos.reduce((total, concepto) => total + (concepto.total || 0), 0);
  }

  const totalPrice = sumTotalPrice()
  const totalTotal = totalIVA + totalPrice || 0

  useEffect(() => {
    if (user) {
      if (user.nivel === 'usuario') {
        (async () => {
          try {
            const res = await axios.get(`/api/notas/conceptos?usuario_id=${user.id}`)
            setConceptos(res.data)
          } catch (error) {
            console.error(error)
          }
        })()
      } else if(user.nivel === 'admin') {
        (async () => {
          try {
            const res = await axios.get(`/api/notas/conceptos`)
            setConceptos(res.data)
          } catch (error) {
            console.error(error)
          }
        })()
      }
    }
  }, [reload, user])

  if (loading) {
    return <Loading size={45} loading={'L'} />
  }

  return (

    <ProtectedRoute>

      <BasicLayout relative onReload={onReload} totalNotas={totalNotas}>

        <Title title='home' />

        <div className={styles.main}>
          <div className={styles.notas}>
            <div className={styles.icon}>
              <div className={styles.icon1}>
                <FaFileAlt />
              </div>
              <h1>Folios</h1>
            </div>
            <div className={styles.folios}>
              {!notas ?
                <Loading size={32} loading={3} /> :
                <>
                  <h1>{totalNotas}</h1>
                  <h1>/</h1>
                  <h1>
                    {user.plan === 'premium' ? 
                      <FaInfinity /> :
                      sumTotalFolios()
                    }
                  </h1> 
                </>
              }
            </div>
          </div>
          <div className={styles.entradas}>
            <div className={styles.icon}>
              <div className={styles.icon1}>
                <FaDollarSign />
              </div>
              <div className={styles.icon2}>
                <FaArrowDown />
              </div>
              <h1>Entradas</h1>
            </div>
            <div className={styles.count}>
              {!conceptos ?
                <Loading size={30} loading={3} /> :
                <h1>{formatCurrency(totalPrice)}</h1>
              }
            </div>
            <div className={styles.iva}>
              <div>
                <h1>IVA</h1>
                <h2>{formatCurrency(totalIVA)}</h2>
              </div>
              <div>
                <h1>Total</h1>
                <h2>{formatCurrency(totalTotal)}</h2>
              </div>
          </div>
          </div>
          
        </div>

      </BasicLayout>

    </ProtectedRoute>

  )
}
