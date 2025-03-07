import { createSlice } from '@reduxjs/toolkit';

export interface IAuthState {
  user: {
    id: string;
    username: string;
    email: string;
  } | null;
  isLoading: boolean;
}

const initialState: IAuthState = {
  user: null,
  isLoading: false,
};

export const authSlice = createSlice({
  name: 'authentication',
  initialState,

  reducers: {
    checkUser: (state) => {
      state.isLoading = true;
    },
    signIn: (state, action) => {
      state.user = action.payload;
      state.isLoading = false;
    },
    signOut: (state) => {
      state.user = null;
      state.isLoading = false;
    },
  },
});

export const { signIn, signOut, checkUser } = authSlice.actions;
export default authSlice.reducer;
