import { useState, useEffect } from 'react';
import axios from 'axios';
import { Input } from 'semantic-ui-react';
import { UsuariosListSearch } from '../UsuariosListSearch';
import { FaTimesCircle } from 'react-icons/fa';
import styles from './SearchUsuarios.module.css';

export function SearchUsuarios(props) {

  const {user, reload, onReload, onResults, isAdmin, isUserSuperUser, onOpenCloseSearch, onToastSuccessMod} = props

  const [query, setQuery] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [usuarios, setUsuarios] = useState([])
  
  useEffect(() => {
    const fetchData = async () => {
      if (query.trim() === '') {
        setUsuarios([])
        return
      }

      setLoading(true)
      setError('')

      try {
        const res = await axios.get(`/api/usuarios/usuarios?search=${query}`)
        setUsuarios(res.data)
      } catch (err) {
        console.error('Error fetching data:', err)
        setError('No se encontraron usuarios')
        setUsuarios([])
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
          placeholder="Buscar usuario..."
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
        {usuarios.length > 0 && (
          <div className={styles.resultsContainer}>
            <UsuariosListSearch user={user} usuarios={usuarios} reload={reload} onReload={onReload} isAdmin={isAdmin} isUserSuperUser={isUserSuperUser} onToastSuccessMod={onToastSuccessMod} onOpenCloseSearch={onOpenCloseSearch} />
          </div>
        )}
      </div>
    </div>
  )
}
