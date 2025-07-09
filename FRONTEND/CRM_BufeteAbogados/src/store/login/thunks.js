// src/store/login/thunks.js
import { createAsyncThunk } from '@reduxjs/toolkit';

export const loginUsuario = createAsyncThunk(
  'login/loginUsuario',
  async (credenciales, { rejectWithValue }) => {
    try {
      const response = await fetch('http://localhost:3000/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credenciales),
      });

      if (!response.ok) {
        const error = await response.json();
        return rejectWithValue(error.message || 'Error al iniciar sesión');
      }

      const data = await response.json();

      localStorage.setItem('token', data.access_token);

      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);
