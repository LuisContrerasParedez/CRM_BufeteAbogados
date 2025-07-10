// src/store/cuenta/cuentaSlice.js
import { createSlice } from '@reduxjs/toolkit'
import {
  fetchCuentas,
  createCuenta,
  updateCuenta,
  deleteCuenta,
} from './thunks'

const initialState = {
  items: [],
  loading: false,
  error: null,
}

const slice = createSlice({
  name: 'cuenta',
  initialState,
  reducers: {
    clearError(state) {
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      // FETCH ALL
      .addCase(fetchCuentas.pending, (s) => { s.loading = true; s.error = null })
      .addCase(fetchCuentas.fulfilled, (s, a) => {
        s.loading = false
        s.items = a.payload
      })
      .addCase(fetchCuentas.rejected, (s, a) => {
        s.loading = false
        s.error = a.error.message
      })

      // CREATE
      .addCase(createCuenta.pending, (s) => { s.loading = true })
      .addCase(createCuenta.fulfilled, (s, a) => {
        s.loading = false
        s.items.push(a.payload)
      })
      .addCase(createCuenta.rejected, (s, a) => {
        s.loading = false
        s.error = a.error.message
      })

      // UPDATE
      .addCase(updateCuenta.pending, (s) => { s.loading = true })
      .addCase(updateCuenta.fulfilled, (s, a) => {
        s.loading = false
        const i = s.items.findIndex(c => c.id === a.payload.id)
        if (i !== -1) s.items[i] = a.payload
      })
      .addCase(updateCuenta.rejected, (s, a) => {
        s.loading = false
        s.error = a.error.message
      })

      // DELETE
      .addCase(deleteCuenta.pending, (s) => { s.loading = true })
      .addCase(deleteCuenta.fulfilled, (s, a) => {
        s.loading = false
        s.items = s.items.filter(c => c.id !== a.payload)
      })
      .addCase(deleteCuenta.rejected, (s, a) => {
        s.loading = false
        s.error = a.error.message
      })
  },
})

export const { clearError } = slice.actions
export default slice.reducer
