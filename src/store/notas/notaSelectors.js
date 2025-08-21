// Básicos
export const selectNota = (state) => state.nota.nota
export const selectNotas = (state) => state.nota.notas
export const selectSearchResults = (state) => state.nota.searchResults
export const selectNotaLoading = (state) => state.nota.loading
export const selectNotaError = (state) => state.nota.error

// Conceptos / Abonos / Anticipos
export const selectConceptos = (state) => state.nota.nota?.conceptos || []
export const selectAbonos = (state) => state.nota.nota?.abonos || []
export const selectAnticipos = (state) => state.nota.nota?.anticipos || []

// IVA
export const selectIVA = (state) => state.nota.nota?.iva ?? 0
export const selectIVATotal = (state) => state.nota.nota?.iva_total ?? 0

export const selectNegocioId = (state) => state.nota.NegocioId
export const selectTotalNotas = (state) => state.nota.totalNotas
export const selectTotalFolios = (state) => state.nota.totalFolios
export const selectPlan = (state) => state.nota.plan
export const selectPrecioGranTotal = (state) => state.nota.precioGranTotal
export const selectPorCobrarTotal = (state) => state.nota.porCobrarTotal
export const selectPrecioProductoBaseTotal = (state) => state.nota.precioProductoBaseTotal

