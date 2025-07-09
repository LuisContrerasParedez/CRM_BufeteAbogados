import { configureStore } from '@reduxjs/toolkit';
import { clienteReducer } from './clientes';

export const store = configureStore({
  reducer: {
    cliente: clienteReducer,
  },
});
