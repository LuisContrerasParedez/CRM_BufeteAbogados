import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API = 'http://localhost:3000/rentas';

export const fetchRentas = createAsyncThunk(
  'rentas/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await axios.get(API);
      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

export const fetchRenta = createAsyncThunk(
  'rentas/fetchOne',
  async (id, { rejectWithValue }) => {
    try {
      const { data } = await axios.get(`${API}/${id}`);
      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

export const createRenta = createAsyncThunk(
  'rentas/create',
  async (renta, { rejectWithValue }) => {
    try {
      const { data } = await axios.post(API, renta);
      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

export const updateRenta = createAsyncThunk(
  'rentas/update',
  async ({ id, changes }, { rejectWithValue }) => {
    try {
      const { data } = await axios.patch(`${API}/${id}`, changes);
      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

export const deleteRenta = createAsyncThunk(
  'rentas/delete',
  async (id, { rejectWithValue }) => {
    try {
      await axios.delete(`${API}/${id}`);
      return id;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);
