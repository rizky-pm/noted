import moment from 'moment';
import { CircleUserRound, Clock } from 'lucide-react';

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

import { INoteCard } from '@/type';
import { Badge } from '../ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@radix-ui/react-avatar';
import { formatTimeAgo, getInitialName } from '@/lib/utils';

interface IProps {
  data: INoteCard;
}

const NoteCard = (props: IProps) => {
  const { data } = props;
  const { id, content, createdAt, createdBy, modifiedAt, tag, title } = data;

  const timestamp = modifiedAt ? modifiedAt : createdAt;

  return (
    <Card className='h-60 w-80 overflow-hidden'>
      <CardHeader>
        <CardTitle className='truncate'>{title}</CardTitle>
        <div>
          <Badge>Badge</Badge>
        </div>
      </CardHeader>
      <CardContent className='mb-auto'>
        <p className='line-clamp-4 text-sm'>{content}</p>
      </CardContent>
      <CardFooter className='flex justify-between gap-2 py-4 text-xs'>
        <div className='flex items-center gap-2'>
          <Avatar>
            <AvatarImage
              src='https://github.com/shadcn.png'
              className='w-5 h-5 rounded-full'
              alt='@shadcn'
            />
            <AvatarFallback className='p-2 rounded-full'>
              {getInitialName(createdBy)}
            </AvatarFallback>
          </Avatar>

          <p className='truncate max-w-[7.1875rem]'>{createdBy}</p>
        </div>

        <div className='flex items-center gap-2'>
          <Clock className='w-4 h-4' />

          <p className=''>
            {/* {moment.unix(timestamp).format('DD MMM YYYY')} */}
            {formatTimeAgo(timestamp)}
          </p>
        </div>
      </CardFooter>
    </Card>
  );
};

export default NoteCard;
