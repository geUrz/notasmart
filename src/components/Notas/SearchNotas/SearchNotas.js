import { useState, useEffect } from 'react';
import axios from 'axios';
import { Input } from 'semantic-ui-react';
import { NotasListSearch } from '../NotasListSearch';
import { FaTimesCircle } from 'react-icons/fa';
import styles from './SearchNotas.module.css';

export function SearchNotas(props) {

  const {user, reload, onReload, onResults, onOpenCloseSearch, onToastSuccessMod} = props

  const [query, setQuery] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [notas, setNotas] = useState([])
  
  useEffect(() => {
    const fetchData = async () => {
      if (query.trim() === '') {
        setNotas([])
        return
      }

      setLoading(true)
      setError('')

      if(user && user.id){
        if(user.nivel === 'admin'){
          try {
            const res = await axios.get(`/api/notas/notas?search=${query}`)
            setNotas(res.data)
          } catch (err) {
            console.error('Error fetching data:', err)
            setError('No se encontraron notas')
            setNotas([])
          } finally {
            setLoading(false)
          }
        }else if(user.nivel === 'usuario'){
          try {
            const res = await axios.get(`/api/notas/notas?search=${query}`)
            const notasFiltered = res.data.filter(nota => nota.usuario_id === user.id)
            setNotas(notasFiltered)
          } catch (err) {
            console.error('Error fetching data:', err)
            setError('No se encontraron notas')
            setNotas([])
          } finally {
            setLoading(false)
          }
        }
      }
      
    }
  
    fetchData()
  }, [query, user.id])

  return (
    <div className={styles.main}>

      <div className={styles.input}>
        <Input
          type="text"
          placeholder="Buscar nota..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className={styles.searchInput}
          loading={loading}
        />
        <div className={styles.iconSearch} onClick={onOpenCloseSearch}>
          <FaTimesCircle />
        </div>
      </div>

      <div className={styles.visitaLista}>
        {error && <p>{error}</p>}
        {notas.length > 0 && (
          <div className={styles.resultsContainer}>
            <NotasListSearch user={user} notas={notas} reload={reload} onReload={onReload} onToastSuccessMod={onToastSuccessMod} onOpenCloseSearch={onOpenCloseSearch} />
          </div>
        )}
      </div>
    </div>
  )
}
