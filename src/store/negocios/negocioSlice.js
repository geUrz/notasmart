import { createSlice } from '@reduxjs/toolkit'
import axios from 'axios'

const initialState = {
  negocio: null,
  negocios: [],
  loading: false,
  error: null
}

export const negocioSlice = createSlice({
  name: 'negocios',
  initialState,
  reducers: {
    setNegocio: (state, action) => {
      state.negocio = action.payload
    },
    setNegocios: (state, action) => {
      state.negocios = action.payload
    },
    setLoading: (state, action) => {
      state.loading = action.payload
    },
    setError: (state, action) => {
      state.error = action.payload
    },
    updateNegocio: (state, action) => {
      const updated = action.payload
    
      if (state.negocio && state.negocio.id === updated.id) {
        state.negocio = { ...state.negocio, ...updated }
      }
    
      state.negocios = state.negocios.map((n) =>
        n.id === updated.id ? { ...n, ...updated } : n
      )
    }    
  }
})

export const { setNegocio, setNegocios, setLoading, setError, updateNegocio } = negocioSlice.actions
export default negocioSlice.reducer

export const fetchNegocios = () => async (dispatch) => {
  try {
    dispatch(setLoading(true))
    const res = await axios.get('/api/negocios/negocios')
    dispatch(setNegocios(res.data))
  } catch (error) {
    dispatch(setError(error.response?.data?.error || 'Error al cargar negocios'))
  } finally {
    dispatch(setLoading(false))
  }
}

export const fetchNegocioById = (id) => async (dispatch) => {
  try {
    dispatch(setLoading(true))
    const res = await axios.get(`/api/negocios/negocios?id=${id}`)
    dispatch(setNegocio(res.data))
  } catch (error) {
    dispatch(setError(error.response?.data?.error || 'Error al cargar negocio'))
  } finally {
    dispatch(setLoading(false))
  }
}


