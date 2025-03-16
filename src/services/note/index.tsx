import { useMutation, useQuery } from '@tanstack/react-query';
import axiosRequest from '..';
import { IGetAllNoteResponse } from './type';
import { INewNote } from '@/type';

const useNoteService = () => {
  const getAllNotes = useQuery({
    queryKey: ['note.get-all'],
    queryFn: async () => {
      const response = await axiosRequest.get<IGetAllNoteResponse>('/notes', {
        withCredentials: true,
      });

      return response.data.data;
    },
  });

  const createNewNote = useMutation({
    mutationKey: ['note.create-new'],
    mutationFn: async (note: INewNote) => {
      const response = await axiosRequest.post('/notes/create-new-note', note, {
        withCredentials: true,
      });

      return response.data;
    },
  });

  const deleteNote = useMutation({
    mutationKey: ['note.delete'],
    mutationFn: async (noteId: string) => {
      const response = await axiosRequest.delete(`/notes/${noteId}`, {
        withCredentials: true,
      });

      return response;
    },
  });

  const editNote = useMutation({
    mutationKey: ['note.update'],
    mutationFn: async (payload: {
      noteId: string;
      title: string;
      tag: string;
      content: string;
    }) => {
      const { content, noteId, tag, title } = payload;
      const response = await axiosRequest.put(
        `/notes/${noteId}`,
        {
          title,
          tag,
          content,
        },
        { withCredentials: true }
      );

      return response;
    },
  });

  return { getAllNotes, createNewNote, deleteNote, editNote };
};

export default useNoteService;
