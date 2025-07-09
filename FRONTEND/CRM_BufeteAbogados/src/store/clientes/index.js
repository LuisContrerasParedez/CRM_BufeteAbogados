import { clienteSlice } from './slice';
import { fetchClientes, createCliente, deleteCliente } from './thunks';

export const clienteReducer = clienteSlice.reducer;
export { fetchClientes, createCliente, deleteCliente };
