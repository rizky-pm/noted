import { Clock } from 'lucide-react';

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

import { INote } from '@/type';
import { Badge } from '../ui/badge';
import { formatTimeAgo } from '@/lib/utils';
import { useBreakpoints } from '@/hooks';

interface IProps {
  data: INote;
}

const NoteCard = (props: IProps) => {
  const { data } = props;
  const { content, createdAt, updatedAt, title, tag } = data;
  const { isMediumScreen } = useBreakpoints();

  const timestamp = updatedAt ? updatedAt : createdAt;

  return (
    <Card className='h-40 w-full mt-4 md:mt-0 md:h-60 md:w-80 overflow-hidden cursor-pointer hover:bg-muted-foreground/10 transition-all select-none'>
      <CardHeader>
        <CardTitle className='truncate text-base md:text-lg'>{title}</CardTitle>
        <div>
          <Badge>{tag.label}</Badge>
        </div>
      </CardHeader>
      <CardContent className='mb-auto'>
        <p
          className={`${
            isMediumScreen ? 'line-clamp-4' : 'line-clamp-1'
          } text-sm`}
        >
          {content}
        </p>
      </CardContent>
      <CardFooter className='flex justify-between gap-2 py-4 text-xs'>
        <div className='flex items-center gap-2'>
          <Clock className='w-4 h-4' />

          <p className=''>{formatTimeAgo(timestamp)}</p>
        </div>
      </CardFooter>
    </Card>
  );
};

export default NoteCard;
