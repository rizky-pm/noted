import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import axiosRequest from '..';
import { IGetAllNoteResponse, INoteServieFilters } from './type';
import { INewNote, INote } from '@/type';

export const useGetAllNotes = (filter: INoteServieFilters) => {
  return useQuery({
    queryKey: ['note.get-all', filter],
    queryFn: async () => {
      const response = await axiosRequest.post<IGetAllNoteResponse>(
        '/notes',
        filter,
        { withCredentials: true }
      );

      return response.data.data;
    },
  });
};

export const useCreateNote = () => {
  return useMutation({
    mutationKey: ['note.create-new'],
    mutationFn: async (note: INewNote) => {
      const response = await axiosRequest.post('/notes/create-new-note', note, {
        withCredentials: true,
      });

      return response.data;
    },
  });
};

export const useDeleteNote = () => {
  return useMutation({
    mutationKey: ['note.delete'],
    mutationFn: async (noteId: string) => {
      const response = await axiosRequest.delete(`/notes/${noteId}`, {
        withCredentials: true,
      });

      return response;
    },
  });
};

export const useEditNote = () => {
  return useMutation({
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
        { title, tag, content },
        { withCredentials: true }
      );

      return response;
    },
  });
};

export const useUpdateNotePosition = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ['note.update-position'],
    mutationFn: async (payload: { x: number; y: number; noteId: string }) => {
      const { x, y, noteId } = payload;
      const response = await axiosRequest.patch(
        `/notes/update-position/${noteId}`,
        { x, y },
        { withCredentials: true }
      );
      return response;
    },
    onMutate: async (newPosition) => {
      await queryClient.cancelQueries({ queryKey: ['note.get-all'] });

      const previousNotes = queryClient.getQueryData(['note.get-all']);

      queryClient.setQueryData(['note.get-all'], (oldNotes: INote[]) => {
        return oldNotes?.map((note: INote) =>
          note._id === newPosition.noteId
            ? { ...note, position: { x: newPosition.x, y: newPosition.y } }
            : note
        );
      });

      return { previousNotes };
    },
    onError: (_error, _newPosition, context) => {
      if (context?.previousNotes) {
        queryClient.setQueryData(['note.get-all'], context.previousNotes);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['note.get-all'] });
    },
  });
};
