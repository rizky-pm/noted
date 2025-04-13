import { useEffect, useRef, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useSelector } from 'react-redux';
import moment from 'moment';

import { Clock } from 'lucide-react';
import { toast } from 'sonner';
import { useDraggable } from '@dnd-kit/core';
import { useSortable } from '@dnd-kit/sortable';

import { useBreakpoints } from '@/hooks';

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import {
  Form,
  FormField,
  FormItem,
  FormMessage,
  FormDescription,
} from '@/components/ui/form';
import { DialogDescription } from '@radix-ui/react-dialog';
import NoteCard from '@/components/note-card';

import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { createNewNoteSchema } from '@/schema';
import { INote } from '@/type';
import { RootState } from '@/store';

import { cn, formatTimeAgo } from '@/lib/utils';

import { useDeleteNote, useEditNote } from '@/services/note';

const ViewNote = (note: INote) => {
  const [isEditMode, setIsEditMode] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const tags = useSelector((state: RootState) => state.tag);
  const { isMediumScreen } = useBreakpoints();

  const draggable = useDraggable({ id: note._id });
  const sortable = useSortable({ id: note._id });

  const queryClient = useQueryClient();
  const deleteNote = useDeleteNote();
  const editNote = useEditNote();

  const timestamp = note.updatedAt ?? note.createdAt;
  const closeDialogRef = useRef<HTMLDivElement | null>(null);

  const form = useForm<z.infer<typeof createNewNoteSchema>>({
    resolver: zodResolver(createNewNoteSchema),
    defaultValues: {
      title: note.title,
      tag: note.tag.code,
      content: note.content,
    },
  });

  const contentLength = form.watch('content').length;

  const nodeRef = isMediumScreen ? draggable.setNodeRef : sortable.setNodeRef;
  const style = isMediumScreen
    ? {
        transform: draggable.transform
          ? `translate3d(${draggable.transform.x}px, ${draggable.transform.y}px, 0)`
          : undefined,
      }
    : { transform: undefined, transition: 'transform 200ms ease' };

  const onClickEdit = () => setIsEditMode((prev) => !prev);

  const onClickDelete = (noteId: string) => {
    deleteNote.mutateAsync(noteId, {
      onSuccess: () => {
        toast.success('Success delete note');
        queryClient.invalidateQueries({ queryKey: ['note.get-all'] });
        if (closeDialogRef) {
          closeDialogRef.current?.click();
        }
      },

      onError: (error) => {
        console.error(error);
        toast.error(error.message);
      },
    });
  };

  const onSubmitEditNote = (values: z.infer<typeof createNewNoteSchema>) => {
    const payload = {
      noteId: note._id,
      ...values,
    };

    editNote.mutateAsync(payload, {
      onSuccess: () => {
        toast.success('Success edit note');
        queryClient.invalidateQueries({ queryKey: ['note.get-all'] });
        if (closeDialogRef) {
          closeDialogRef.current?.click();
          setIsDialogOpen(false);
        }
      },

      onError: (error) => {
        console.error(error);
        toast.error(error.message);
      },
    });
  };

  useEffect(() => {
    if (!isDialogOpen) {
      setTimeout(() => setIsEditMode(false), 500);
    }
  }, [isDialogOpen]);

  return (
    <>
      <div
        ref={nodeRef}
        style={style}
        onClick={() => {
          setIsDialogOpen(true);
        }}
        className='bg-muted'
      >
        <NoteCard data={note} key={note._id} />
      </div>

      <Dialog
        open={isDialogOpen}
        onOpenChange={(isOpen) => {
          setIsDialogOpen(isOpen);

          if (!isOpen) {
            form.reset();
          }
        }}
      >
        <DialogContent
          className={cn(
            'max-w-[37.5rem]',
            getNoteCardClasses(note.tag.color, isEditMode)
          )}
        >
          {isEditMode ? (
            <>
              <DialogHeader>
                <DialogTitle>Edit note</DialogTitle>
                <DialogDescription className='text-sm'>
                  {moment.unix(timestamp).format('ddd, DD MMMM YYYY')}
                </DialogDescription>
              </DialogHeader>
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmitEditNote)}
                  className='flex flex-col gap-4 py-4'
                >
                  <FormField
                    control={form.control}
                    name='title'
                    render={({ field }) => (
                      <FormItem>
                        <div className='items-start flex flex-col gap-2'>
                          <Label htmlFor='title' className='text-right'>
                            Title
                          </Label>
                          <Input
                            id='title'
                            className='col-span-3'
                            placeholder='Your new note title'
                            maxLength={25}
                            {...field}
                          />
                          <FormMessage />
                        </div>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name='tag'
                    render={({ field }) => {
                      return (
                        <FormItem>
                          <div className='items-start flex flex-col gap-2'>
                            <Label htmlFor='tag' className='text-right'>
                              Tag
                            </Label>
                            <Select
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder='Tag' />
                              </SelectTrigger>
                              <SelectContent>
                                {tags.map((tag) => (
                                  <SelectItem key={tag._id} value={tag.code}>
                                    {tag.label}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </div>
                        </FormItem>
                      );
                    }}
                  />

                  <FormField
                    control={form.control}
                    name='content'
                    render={({ field }) => (
                      <div className='items-start flex flex-col gap-2'>
                        <Label htmlFor='username' className='text-right'>
                          Note content
                        </Label>
                        <Textarea
                          id='Your new note content'
                          placeholder='Type your message here.'
                          className='col-span-3'
                          rows={10}
                          maxLength={500}
                          {...field}
                        />
                        <FormDescription className='self-end'>
                          {contentLength}/500
                        </FormDescription>
                        <FormMessage />
                      </div>
                    )}
                  />

                  <DialogFooter className='flex'>
                    <div className='flex items-center gap-2 mr-auto'>
                      <Clock className='w-4 h-4' />

                      <p className=''>{formatTimeAgo(timestamp)}</p>
                    </div>
                    <div>
                      <Button type='submit'>Save</Button>
                    </div>
                  </DialogFooter>
                </form>
              </Form>
            </>
          ) : (
            <>
              <DialogHeader>
                <DialogTitle>{note.title}</DialogTitle>
                <DialogDescription className='text-sm'>
                  {moment.unix(timestamp).format('ddd, DD MMMM YYYY')}
                </DialogDescription>
                <div>
                  <Badge className={getBadgeClasses(note.tag.color)}>
                    {note.tag.label}
                  </Badge>
                </div>
              </DialogHeader>
              <p className=''>{note.content}</p>
            </>
          )}

          {!isEditMode ? (
            <DialogFooter className='flex'>
              <div className='flex items-center gap-2 mr-auto'>
                <Clock className='w-4 h-4' />

                <p className=''>{formatTimeAgo(timestamp)}</p>
              </div>
              <div className='flex gap-4'>
                <Button
                  variant={'destructive'}
                  onClick={() => {
                    onClickDelete(note._id);
                  }}
                  size={'sm'}
                >
                  Delete
                </Button>
                <Button
                  onClick={() => {
                    onClickEdit();
                  }}
                  size={'sm'}
                >
                  Edit
                </Button>
              </div>
            </DialogFooter>
          ) : null}

          <DialogClose asChild>
            <div
              ref={closeDialogRef}
              id='close-dialog'
              onClick={() => {
                setIsDialogOpen(false);
              }}
            />
          </DialogClose>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ViewNote;

const noteClassMap: Record<string, string> = {
  red: 'bg-red-50 text-red-800 border-red-300',
  yellow: 'bg-yellow-50 text-yellow-800 border-yellow-300',
  green: 'bg-green-50 text-green-800 border-green-300',
  blue: 'bg-blue-50 text-blue-800 border-blue-300',
};

const getNoteCardClasses = (color: string, isEditMode: boolean) => {
  if (!isEditMode) return noteClassMap[color] ?? '';

  const gradients: Record<string, string> = {
    red: 'bg-[linear-gradient(0deg,_rgba(255,255,255,1)60%,_rgba(252,202,202,1)95%)]',
    yellow:
      'bg-[linear-gradient(0deg,_rgba(255,255,255,1)60%,_rgba(254,240,138,1)95%)]',
    green:
      'bg-[linear-gradient(0deg,_rgba(255,255,255,1)60%,_rgba(187,247,208,1)95%)]',
    blue: 'bg-[linear-gradient(0deg,_rgba(255,255,255,1)60%,_rgba(191,291,254,1)95%)]',
  };

  return gradients[color] ?? '';
};

const getBadgeClasses = (color: string) => `bg-${color}-200 text-${color}-800`;
