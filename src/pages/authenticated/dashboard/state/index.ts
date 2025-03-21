import { INewNote } from '@/type';
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
}

const initialState: IDashboardState = {
  note: {
    isEdit: false,
    selectedNote: null,
  },
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
  },
});

export const { toggleEditMode } = dashboardSlice.actions;
export default dashboardSlice.reducer;
