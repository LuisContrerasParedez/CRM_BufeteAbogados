import { createSlice } from '@reduxjs/toolkit';
import {
  fetchRentas,
  fetchRenta,
  createRenta,
  updateRenta,
  deleteRenta,
} from './thunks';

const initialState = {
  items: [],
  current: null,
  loading: false,
  error: null,
};

const rentasSlice = createSlice({
  name: 'rentas',
  initialState,
  reducers: {
    clearCurrentRenta(state) {
      state.current = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchRentas.pending, (s) => { s.loading = true; s.error = null; })
      .addCase(fetchRentas.fulfilled, (s, a) => { s.loading = false; s.items = a.payload; })
      .addCase(fetchRentas.rejected, (s, a) => { s.loading = false; s.error = a.payload; })

      .addCase(fetchRenta.pending, (s) => { s.loading = true; s.error = null; })
      .addCase(fetchRenta.fulfilled, (s, a) => { s.loading = false; s.current = a.payload; })
      .addCase(fetchRenta.rejected, (s, a) => { s.loading = false; s.error = a.payload; })

      .addCase(createRenta.pending, (s) => { s.loading = true; s.error = null; })
      .addCase(createRenta.fulfilled, (s, a) => { s.loading = false; s.items.push(a.payload); })
      .addCase(createRenta.rejected, (s, a) => { s.loading = false; s.error = a.payload; })

      .addCase(updateRenta.pending, (s) => { s.loading = true; s.error = null; })
      .addCase(updateRenta.fulfilled, (s, a) => {
        s.loading = false;
        const idx = s.items.findIndex(r => r.id === a.payload.id);
        if (idx >= 0) s.items[idx] = a.payload;
      })
      .addCase(updateRenta.rejected, (s, a) => { s.loading = false; s.error = a.payload; })

      .addCase(deleteRenta.pending, (s) => { s.loading = true; s.error = null; })
      .addCase(deleteRenta.fulfilled, (s, a) => {
        s.loading = false;
        s.items = s.items.filter(r => r.id !== a.payload);
      })
      .addCase(deleteRenta.rejected, (s, a) => { s.loading = false; s.error = a.payload; });
  },
});

export const { clearCurrentRenta } = rentasSlice.actions;
export default rentasSlice.reducer;
