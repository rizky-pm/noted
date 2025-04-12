import _ from 'lodash';
import { useEffect } from 'react';
import { INote } from '@/type';

export const useResizeNotePosition = (
  notes: INote[],
  setNotes: React.Dispatch<React.SetStateAction<INote[]>>
) => {
  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;

      setNotes((prevNotes) =>
        prevNotes.map((note) => {
          const rightEdge = note.position.x + 320;
          return rightEdge > width
            ? { ...note, position: { ...note.position, x: width - 320 } }
            : note;
        })
      );
    };

    const debounced = _.debounce(handleResize, 0);
    window.addEventListener('resize', debounced);
    return () => window.removeEventListener('resize', debounced);
  }, [setNotes, notes]);
};
