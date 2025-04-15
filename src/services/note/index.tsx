import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import axiosRequest from '..';
import { IGetAllNoteResponse, INoteServieFilters } from './type';
import { INewNote, INote } from '@/type';
import { useSocket } from '@/hooks/useSocket';

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

interface UpdateNotePositionPayload {
  noteId: string;
  x?: number;
  y?: number;
  order?: number;
}

export const useUpdateNotePosition = () => {
  const queryClient = useQueryClient();
  const socket = useSocket('/ws/v1/notes/update-position');

  return useMutation({
    mutationKey: ['note.update-position-websocket'],
    mutationFn: async (payload: UpdateNotePositionPayload) => {
      if (socket?.readyState === WebSocket.OPEN) {
        socket.send(
          JSON.stringify({
            type: 'UPDATE_NOTE_POSITION',
            payload,
          })
        );
      }
      return true;
    },
    onMutate: async (newPosition) => {
      await queryClient.cancelQueries({ queryKey: ['note.get-all'] });

      const previousNotes = queryClient.getQueryData(['note.get-all']);

      queryClient.setQueryData(['note.get-all'], (oldNotes: INote[]) => {
        return oldNotes?.map((note: INote) =>
          note._id === newPosition.noteId
            ? {
                ...note,
                position: {
                  ...note.position,
                  ...(typeof newPosition.x === 'number' && {
                    x: newPosition.x,
                  }),
                  ...(typeof newPosition.y === 'number' && {
                    y: newPosition.y,
                  }),
                  ...(typeof newPosition.order === 'number' && {
                    order: newPosition.order,
                  }),
                },
              }
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
  });
};
