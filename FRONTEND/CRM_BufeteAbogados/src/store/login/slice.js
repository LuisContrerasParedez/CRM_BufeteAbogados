import { createSlice } from '@reduxjs/toolkit';
import { loginUsuario } from './thunks';

const initialState = {
  usuario: null,
  token: null,
  loading: false,
  error: null,
};

export const loginSlice = createSlice({
  name: 'login',
  initialState,
  reducers: {
    logout(state) {
      state.usuario = null;
      state.token = null;
      localStorage.removeItem('token');
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUsuario.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUsuario.fulfilled, (state, action) => {
        state.loading = false;
        state.usuario = action.payload.usuario;
        state.token = action.payload.access_token;
      })
      .addCase(loginUsuario.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Error de autenticación';
      });
  },
});

export const { logout } = loginSlice.actions;

// 👇 Este es el que se importa como loginReducer
export const loginReducer = loginSlice.reducer;
