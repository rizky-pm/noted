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

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { createNewNoteSchema } from '@/schema';
import { toast } from 'sonner';
import { useQueryClient } from '@tanstack/react-query';
import { DialogClose } from '@radix-ui/react-dialog';
import { useRef } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';
import { useCreateNote } from '@/services/note';

const CreateNewNoteDialog = () => {
  const createNewNote = useCreateNote();
  const query = useQueryClient();
  const tags = useSelector((state: RootState) => state.dashboard.tags);
  const closeDialogRef = useRef<HTMLDivElement | null>(null);

  const form = useForm<z.infer<typeof createNewNoteSchema>>({
    resolver: zodResolver(createNewNoteSchema),
    defaultValues: {
      title: '',
      tag: '',
      content: '',
    },
  });

  const onSubmitNewNote = (values: z.infer<typeof createNewNoteSchema>) => {
    const payload = {
      ...values,
    };

    createNewNote.mutateAsync(payload, {
      onSuccess: () => {
        toast.success('Success create new note');
        query.invalidateQueries({ queryKey: ['note.get-all'] });

        if (closeDialogRef) {
          closeDialogRef.current?.click();
        }
      },
      onError: (error) => {
        console.log(error);
      },
    });
  };

  const contentLength = form.watch('content').length;

  return (
    <Dialog
      onOpenChange={() => {
        form.reset();
      }}
    >
      <DialogTrigger asChild>
        <Button>Take a Note</Button>
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
            onSubmit={form.handleSubmit(onSubmitNewNote)}
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
              render={({ field }) => (
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
              )}
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
            <Button className='self-end' type='submit'>
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
