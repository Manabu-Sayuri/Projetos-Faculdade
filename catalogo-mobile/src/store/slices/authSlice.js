import { createSlice } from '@reduxjs/toolkit';

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    isAuthenticated: false,
    user: null,
    registeredUsers: [
      // 👇 Conta pré-cadastrada garantida para testes
      { email: 'teste@teste.com', password: '123456' }
    ],
  },
  reducers: {
    registerUser: (state, action) => {
      state.registeredUsers.push(action.payload); // Salva o novo usuário
    },
    login: (state, action) => {
      state.isAuthenticated = true;
      state.user = action.payload;
    },
    logout: (state) => {
      state.isAuthenticated = false;
      state.user = null;
    },
  },
});

// Exporte a nova ação registerUser
export const { login, logout, registerUser } = authSlice.actions;
export default authSlice.reducer;