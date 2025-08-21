import { useState, useEffect } from 'react';
import axios from 'axios';
import { Input } from 'semantic-ui-react';
import { ClientesListSearch } from '../ClientesListSearch';
import { FaTimesCircle } from 'react-icons/fa';
import styles from './SearchClientes.module.css';
import { useDispatch, useSelector } from 'react-redux';
import { selectClientes } from '@/store/clientes/clienteSelectors';
import { searchClientes } from '@/store/clientes/clienteSlice';
import { BasicModal } from '@/layouts';
import { ErrorAccesso } from '@/components/Layouts';

export function SearchClientes(props) {

  const { user, reload, onReload, onResults, onOpenCloseSearch, onToastSuccess } = props

  const dispatch = useDispatch()
  const clientes = useSelector(selectClientes)

  const [apiError, setApiError] = useState(null)
  const [errorModalOpen, setErrorModalOpen] = useState(false)

  const onOpenCloseErrorModal = () => setErrorModalOpen((prev) => !prev)

  const [query, setQuery] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchData = async () => {
      if (query.trim().length < 1) {
        setError('')
        return;
      }

      setLoading(true)
      setError('')

      try {
        await dispatch(searchClientes(query))
      } catch (error) {
        console.error(error)
        setApiError(error.response?.data?.error || 'Error al cargar clientes')
        setErrorModalOpen(true)
        setError('No se encontraron clientes')
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [dispatch, query, user.id])

  return (

    <>

      <div className={styles.main}>

        <div className={styles.input}>
          <Input
            type="text"
            placeholder="Buscar cliente..."
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
          {clientes.length > 0 && (
            <div className={styles.resultsContainer}>
              <ClientesListSearch reload={reload} onReload={onReload} query={query}  onToastSuccess={onToastSuccess} onOpenCloseSearch={onOpenCloseSearch} />
            </div>
          )}
        </div>
      </div>

      <BasicModal title="Error de acceso" show={errorModalOpen} onClose={onOpenCloseErrorModal}>
        <ErrorAccesso apiError={apiError} onOpenCloseErrorModal={onOpenCloseErrorModal} />
      </BasicModal>

    </>

  )
}
