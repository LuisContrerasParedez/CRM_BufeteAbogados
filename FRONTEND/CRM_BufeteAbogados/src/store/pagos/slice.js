import { createSlice } from '@reduxjs/toolkit';
import {
  fetchPagos,
  fetchPago,
  createPago,
  updatePago,
  deletePago,
} from './thunks';

const initialState = {
  items: [],
  current: null,
  loading: false,
  error: null,
};

const pagosSlice = createSlice({
  name: 'pagos',
  initialState,
  reducers: {
    clearCurrentPago(state) {
      state.current = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // FETCH ALL
      .addCase(fetchPagos.pending, (s) => { s.loading = true; s.error = null; })
      .addCase(fetchPagos.fulfilled, (s, a) => { s.loading = false; s.items = a.payload; })
      .addCase(fetchPagos.rejected, (s, a) => { s.loading = false; s.error = a.payload; })

      // FETCH ONE
      .addCase(fetchPago.pending, (s) => { s.loading = true; s.error = null; })
      .addCase(fetchPago.fulfilled, (s, a) => { s.loading = false; s.current = a.payload; })
      .addCase(fetchPago.rejected, (s, a) => { s.loading = false; s.error = a.payload; })

      // CREATE
      .addCase(createPago.pending, (s) => { s.loading = true; s.error = null; })
      .addCase(createPago.fulfilled, (s, a) => { s.loading = false; s.items.push(a.payload); })
      .addCase(createPago.rejected, (s, a) => { s.loading = false; s.error = a.payload; })

      // UPDATE
      .addCase(updatePago.pending, (s) => { s.loading = true; s.error = null; })
      .addCase(updatePago.fulfilled, (s, a) => {
        s.loading = false;
        const idx = s.items.findIndex(p => p.id === a.payload.id);
        if (idx >= 0) s.items[idx] = a.payload;
      })
      .addCase(updatePago.rejected, (s, a) => { s.loading = false; s.error = a.payload; })

      // DELETE
      .addCase(deletePago.pending, (s) => { s.loading = true; s.error = null; })
      .addCase(deletePago.fulfilled, (s, a) => {
        s.loading = false;
        s.items = s.items.filter(p => p.id !== a.payload);
      })
      .addCase(deletePago.rejected, (s, a) => { s.loading = false; s.error = a.payload; });
  },
});

export const { clearCurrentPago } = pagosSlice.actions;
export default pagosSlice.reducer;
