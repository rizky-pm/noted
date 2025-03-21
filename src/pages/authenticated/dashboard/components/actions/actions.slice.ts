import { createSlice } from '@reduxjs/toolkit';

export interface IFilter {
  title: string | null;
  tag: string[];
}

const initialState: IFilter = {
  title: null,
  tag: [],
};

export const filterSlice = createSlice({
  name: 'filter',
  initialState,
  reducers: {
    applyFilter: (state, action) => {
      Object.assign(state, action.payload);
    },
  },
});

export const { applyFilter } = filterSlice.actions;
export default filterSlice.reducer;
