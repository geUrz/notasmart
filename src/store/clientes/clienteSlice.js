import { createSlice } from '@reduxjs/toolkit'
import axios from 'axios'

const initialState = {
  clientes: [],        
  cliente: null,       
  loading: false,
  error: null
}

const clientesSlice = createSlice({
  name: 'clientes',
  initialState,
  reducers: {
    setClientes: (state, action) => {
      state.clientes = action.payload
    },
    setCliente: (state, action) => {
      state.cliente = action.payload
    },
    setLoading: (state, action) => {
      state.loading = action.payload
    },
    setError: (state, action) => {
      state.error = action.payload
    },
    updateCliente: (state, action) => {
      const updated = action.payload
    
      if (state.cliente && state.cliente.id === updated.id) {
        state.cliente = { ...state.cliente, ...updated }
      }
    
      state.clientes = state.clientes.map((cli) =>
        cli.id === updated.id ? { ...cli, ...updated } : cli
      )
    }
    
  }
})

export const {
  setClientes,
  setCliente,
  setLoading,
  setError
} = clientesSlice.actions

export default clientesSlice.reducer

export const fetchClientes = (negocio_id = null) => async (dispatch) => {
  try {
    dispatch(setLoading(true))
    const url = negocio_id
      ? `/api/clientes/clientes?negocio_id=${negocio_id}`
      : '/api/clientes/clientes'

    const res = await axios.get(url)
    dispatch(setClientes(res.data))
  } catch (error) {
    dispatch(setError(error.response?.data?.error || 'Error al cargar clientes'))
  } finally {
    dispatch(setLoading(false))
  }
}

export const fetchClienteById = (id) => async (dispatch) => {
  try {
    dispatch(setLoading(true))
    const res = await axios.get(`/api/clientes/clientes?id=${id}`)
    dispatch(setCliente(res.data))
  } catch (error) {
    dispatch(setError(error.response?.data?.error || 'Error al cargar cliente'))
  } finally {
    dispatch(setLoading(false))
  }
}

export const updateCliente = (clienteData) => async (dispatch) => {
  try {
    dispatch(setLoading(true))

    const res = await axios.put(`/api/clientes/clientes?id=${clienteData.id}`, clienteData)

    dispatch({
      type: 'clientes/updateCliente',
      payload: res.data
    })
  } catch (error) {
    dispatch(setError(error.response?.data?.error || 'Error al actualizar cliente'))
  } finally {
    dispatch(setLoading(false))
  }
}

