// src/store/cuenta/thunks.js
import { createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'

// Base URL (ajusta si la tienes en .env)
const API = axios.create({ baseURL: 'http://localhost:3000' })

export const fetchCuentas = createAsyncThunk(
  'cuenta/fetchAll',
  async () => {
    const { data } = await API.get('/cuentas')
    return data
  }
)

export const createCuenta = createAsyncThunk(
  'cuenta/create',
  async (payload) => {
    const { data } = await API.post('/cuentas', payload)
    return data
  }
)

export const updateCuenta = createAsyncThunk(
  'cuenta/update',
  async ({ id, ...payload }) => {
    const { data } = await API.patch(`/cuentas/${id}`, payload)
    return data
  }
)

export const deleteCuenta = createAsyncThunk(
  'cuenta/delete',
  async (id) => {
    await API.delete(`/cuentas/${id}`)
    return id
  }
)
