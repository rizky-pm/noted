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

import { TAGS } from '@/constant';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { createNewNoteSchema } from '@/schema';
import moment from 'moment';

const CreateNewNoteDialog = () => {
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
      createdAt: moment().unix(),
    };

    console.log(payload);
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
            Lorem ipsum, dolor sit amet consectetur adipisicing elit. Click save
            when you're done.
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
                        {TAGS.map((tag) => (
                          <SelectItem key={tag.id} value={tag.value}>
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
      </DialogContent>
    </Dialog>
  );
};

export default CreateNewNoteDialog;
