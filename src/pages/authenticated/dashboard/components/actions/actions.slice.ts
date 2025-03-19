import { createSlice } from '@reduxjs/toolkit';

export interface IFilters {
  title: string | null;
}

const initialState: IFilters = {
  title: null,
};

export const filtersSlice = createSlice({
  name: 'filters',
  initialState,
  reducers: {
    applyFilters: (state, action) => {
      console.log(action);
      Object.assign(state, action.payload);
    },
  },
});

export const { applyFilters } = filtersSlice.actions;
export default filtersSlice.reducer;
