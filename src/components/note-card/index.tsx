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

interface IProps {
  data: INote;
}

const NoteCard = (props: IProps) => {
  const { data } = props;
  const { content, createdAt, updatedAt, title, tag } = data;

  const timestamp = updatedAt ? updatedAt : createdAt;

  return (
    <Card className='h-60 w-80 overflow-hidden cursor-pointer hover:bg-muted-foreground/10 transition-all'>
      <CardHeader>
        <CardTitle className='truncate'>{title}</CardTitle>
        <div>
          <Badge>{tag.label}</Badge>
        </div>
      </CardHeader>
      <CardContent className='mb-auto'>
        <p className='line-clamp-4 text-sm'>{content}</p>
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
