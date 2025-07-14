// src/store/notaSlice.js
import { createSlice } from '@reduxjs/toolkit'
import axios from 'axios'

const initialState = {
  nota: null,
  notas: [],
  totalNotasNgId: 0,
  totalFoliosNgId: 0,
  plan: null,
  precioGranTotalNgId: 0,
  porCobrarTotalNgId: 0,
  precioProductoBaseTotalNgId: 0,
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
        totalNotasNgId,
        totalFoliosNgId,
        plan,
        precioGranTotalNgId,
        porCobrarTotalNgId,
        precioProductoBaseTotalNgId,
        totalNotasGlobal,
        precioGranTotalGlobal,
        porCobrarTotalGlobal,
        precioProductoBaseTotalGlobal,
        negocioId
      } = action.payload

      state.notas = notas || []
      state.totalNotasNgId = totalNotasNgId ?? 0
      state.totalFoliosNgId = totalFoliosNgId ?? 0
      state.plan = plan ?? null
      state.precioGranTotalNgId = precioGranTotalNgId ?? 0
      state.porCobrarTotalNgId = porCobrarTotalNgId ?? 0
      state.precioProductoBaseTotalNgId = precioProductoBaseTotalNgId ?? 0
      state.totalNotasGlobal = totalNotasGlobal ?? 0
      state.precioGranTotalGlobal = precioGranTotalGlobal ?? 0
      state.porCobrarTotalGlobal = porCobrarTotalGlobal ?? 0
      state.precioProductoBaseTotalGlobal = precioProductoBaseTotalGlobal ?? 0
      state.negocioId = negocioId ?? null
    },
    setLoading: (state, action) => {
      state.loading = action.payload
    },
    setError: (state, action) => {
      state.error = action.payload
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
  setLoading,
  setError,
  updateConcepto,
  updateAbono,
  updateAnticipo,
  updateIVA
} = notaSlice.actions

export default notaSlice.reducer

export const fetchNotas = (negocio_id = null) => async (dispatch) => {
  try {
    dispatch(setLoading(true))
    const url = negocio_id
      ? `/api/notas/notas?negocio_id=${negocio_id}`
      : '/api/notas/notas'

    const res = await axios.get(url)
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
