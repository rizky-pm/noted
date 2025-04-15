import { useEffect } from 'react';
import { INote } from '@/type';

export const useSortedNotes = (
  notesData: { notes: INote[] } | undefined,
  setNotes: React.Dispatch<React.SetStateAction<INote[]>>,
  isMediumScreen: boolean
) => {
  useEffect(() => {
    if (isMediumScreen) {
      if (notesData?.notes) {
        const sorted = [...notesData.notes].sort(
          (a, b) =>
            (a.position.lastMovedAt || 0) - (b.position.lastMovedAt || 0)
        );
        setNotes(sorted);
      }
    } else {
      if (notesData?.notes) {
        const sorted = [...notesData.notes].sort(
          (a, b) => (a.position.order || 0) - (b.position.order || 0)
        );
        setNotes(sorted);
      }
    }
  }, [notesData, setNotes, isMediumScreen]);
};
