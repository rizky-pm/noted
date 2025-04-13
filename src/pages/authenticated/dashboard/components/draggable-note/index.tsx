import { useDraggable } from '@dnd-kit/core';
import { INote } from '@/type';
import ViewNote from '../view-note';

interface IDraggableNoteProps {
  note: INote;
  position: {
    x: number;
    y: number;
  };
}

const DraggableNote = (props: IDraggableNoteProps) => {
  const { note, position } = props;

  const {
    setNodeRef,
    transform,
    attributes,
    listeners = {},
  } = useDraggable({
    id: note._id,
  });

  const style = {
    position: 'absolute' as const,
    left: position.x,
    top: position.y,
    transition: transform ? 'none' : 'transform 0.2s ease',
  };

  const handlePointerDown = (event: React.PointerEvent) => {
    const target = event.target as HTMLElement;

    if (
      target.closest('input') ||
      target.closest('textarea') ||
      target.closest('select') ||
      target.closest('button')
    ) {
      return;
    }

    listeners.onPointerDown?.(event);
  };

  return (
    <div
      ref={setNodeRef}
      {...attributes}
      onPointerDown={handlePointerDown}
      style={style}
    >
      <ViewNote {...note} />
    </div>
  );
};

export default DraggableNote;
