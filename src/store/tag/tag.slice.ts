import { ITag } from '@/types/tag.type';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

const initialState: ITag[] = [];

export const tagSlice = createSlice({
  name: 'tag',
  initialState,
  reducers: {
    storeTagData: (state, action: PayloadAction<ITag[]>) => {
      return action.payload;
    },
  },
});

export const { storeTagData } = tagSlice.actions;
export default tagSlice.reducer;
