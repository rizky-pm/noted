import { useGetAllNotes } from '@/services/note';
import useTagService from '@/services/tag';
import { useEffect, useState, useRef, useCallback } from 'react';
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

const DashboardPage = () => {
  const [notes, setNotes] = useState<INote[]>([]);
  const filters = useSelector((state: RootState) => state.filter);
  const noteCardRef = useRef<HTMLDivElement | null>(null);
  const notePosition = useSelector(
    (state: RootState) => state.dashboard.note.position
  );

  const { getAllTags } = useTagService();
  const getAllNotes = useGetAllNotes(filters);
  const { data: notesData, isLoading } = getAllNotes;
  const { data: tagData, isFetched } = getAllTags;

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
      const updatedNotes = prevNotes.map((note) =>
        note._id === active.id
          ? {
              ...note,
              position: {
                x: note.position.x + delta.x,
                y: note.position.y + delta.y,
              },
            }
          : note
      );

      const draggedNoteIndex = updatedNotes.findIndex(
        (note) => note._id === active.id
      );
      if (draggedNoteIndex === -1) return prevNotes;

      const draggedNote = updatedNotes.splice(draggedNoteIndex, 1)[0];
      updatedNotes.push(draggedNote);

      const filteredNotes = updatedNotes.map(({ _id, position }) => ({
        _id,
        position,
      }));
      localStorage.setItem('notesPositions', JSON.stringify(filteredNotes));

      return updatedNotes;
    });
  };

  const getStoredNotesPositions = useCallback(() => {
    const storedData = localStorage.getItem('notesPositions');
    return storedData ? JSON.parse(storedData) : [];
  }, []);

  useEffect(() => {
    if (notesData?.notes) {
      const savedNotes = getStoredNotesPositions();

      const initialPositions = notesData.notes.map((note) => {
        const savedNote = savedNotes.find(
          (saved: {
            _id: string;
            position: {
              x: number;
              y: number;
            };
          }) => saved._id === note._id
        );

        const position = savedNote
          ? savedNote.position
          : {
              x: notePosition.x ? notePosition.x / 2 - 80 : 50,
              y: notePosition.y ? notePosition.y / 2 - 240 : 50,
            };

        return {
          ...note,
          position,
        };
      });

      const filteredNotes = initialPositions.map(({ _id, position }) => ({
        _id,
        position,
      }));
      localStorage.setItem('notesPositions', JSON.stringify(filteredNotes));
      setNotes(initialPositions);
    }
  }, [notesData, notePosition, getStoredNotesPositions]);

  useEffect(() => {
    if (noteCardRef) {
      const notePositionX = noteCardRef.current?.getBoundingClientRect().width;
      const notePositionY = noteCardRef.current?.getBoundingClientRect().height;
      dispatch(
        setNotePosition({
          x: notePositionX,
          y: notePositionY,
        })
      );
    }
  }, [noteCardRef, dispatch]);

  useEffect(() => {
    if (isFetched && tagData) {
      dispatch(storeTagData(tagData.data));
    }
  }, [isFetched, tagData, dispatch]);

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
