import { useDraggable } from '@dnd-kit/core';

import ViewNote from '../view-note';
import { INote } from '@/type';

interface IDraggableNoteProps {
  note: INote;
  position: {
    x: number;
    y: number;
  };
}

const DraggableNote = (props: IDraggableNoteProps) => {
  const { note, position } = props;
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: note._id,
  });

  const style = {
    position: 'absolute' as const,
    left: position.x,
    top: position.y,
    transition: transform ? 'none' : 'transform 0.2s ease',
  };

  return (
    <div ref={setNodeRef} {...listeners} {...attributes} style={style}>
      <ViewNote {...note} />
    </div>
  );
};

export default DraggableNote;
