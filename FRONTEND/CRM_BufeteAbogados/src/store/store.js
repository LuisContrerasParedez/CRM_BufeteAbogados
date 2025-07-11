import { configureStore } from '@reduxjs/toolkit';
import { clienteReducer } from './clientes';
import { loginReducer } from './login';
import { cuentaReducer } from './cuentas';
import { pagosReducer } from './pagos';
import { rentasReducer } from './Renta';

export const store = configureStore({
  reducer: {
    cliente: clienteReducer,
    login: loginReducer,
    pagos: pagosReducer,
    rentas: rentasReducer,      
    cuentas: cuentaReducer,
  },
});
