import { useGetAllNotes, useUpdateNotePosition } from '@/services/note';
import { useEffect, useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { storeTagData } from '@/store/tag/tag.slice';
import Actions from './components/actions';
import { RootState } from '@/store';

import {
  DndContext,
  DragEndEvent,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  rectIntersection,
} from '@dnd-kit/core';

import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';

import { restrictToWindowEdges } from '@dnd-kit/modifiers';
import { INote } from '@/type';
import DraggableNote from './components/draggable-note';
import { setNotePosition } from './state';
import _ from 'lodash';
import { useGetAllTag } from '@/services/tag';
import { getWebSocket } from '@/lib/socket';
import { useQueryClient } from '@tanstack/react-query';
import useBreakpoints from '@/hooks/useMediaQuery';
import SortableNote from './components/sortable-note';

const DashboardPage = () => {
  const [notes, setNotes] = useState<INote[]>([]);
  const filters = useSelector((state: RootState) => state.filter);
  const noteCardRef = useRef<HTMLDivElement | null>(null);
  const queryClient = useQueryClient();
  const getAllNotes = useGetAllNotes(filters);
  const updateNotePosition = useUpdateNotePosition();

  const { isMediumScreen } = useBreakpoints();
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
  const sensors = useSensors(
    pointerSensor,
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    if (isMediumScreen) {
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
    } else {
      const { active, over } = event;

      if (!over || active.id === over.id) return;

      setNotes((items) => {
        const oldIndex = items.findIndex((item) => item._id === active.id);
        const newIndex = items.findIndex((item) => item._id === over.id);

        if (oldIndex === -1 || newIndex === -1) return items;

        return arrayMove(items, oldIndex, newIndex);
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
    const handleResize = () => {
      const newWidth = window.innerWidth;

      setNotes((prevNotes) =>
        prevNotes.map((note) => {
          const noteRightEdge = note.position.x + 320;

          if (noteRightEdge > newWidth) {
            return {
              ...note,
              position: {
                ...note.position,
                x: newWidth - 320,
              },
            };
          }

          return note;
        })
      );
    };

    const debouncedResize = _.debounce(handleResize, 0);

    window.addEventListener('resize', debouncedResize);

    return () => {
      window.removeEventListener('resize', debouncedResize);
    };
  }, []);

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
    <section className='w-full md:h-[calc(100vh-7.8125rem)] p-4 flex justify-center items-center flex-col'>
      <Actions />

      {noteCardRef ? (
        <div
          className='relative w-screen px-4 md:px-0 h-auto md:h-[calc(100%-16px)]'
          ref={noteCardRef}
        >
          <DndContext
            collisionDetection={rectIntersection}
            onDragEnd={handleDragEnd}
            modifiers={[restrictToWindowEdges]}
            sensors={sensors}
          >
            {isLoading ? (
              <h1>Loading data...</h1>
            ) : notes.length ? (
              isMediumScreen ? (
                notes.map((note) => (
                  <DraggableNote
                    key={note._id}
                    note={note}
                    position={note.position}
                  />
                ))
              ) : (
                <SortableContext
                  items={notes.map((note) => note._id)}
                  strategy={verticalListSortingStrategy}
                >
                  {notes.map((note) => (
                    <SortableNote key={note._id} note={note} />
                  ))}
                </SortableContext>
              )
            ) : (
              <div className='flex justify-center items-center relative top-0 left-0'>
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
