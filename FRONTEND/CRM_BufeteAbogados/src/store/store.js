import { configureStore } from '@reduxjs/toolkit';
import { clienteReducer } from './clientes';
import { loginReducer } from './login';
import { cuentaReducer } from './cuentas';

export const store = configureStore({
  reducer: {
    cliente: clienteReducer,
    login: loginReducer,
    cuentas: cuentaReducer,
  },
});
