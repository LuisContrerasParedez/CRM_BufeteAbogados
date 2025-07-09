import { createSlice } from '@reduxjs/toolkit';
import { fetchClientes, createCliente, deleteCliente } from './thunks';

const initialState = {
  clientes: [],
  loading: false,
};

export const clienteSlice = createSlice({
  name: 'cliente',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchClientes.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchClientes.fulfilled, (state, action) => {
        state.clientes = action.payload;
        state.loading = false;
      })
      .addCase(createCliente.fulfilled, (state, action) => {
        state.clientes.push(action.payload);
      })
      .addCase(deleteCliente.fulfilled, (state, action) => {
        state.clientes = state.clientes.filter((c) => c.id !== action.payload);
      });
  },
});
