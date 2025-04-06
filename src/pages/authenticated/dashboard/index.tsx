import { useGetAllNotes, useUpdateNotePosition } from '@/services/note';
import { useEffect, useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { storeTagData } from '@/store/tag/tag.slice';
import Actions from './components/actions';
import { RootState } from '@/store';

import {
  DndContext,
  DragEndEvent,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import { restrictToWindowEdges } from '@dnd-kit/modifiers';
import { INote } from '@/type';
import DraggableNote from './components/draggable-note';
import { setNotePosition } from './state';
import _ from 'lodash';
import { useGetAllTag } from '@/services/tag';
import { getWebSocket } from '@/lib/socket';
import { useQueryClient } from '@tanstack/react-query';

const DashboardPage = () => {
  const [notes, setNotes] = useState<INote[]>([]);
  const filters = useSelector((state: RootState) => state.filter);
  const noteCardRef = useRef<HTMLDivElement | null>(null);
  const queryClient = useQueryClient();
  const getAllNotes = useGetAllNotes(filters);
  const updateNotePosition = useUpdateNotePosition();
  const { data: notesData, isLoading } = getAllNotes;
  const { data: tagData, isFetched } = useGetAllTag();

  const dispatch = useDispatch();
  const pointerSensor = useSensor(PointerSensor, {
    activationConstraint: {
      distance: {
        x: 5,
        y: 5,
      },
    },
  });
  const sensors = useSensors(pointerSensor);

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, delta } = event;

    setNotes((prevNotes) => {
      return prevNotes.map((note) => {
        if (note._id !== active.id) return note;

        return {
          ...note,
          position: {
            ...note.position,
            x: note.position.x + delta.x,
            y: note.position.y + delta.y,
          },
        };
      });
    });

    const noteId = _.toString(active.id);
    const note = notes.find((n) => n._id === noteId);

    if (note) {
      updateNotePosition.mutate({
        noteId,
        x: note.position.x + delta.x,
        y: note.position.y + delta.y,
      });
    }
  };

  useEffect(() => {
    if (notesData?.notes) {
      const initialPositions = [...notesData.notes];

      initialPositions.sort(
        (a, b) => (a.position.lastMovedAt || 0) - (b.position.lastMovedAt || 0)
      );

      setNotes(initialPositions);
    }
  }, [notesData]);

  useEffect(() => {
    if (noteCardRef) {
      const notePositionX = noteCardRef.current?.getBoundingClientRect().width;
      const notePositionY = noteCardRef.current?.getBoundingClientRect().height;

      if (notePositionX && notePositionY) {
        dispatch(
          setNotePosition({
            x: notePositionX / 2 - 80,
            y: notePositionY / 2 - 240,
          })
        );
      }
    }
  }, [noteCardRef, dispatch]);

  useEffect(() => {
    if (isFetched && tagData) {
      dispatch(storeTagData(tagData.data));
    }
  }, [isFetched, tagData, dispatch]);

  useEffect(() => {
    const socket = getWebSocket('/ws/v1/notes/update-position');

    socket.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);

        if (data.type === 'UPDATE_NOTE_POSITION') {
          const { noteId, x, y, lastMovedAt } = data.payload;

          setNotes((prevNotes) => {
            const updated = prevNotes.map((note) => {
              if (note._id !== noteId) return note;

              return {
                ...note,
                position: {
                  ...note.position,
                  x,
                  y,
                  lastMovedAt,
                },
              };
            });

            return updated.sort(
              (a, b) => a.position.lastMovedAt - b.position.lastMovedAt
            );
          });
        }
      } catch (error) {
        console.error('❌ Error parsing WS message:', error);
      }
    };
  }, [queryClient]);

  return (
    <section className='w-full h-[calc(100vh-6rem)] p-4'>
      <Actions />

      {noteCardRef ? (
        <div className='relative h-[calc(100%-16px)]' ref={noteCardRef}>
          <DndContext
            onDragEnd={handleDragEnd}
            modifiers={[restrictToWindowEdges]}
            sensors={sensors}
          >
            {isLoading ? (
              <h1>Loading data...</h1>
            ) : notes.length ? (
              notes.map((note) => (
                <DraggableNote
                  key={note._id}
                  note={note}
                  position={note.position}
                />
              ))
            ) : (
              <div className='flex justify-center items-center w-full h-full'>
                <p className='text-muted-foreground text-sm'>
                  You don&apos;t have any notes. Try adding one!
                </p>
              </div>
            )}
          </DndContext>
        </div>
      ) : null}
    </section>
  );
};

export default DashboardPage;
