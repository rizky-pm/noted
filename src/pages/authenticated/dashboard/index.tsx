import { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  DndContext,
  DragEndEvent,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  rectIntersection,
} from '@dnd-kit/core';
import { restrictToWindowEdges } from '@dnd-kit/modifiers';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';

import { useGetAllNotes, useUpdateNotePosition } from '@/services/note';
import { useGetAllTag } from '@/services/tag';
import { storeTagData } from '@/store/tag/tag.slice';
import { RootState } from '@/store';
import { setNotePosition } from './state';

import Actions from './components/actions';
import DraggableNote from './components/draggable-note';
import SortableNote from './components/sortable-note';
import {
  useResizeNotePosition,
  useSortedNotes,
  useWebSocketNotePosition,
  useBreakpoints,
} from '@/hooks';

import { INote } from '@/type';
import { useWebsocketNoteOrder } from '@/hooks/useWebsocketNoteOrder';

const DashboardPage = () => {
  const [notes, setNotes] = useState<INote[]>([]);
  const dispatch = useDispatch();
  const noteCardRef = useRef<HTMLDivElement | null>(null);
  const filters = useSelector((state: RootState) => state.filter);

  const { isMediumScreen } = useBreakpoints();
  const getAllNotes = useGetAllNotes(filters);
  const { data: notesData, isLoading } = getAllNotes;
  const updateNotePosition = useUpdateNotePosition();

  const { data: tagData, isFetched } = useGetAllTag();

  useResizeNotePosition(notes, setNotes);
  useWebSocketNotePosition(setNotes);
  useWebsocketNoteOrder(setNotes, isMediumScreen);
  useSortedNotes(notesData, setNotes, isMediumScreen);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: { x: 5, y: 5 } },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    if (isMediumScreen) {
      handleFreeDrag(event);
    } else {
      handleReorder(event);
    }
  };

  // ** Handle drag and drop notes
  const handleFreeDrag = (event: DragEndEvent) => {
    const { active, delta } = event;
    const id = String(active.id);

    setNotes((prevNotes) =>
      prevNotes.map((note) =>
        note._id === id
          ? {
              ...note,
              position: {
                ...note.position,
                x: note.position.x + delta.x,
                y: note.position.y + delta.y,
              },
            }
          : note
      )
    );

    const note = notes.find((n) => n._id === id);
    if (note) {
      updateNotePosition.mutate({
        noteId: id,
        x: note.position.x + delta.x,
        y: note.position.y + delta.y,
      });
    }
  };

  // ** Handle note list
  const handleReorder = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    setNotes((items) => {
      const oldIndex = items.findIndex((item) => item._id === active.id);
      const newIndex = items.findIndex((item) => item._id === over.id);

      if (oldIndex === -1 || newIndex === -1) return items;

      const newItems = arrayMove(items, oldIndex, newIndex);
      const movedNote = newItems[newIndex];

      updateNotePosition.mutate({
        noteId: movedNote._id,
        order: newIndex,
      });

      return newItems;
    });
  };

  // ** Calculate default position
  useEffect(() => {
    const width = noteCardRef.current?.getBoundingClientRect().width || 0;
    const height = noteCardRef.current?.getBoundingClientRect().height || 0;

    if (width && height) {
      dispatch(setNotePosition({ x: width / 2 - 80, y: height / 2 - 240 }));
    }
  }, [noteCardRef, dispatch]);

  // ** Tag store
  useEffect(() => {
    if (isFetched && tagData) {
      dispatch(storeTagData(tagData.data));
    }
  }, [isFetched, tagData, dispatch]);

  return (
    <section className='w-full md:h-[calc(100vh-7.8125rem)] p-4 flex justify-center items-center flex-col'>
      <Actions />
      <div
        ref={noteCardRef}
        className='relative w-screen px-4 md:px-0 h-auto md:h-[calc(100%-16px)] md:flex md:justify-center md:items-center'
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
    </section>
  );
};

export default DashboardPage;
