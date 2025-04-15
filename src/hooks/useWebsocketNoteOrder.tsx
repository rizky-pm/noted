import { getWebSocket } from '@/lib/socket';
import { INote } from '@/type';
import { useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';

export const useWebsocketNoteOrder = (
  setNotes: React.Dispatch<React.SetStateAction<INote[]>>,
  isMediumScreen: boolean
) => {
  const queryClient = useQueryClient();

  useEffect(() => {
    if (isMediumScreen) return;

    const socket = getWebSocket('/ws/v1/notes/update-position');

    socket.onmessage = (event: MessageEvent) => {
      try {
        const data = JSON.parse(event.data);

        if (data.type === 'UPDATE_NOTE_POSITION') {
          const { noteId, order } = data.payload;

          setNotes((prevNotes) => {
            const movedNote = prevNotes.find((note) => note._id === noteId);
            if (!movedNote) return prevNotes;

            const oldOrder = movedNote.position.order;
            const newOrder = order;

            return prevNotes.map((note) => {
              if (note._id === noteId) {
                return {
                  ...note,
                  position: {
                    ...note.position,
                    order: newOrder,
                  },
                };
              }

              // ** Moving down, shift up others in between
              if (
                oldOrder < newOrder &&
                note.position.order > oldOrder &&
                note.position.order <= newOrder
              ) {
                return {
                  ...note,
                  position: {
                    ...note.position,
                    order: note.position.order - 1,
                  },
                };
              }

              // ** Moving up, shift down others in between
              if (
                oldOrder > newOrder &&
                note.position.order >= newOrder &&
                note.position.order < oldOrder
              ) {
                return {
                  ...note,
                  position: {
                    ...note.position,
                    order: note.position.order + 1,
                  },
                };
              }

              return note;
            });
          });
        }
      } catch (error) {
        console.error('Error parsing WS message:', error);
      }
    };
  }, [queryClient, setNotes, isMediumScreen]);
};
