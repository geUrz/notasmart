import { configureStore } from '@reduxjs/toolkit'
import notaReducer from './notas/notaSlice'
import clientesReducer from './clientes/clienteSlice'
import negocioReducer from './negocios/negocioSlice'

export const store = configureStore({
  reducer: {
    nota: notaReducer,
    clientes: clientesReducer,
    negocios: negocioReducer
  },
})
