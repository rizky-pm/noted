import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useDeleteNote, useEditNote } from '@/services/note';
import { RootState } from '@/store';
import { INote } from '@/type';
import { useQueryClient } from '@tanstack/react-query';
import { useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import NoteCard from '@/components/note-card';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { createNewNoteSchema } from '@/schema';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import {
  Form,
  FormDescription,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Clock } from 'lucide-react';
import { formatTimeAgo } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { DialogDescription } from '@radix-ui/react-dialog';
import moment from 'moment';
import { useDraggable } from '@dnd-kit/core';

const ViewNote = (note: INote) => {
  const [isEditMode, setIsEditMode] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { setNodeRef, transform } = useDraggable({
    id: note._id,
  });

  const tags = useSelector((state: RootState) => state.tag);
  const query = useQueryClient();
  const deleteNote = useDeleteNote();
  const editNote = useEditNote();
  const timestamp = note.updatedAt ? note.updatedAt : note.createdAt;
  const form = useForm<z.infer<typeof createNewNoteSchema>>({
    resolver: zodResolver(createNewNoteSchema),
    defaultValues: {
      title: note.title,
      tag: note.tag.code,
      content: note.content,
    },
  });

  const contentLength = form.watch('content').length;
  const closeDialogRef = useRef<HTMLDivElement | null>(null);

  const style = {
    transform: transform
      ? `translate3d(${transform.x}px, ${transform.y}px, 0)`
      : undefined,
  };

  const onClickEdit = () => {
    setIsEditMode((prevState) => !prevState);
  };

  const onClickDelete = (noteId: string) => {
    deleteNote.mutateAsync(noteId, {
      onSuccess: () => {
        toast.success('Success delete note');
        query.invalidateQueries({ queryKey: ['note.get-all'] });
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
        query.invalidateQueries({ queryKey: ['note.get-all'] });
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

  return (
    <div
      ref={setNodeRef}
      style={style}
      onClick={() => {
        setIsDialogOpen(true);
      }}
    >
      <NoteCard data={note} key={note._id} />
      <Dialog
        open={isDialogOpen}
        onOpenChange={(current) => {
          if (!current) {
            setIsEditMode(false);
          }
        }}
      >
        <DialogContent className='max-w-[37.5rem]'>
          {isEditMode ? (
            <>
              <DialogHeader>
                <DialogTitle>Edit note</DialogTitle>
                <DialogDescription className='text-muted-foreground text-sm'>
                  {moment.unix(timestamp).format('ddd, DD MMMM YYYY')}
                </DialogDescription>
              </DialogHeader>
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmitEditNote)}
                  className='flex flex-col gap-4 py-4'
                >
                  <>
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
                  </>

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
                <DialogDescription className='text-muted-foreground text-sm'>
                  {moment.unix(timestamp).format('ddd, DD MMMM YYYY')}
                </DialogDescription>
                <div>
                  <Badge>{note.tag.label}</Badge>
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
    </div>
  );
};

export default ViewNote;
