import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API = 'http://localhost:3000/cliente';

export const fetchClientes = createAsyncThunk('cliente/fetchAll', async () => {
  const res = await axios.get(API);
  return res.data;
});

export const createCliente = createAsyncThunk('cliente/create', async (cliente) => {
  const res = await axios.post(API, cliente);
  return res.data;
});

export const deleteCliente = createAsyncThunk('cliente/delete', async (id) => {
  await axios.delete(`${API}/${id}`);
  return id;
});
