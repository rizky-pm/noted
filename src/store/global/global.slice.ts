import { createSlice } from '@reduxjs/toolkit';

export interface IGlobalState {
  isLoading: boolean;
}

const initialState: IGlobalState = {
  isLoading: false,
};

export const globalSlice = createSlice({
  name: 'global',
  initialState,
  reducers: {
    toggleLoading: (state, action) => {
      state.isLoading = action.payload;
    },
  },
});

export const { toggleLoading } = globalSlice.actions;
export default globalSlice.reducer;
