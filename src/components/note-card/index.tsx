import { Clock } from 'lucide-react';

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn, formatTimeAgo } from '@/lib/utils';
import { useBreakpoints } from '@/hooks';
import { INote } from '@/type';
import {
  getBadgeClasses,
  getNoteCardClasses,
} from '@/pages/authenticated/dashboard/helpers/getStyleClasses';

interface NoteCardProps {
  data: INote;
}

const NoteCard = ({ data }: NoteCardProps) => {
  const { content, createdAt, updatedAt, title, tag } = data;
  const { isMediumScreen } = useBreakpoints();

  const timestamp = updatedAt || createdAt;

  return (
    <Card
      className={cn(
        'h-40 w-full mt-4 md:mt-0 md:h-60 md:w-80 overflow-hidden cursor-pointer rounded-md transition-all select-none',
        getNoteCardClasses(tag.color, false)
      )}
    >
      <CardHeader>
        <CardTitle className='truncate text-base md:text-lg'>{title}</CardTitle>
        <div>
          <Badge className={getBadgeClasses(tag.color)}>{tag.label}</Badge>
        </div>
      </CardHeader>

      <CardContent className='mb-auto'>
        <p
          className={cn(
            'text-sm',
            isMediumScreen ? 'line-clamp-4' : 'line-clamp-1'
          )}
        >
          {content}
        </p>
      </CardContent>

      <CardFooter className='flex justify-between gap-2 py-4 text-xs'>
        <div className='flex items-center gap-2'>
          <Clock className='w-4 h-4' />
          <p>{formatTimeAgo(timestamp)}</p>
        </div>
      </CardFooter>
    </Card>
  );
};

export default NoteCard;
