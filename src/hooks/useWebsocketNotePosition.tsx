import { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { INote } from '@/type';
import { getWebSocket } from '@/lib/socket';

export const useWebSocketNotePosition = (
  setNotes: React.Dispatch<React.SetStateAction<INote[]>>
) => {
  const queryClient = useQueryClient();

  useEffect(() => {
    const socket = getWebSocket('/ws/v1/notes/update-position');

    socket.onmessage = (event: MessageEvent) => {
      try {
        const data = JSON.parse(event.data);
        if (data.type === 'UPDATE_NOTE_POSITION') {
          const { noteId, x, y, lastMovedAt } = data.payload;

          setNotes((prevNotes) =>
            prevNotes
              .map((note) =>
                note._id === noteId
                  ? {
                      ...note,
                      position: { ...note.position, x, y, lastMovedAt },
                    }
                  : note
              )
              .sort((a, b) => a.position.lastMovedAt - b.position.lastMovedAt)
          );
        }
      } catch (error) {
        console.error('Error parsing WS message:', error);
      }
    };
  }, [queryClient, setNotes]);
};
