import { INewNote } from '@/type';
import { ITag } from '@/types/tag.type';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface IDashboardState {
  note: {
    isEdit: boolean;
    selectedNote: {
      title: string;
      tag: string;
      content: string;
    } | null;
  };
  tags: ITag[];
}

const initialState: IDashboardState = {
  note: {
    isEdit: false,
    selectedNote: null,
  },
  tags: [],
};

export const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState,
  reducers: {
    toggleEditMode: (state, action: PayloadAction<INewNote | undefined>) => {
      console.log(action);
      state.note.isEdit = !state.note.isEdit;
      if (!state.note.isEdit) {
        state.note.selectedNote = null;
      } else {
        state.note.selectedNote = action.payload ? action.payload : null;
      }
    },
    storeTagData: (state, action: PayloadAction<ITag[]>) => {
      state.tags = action.payload;
    },
  },
});

export const { toggleEditMode, storeTagData } = dashboardSlice.actions;
export default dashboardSlice.reducer;
