import { useState, useEffect } from 'react';
import axios from 'axios';
import { Input } from 'semantic-ui-react';
import { NegociosListSearch } from '../NegociosListSearch';
import { FaTimesCircle } from 'react-icons/fa';
import styles from './SearchNegocios.module.css';

export function SearchNegocios(props) {

  const {reload, onReload, onResults, onOpenCloseSearch, onToastSuccessMod} = props

  const [query, setQuery] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [negocios, setNegocios] = useState([])
  
  useEffect(() => {
    const fetchData = async () => {
      if (query.trim() === '') {
        setNegocios([])
        return
      }

      setLoading(true)
      setError('')

      try {
        const res = await axios.get(`/api/negocios/negocios?search=${query}`)
        setNegocios(res.data)
      } catch (err) {
        console.error('Error fetching data:', err)
        setError('No se encontraron negocios')
        setNegocios([])
      } finally {
        setLoading(false)
      }
    }
  
    fetchData()
  }, [query])

  return (
    <div className={styles.main}>

      <div className={styles.input}>
        <Input
          type="text"
          placeholder="Buscar negocio..."
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
        {negocios.length > 0 && (
          <div className={styles.resultsContainer}>
            <NegociosListSearch negocios={negocios} reload={reload} onReload={onReload} onToastSuccessMod={onToastSuccessMod} onOpenCloseSearch={onOpenCloseSearch} />
          </div>
        )}
      </div>
    </div>
  )
}
