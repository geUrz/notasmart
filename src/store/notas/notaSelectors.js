// Básicos
export const selectNota = (state) => state.nota.nota
export const selectNotas = (state) => state.nota.notas
export const selectNotaLoading = (state) => state.nota.loading
export const selectNotaError = (state) => state.nota.error

// Conceptos / Abonos / Anticipos
export const selectConceptos = (state) => state.nota.nota?.conceptos || []
export const selectAbonos = (state) => state.nota.nota?.abonos || []
export const selectAnticipos = (state) => state.nota.nota?.anticipos || []

// IVA
export const selectIVA = (state) => state.nota.nota?.iva ?? 0
export const selectIVATotal = (state) => state.nota.nota?.iva_total ?? 0

// 📊 Nuevos selectores agregados

// Datos por negocio
export const selectNegocioId = (state) => state.nota.NegocioId
export const selectTotalNotasNgId = (state) => state.nota.totalNotasNgId
export const selectTotalFoliosNgId = (state) => state.nota.totalFoliosNgId
export const selectPlan = (state) => state.nota.plan
export const selectPrecioGranTotalNgId = (state) => state.nota.precioGranTotalNgId
export const selectPorCobrarTotalNgId = (state) => state.nota.porCobrarTotalNgId
export const selectPrecioProductoBaseTotalNgId = (state) => state.nota.precioProductoBaseTotalNgId

// Datos globales (si es admin)
export const selectTotalNotasGlobal = (state) => state.nota.totalNotasGlobal
export const selectPrecioGranTotalGlobal = (state) => state.nota.precioGranTotalGlobal
export const selectPorCobrarTotalGlobal = (state) => state.nota.porCobrarTotalGlobal
export const selectPrecioProductoBaseTotalGlobal = (state) => state.nota.precioProductoBaseTotalGlobal
