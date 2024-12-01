import { createSlice, PayloadAction } from '@reduxjs/toolkit';


interface AuthState {
  isAuthenticated: boolean;
  user: { username: string | null; token: string | null; id: number | null };
}

const initialState: AuthState = {
  isAuthenticated: false,
  user: { username: null, token: null, id: null },
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    login(state, action: PayloadAction<{ username: string; token: string; id: number }>) {
      state.isAuthenticated = true;
      state.user = action.payload;
    },
    logout(state) {
      state.isAuthenticated = false;
      state.user = { username: null, token: null, id: null };
    },
  },
});

export const { login, logout } = authSlice.actions;

export default authSlice.reducer;