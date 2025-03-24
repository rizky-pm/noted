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
    position: {
      x: number;
      y: number;
    };
    isOpen: boolean;
  };
}

const initialState: IDashboardState = {
  note: {
    isEdit: false,
    selectedNote: null,
    position: {
      x: 0,
      y: 0,
    },
    isOpen: false,
  },
};

export const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState,
  reducers: {
    toggleEditMode: (state, action: PayloadAction<INewNote | undefined>) => {
      state.note.isEdit = !state.note.isEdit;
      if (!state.note.isEdit) {
        state.note.selectedNote = null;
      } else {
        state.note.selectedNote = action.payload ? action.payload : null;
      }
    },
    setNotePosition: (state, action) => {
      state.note.position = action.payload;
    },
    toggleOpenNoteDialog: (state) => {
      state.note.isOpen = !state.note.isOpen;
    },
  },
});

export const { toggleEditMode, setNotePosition, toggleOpenNoteDialog } =
  dashboardSlice.actions;
export default dashboardSlice.reducer;
