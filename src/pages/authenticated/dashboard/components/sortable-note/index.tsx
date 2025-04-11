import ViewNote from '../view-note';
import { INote } from '@/type';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

interface ISortableNote {
  note: INote;
}

const SortableNote = (props: ISortableNote) => {
  const { note } = props;

  const { setNodeRef, listeners, attributes, transition, transform } =
    useSortable({ id: note._id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition: transition,
  };

  return (
    <div ref={setNodeRef} {...listeners} {...attributes} style={style}>
      <ViewNote {...note} />
    </div>
  );
};

export default SortableNote;
