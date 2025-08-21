import { configureStore } from '@reduxjs/toolkit'
import usuarioReducer from './usuarios/usuarioSlice'
import notaReducer from './notas/notaSlice'
import clientesReducer from './clientes/clienteSlice'
import negocioReducer from './negocios/negocioSlice'

export const store = configureStore({
  reducer: {
    usuarios: usuarioReducer,
    nota: notaReducer,
    clientes: clientesReducer,
    negocios: negocioReducer
  },
})
