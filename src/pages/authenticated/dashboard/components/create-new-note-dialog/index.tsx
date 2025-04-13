import { useRef } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useDispatch, useSelector } from 'react-redux';
import { useQueryClient } from '@tanstack/react-query';

import { toast } from 'sonner';
import { SquarePen } from 'lucide-react';
import { DialogClose } from '@radix-ui/react-dialog';

import { useBreakpoints } from '@/hooks';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Form,
  FormDescription,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form';

import { createNewNoteSchema, TypeCreateNewNoteSchema } from '@/schema';

import { RootState } from '@/store';
import { toggleLoading } from '@/store/global/global.slice';

import { useCreateNote } from '@/services/note';

const CreateNewNoteDialog = () => {
  const dispatch = useDispatch();
  const queryClient = useQueryClient();
  const createNote = useCreateNote();

  const closeDialogRef = useRef<HTMLDivElement | null>(null);

  const tags = useSelector((state: RootState) => state.tag);
  const notePosition = useSelector(
    (state: RootState) => state.dashboard.note.position
  );
  const { isMediumScreen } = useBreakpoints();

  const form = useForm<TypeCreateNewNoteSchema>({
    resolver: zodResolver(createNewNoteSchema),
    defaultValues: {
      title: '',
      tag: '',
      content: '',
    },
  });

  const contentLength = form.watch('content').length;

  const onSubmit = (values: TypeCreateNewNoteSchema) => {
    const payload = {
      ...values,
      position: {
        x: notePosition.x,
        y: notePosition.y,
      },
    };

    dispatch(toggleLoading(true));

    createNote.mutateAsync(payload, {
      onSuccess: () => {
        toast.success('Success create new note');
        queryClient.invalidateQueries({ queryKey: ['note.get-all'] });
        closeDialogRef.current?.click();
      },
      onError: (err) => {
        console.error(err);
      },
      onSettled: () => {
        dispatch(toggleLoading(false));
      },
    });
  };

  return (
    <Dialog
      onOpenChange={() => {
        form.reset();
      }}
    >
      <DialogTrigger asChild>
        <Button size={isMediumScreen ? 'default' : 'icon'}>
          <SquarePen /> {isMediumScreen ? 'Take a Note' : ''}
        </Button>
      </DialogTrigger>

      <DialogContent className='max-w-[37.5rem]'>
        <DialogHeader>
          <DialogTitle>Take a Note</DialogTitle>
          <DialogDescription>
            Quick, simple, and always accessible. What’s on your mind?
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className='flex flex-col gap-4 py-4'
          >
            <FormField
              control={form.control}
              name='title'
              render={({ field }) => (
                <FormItem>
                  <div className='flex flex-col gap-2 items-start'>
                    <Label htmlFor='title'>Title</Label>
                    <Input
                      id='title'
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
              render={({ field }) => (
                <FormItem>
                  <div className='flex flex-col gap-2 items-start'>
                    <Label htmlFor='tag'>Tag</Label>
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
              )}
            />

            <FormField
              control={form.control}
              name='content'
              render={({ field }) => (
                <div className='flex flex-col gap-2 items-start'>
                  <Label htmlFor='content'>Note content</Label>
                  <Textarea
                    id='content'
                    placeholder='Type your message here.'
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

            <Button type='submit' className='self-end'>
              Stick It
            </Button>
          </form>
        </Form>

        <DialogClose asChild>
          <div ref={closeDialogRef} id='close-dialog' />
        </DialogClose>
      </DialogContent>
    </Dialog>
  );
};

export default CreateNewNoteDialog;
