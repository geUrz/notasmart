import styles from './SearchNotas.module.css';
import { useState, useEffect } from 'react';
import { Input } from 'semantic-ui-react';
import { NotasListSearch } from '../NotasListSearch';
import { FaTimesCircle } from 'react-icons/fa';
import { searchNotas } from '@/store/notas/notaSlice';
import { useDispatch, useSelector } from 'react-redux';
import { selectNotas } from '@/store/notas/notaSelectors';

export function SearchNotas(props) {

  const { user, reload, onReload, onResults, onOpenCloseSearch, onToastSuccess } = props

  const [query, setQuery] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const notas = useSelector(selectNotas)

  const dispatch = useDispatch()

  useEffect(() => {
    const fetchData = async () => {
      if (query.trim().length < 1) {
        setError('')
        return;
      }

      setLoading(true)
      setError('')

      try {
        await dispatch(searchNotas(query))
      } catch (error) {
        console.error(error)
        setApiError(error.response?.data?.error || 'Error al cargar notas')
        setErrorModalOpen(true)
        setError('No se encontraron notas')
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [query, dispatch, user.negocio_id])

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
            <NotasListSearch user={user} reload={reload} onReload={onReload} query={query} onToastSuccess={onToastSuccess} onOpenCloseSearch={onOpenCloseSearch} />
          </div>
        )}
      </div>
    </div>
  )
}
