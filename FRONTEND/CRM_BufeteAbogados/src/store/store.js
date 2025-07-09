import { configureStore } from '@reduxjs/toolkit';
import { clienteReducer } from './clientes';
import { loginReducer } from './login';

export const store = configureStore({
  reducer: {
    cliente: clienteReducer,
    login: loginReducer,
  },
});
