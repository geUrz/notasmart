// src/store/notaSlice.js
import { createSlice } from '@reduxjs/toolkit'
import axios from 'axios'

const initialState = {
  nota: null,
  notas: [],
  searchResults: [],
  totalNotas: 0,
  totalFolios: 0,
  plan: null,
  precioGranTotal: 0,
  porCobrarTotal: 0,
  precioProductoBaseTotal: 0,
  totalNotasGlobal: 0,
  precioGranTotalGlobal: 0,
  porCobrarTotalGlobal: 0,
  precioProductoBaseTotalGlobal: 0,
  negocioId: null,
  loading: false,
  error: null
}

export const notaSlice = createSlice({
  name: 'nota',
  initialState,
  reducers: {
    setNota: (state, action) => {
      state.nota = action.payload
    },
    setNotasData: (state, action) => {
      const {
        notas,
        totalNotas,
        totalFolios,
        plan,
        precioGranTotal,
        porCobrarTotal,
        precioProductoBaseTotal,
        totalNotasGlobal,
        precioGranTotalGlobal,
        porCobrarTotalGlobal,
        precioProductoBaseTotalGlobal,
        negocioId
      } = action.payload

      state.notas = notas || []
      state.totalNotas = totalNotas ?? 0
      state.totalFolios = totalFolios ?? 0
      state.plan = plan ?? null
      state.precioGranTotal = precioGranTotal ?? 0
      state.porCobrarTotal = porCobrarTotal ?? 0
      state.precioProductoBaseTotal = precioProductoBaseTotal ?? 0
      state.totalNotasGlobal = totalNotasGlobal ?? 0
      state.precioGranTotalGlobal = precioGranTotalGlobal ?? 0
      state.porCobrarTotalGlobal = porCobrarTotalGlobal ?? 0
      state.precioProductoBaseTotalGlobal = precioProductoBaseTotalGlobal ?? 0
      state.negocioId = negocioId ?? null
    },
    setSearchResults: (state, action) => {
      state.searchResults = action.payload;
    },
    clearSearchResults: (state) => {
      state.searchResults = [];
    },
    setLoading: (state, action) => {
      state.loading = action.payload
    },
    setError: (state, action) => {
      state.error = action.payload
    },
    updateNota: (state, action) => {
      const updated = action.payload;
    
      // Actualiza el nota seleccionado
      if (state.nota && state.nota.id === updated.id) {
        state.nota = { ...state.nota, ...updated }
      }
    
      // Actualiza la lista de notas
      state.notas = state.notas.map((n) =>
        n.id === updated.id ? { ...n, ...updated } : n
      )
    
      // También actualiza los resultados de búsqueda
      state.searchResults = state.searchResults.map((n) =>
        n.id === updated.id ? { ...n, ...updated } : n
      )
    },
    updateConcepto: (state, action) => {
      const concepto = action.payload
      const nuevosConceptos = state.nota.conceptos.map((c) =>
        c.id === concepto.id ? { ...concepto } : c
      )
      state.nota = { ...state.nota, conceptos: nuevosConceptos }
    },
    updateAbono: (state, action) => {
      const abono = action.payload
      const nuevosAbonos = state.nota.abonos.map((a) =>
        a.id === abono.id ? { ...abono } : a
      )
      state.nota = { ...state.nota, abonos: nuevosAbonos }
    },
    updateAnticipo: (state, action) => {
      const anticipo = action.payload
      const nuevosAnticipos = state.nota.anticipos.map((a) =>
        a.id === anticipo.id ? { ...anticipo } : a
      )
      state.nota = { ...state.nota, anticipos: nuevosAnticipos }
    },
    updateIVA: (state, action) => {
      const { iva, iva_total } = action.payload
      state.nota = { ...state.nota, iva, iva_total }
    }
  }
})

export const {
  setNota,
  setNotasData,
  setSearchResults, 
  clearSearchResults,
  setLoading,
  setError,
  updateNota,
  updateConcepto,
  updateAbono,
  updateAnticipo,
  updateIVA
} = notaSlice.actions

export default notaSlice.reducer

export const fetchNotas = (negocio_id) => async (dispatch) => {
  try {
    dispatch(setLoading(true))
    const res = await axios.get(`/api/notas/notas?negocio_id=${negocio_id}`)
    dispatch(setNotasData(res.data))
  } catch (error) {
    dispatch(setError(error.response?.data?.error || 'Error al cargar notas'))
  } finally {
    dispatch(setLoading(false))
  }
}

export const fetchNotaById = (id) => async (dispatch) => {
  try {
    dispatch(setLoading(true))
    const res = await axios.get(`/api/notas/notas?id=${id}`)
    dispatch(setNota(res.data))
  } catch (error) {
    dispatch(setError(error.response?.data?.error || 'Error al cargar nota'))
  } finally {
    dispatch(setLoading(false))
  }
}

export const searchNotas = (search) => async (dispatch) => {
  try {
    const res = await axios.get('/api/notas/notas', {
      params: { search },
    })
    dispatch(setSearchResults(res.data))
  } catch (err) {
    dispatch(setError('No se encontraron notas'))
  }
}

/* export const fetchNotas = (user) => async (dispatch) => {
  try {
    dispatch(setLoading(true))

    const isAdmin = user?.nivel === 'admin'
    const negocio_id = user?.negocio_id

    const url = isAdmin
      ? '/api/notas/notas' 
      : `/api/notas/notas?negocio_id=${negocio_id}`

    const res = await axios.get(url)
    dispatch(setNotasData(res.data))
  } catch (error) {
    dispatch(setError(error.response?.data?.error || 'Error al cargar notas'))
  } finally {
    dispatch(setLoading(false))
  }
} */


