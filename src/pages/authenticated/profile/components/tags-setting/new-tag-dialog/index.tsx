import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useForm } from 'react-hook-form';
import { createNewTagSchema, TypeCreateNewTagSchema } from './schema';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import '@rc-component/color-picker/assets/index.css';
import { Badge } from '@/components/ui/badge';
import { useCreateNewTag } from '@/services/tag';
import { toast } from 'sonner';
import { useQueryClient } from '@tanstack/react-query';
import { SetStateAction, useRef } from 'react';

interface IProps {
  isDialogOpen: boolean;
  setIsDialogOpen: React.Dispatch<SetStateAction<boolean>>;
}

const NewTagDialog = (props: IProps) => {
  const { isDialogOpen, setIsDialogOpen } = props;
  const closeDialogRef = useRef<HTMLDivElement | null>(null);

  const query = useQueryClient();

  const form = useForm<TypeCreateNewTagSchema>({
    resolver: zodResolver(createNewTagSchema),
    defaultValues: {
      title: '',
      color: undefined,
    },
  });

  const createNewTag = useCreateNewTag();

  const onSubmitNewTag = (values: TypeCreateNewTagSchema) => {
    console.log(values);

    const payload = { ...values };

    createNewTag.mutateAsync(payload, {
      onSuccess: () => {
        toast.success('Success add new tag');
        query.invalidateQueries({ queryKey: ['tag.get-all'] });

        if (closeDialogRef) {
          closeDialogRef.current?.click();
        }
      },
      onError: (error) => {
        toast.error(error.message);
        console.error(error);
      },
    });
  };

  return (
    <Dialog
      open={isDialogOpen}
      onOpenChange={(current) => {
        form.reset();
        setIsDialogOpen(current);
      }}
    >
      <DialogContent className='sm:max-w-[425px]'>
        <DialogHeader>
          <DialogTitle>Add New Tag</DialogTitle>
          <DialogDescription>
            Create a new tag to organize your notes. Choose a name and color,
            then click save.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmitNewTag)}
            className='flex flex-col gap-4'
          >
            <FormField
              control={form.control}
              name='title'
              render={({ field }) => (
                <FormItem>
                  <Label htmlFor='title' className='text-right'>
                    Title
                  </Label>
                  <Input
                    id='title'
                    {...field}
                    placeholder='Your new tag'
                    className='col-span-3'
                  />
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='color'
              render={({ field }) => (
                <FormItem>
                  <Label htmlFor='color' className='text-right'>
                    Tag Color
                  </Label>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className='flex space-x-2 flex-wrap'
                    >
                      <FormItem className='flex items-center space-x-1 space-y-0'>
                        <FormControl>
                          <RadioGroupItem value='red' />
                        </FormControl>
                        <FormLabel className='font-normal'>
                          <Badge className='bg-red-200 text-red-800 cursor-pointer hover:bg-red-200 hover:text-red-800'>
                            Red
                          </Badge>
                        </FormLabel>
                      </FormItem>

                      <FormItem className='flex items-center space-x-1 space-y-0'>
                        <FormControl>
                          <RadioGroupItem value='yellow' />
                        </FormControl>
                        <FormLabel className='font-normal'>
                          <Badge className='bg-yellow-200 text-yellow-800 cursor-pointer hover:bg-yellow-200 hover:text-yellow-800'>
                            Yellow
                          </Badge>
                        </FormLabel>
                      </FormItem>

                      <FormItem className='flex items-center space-x-1 space-y-0'>
                        <FormControl>
                          <RadioGroupItem value='green' />
                        </FormControl>
                        <FormLabel className='font-normal'>
                          <Badge className='bg-green-200 text-green-800 cursor-pointer hover:bg-green-200 hover:text-green-800'>
                            Green
                          </Badge>
                        </FormLabel>
                      </FormItem>

                      <FormItem className='flex items-center space-x-1 space-y-0'>
                        <FormControl>
                          <RadioGroupItem value='blue' />
                        </FormControl>
                        <FormLabel className='font-normal'>
                          <Badge className='bg-blue-200 text-blue-800 cursor-pointer hover:bg-blue-200 hover:text-blue-800'>
                            Blue
                          </Badge>
                        </FormLabel>
                      </FormItem>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button className='w-full' type='submit' size={'sm'}>
              Add
            </Button>
          </form>
        </Form>
        <DialogClose>
          <div id='close-dialog' ref={closeDialogRef} />
        </DialogClose>
      </DialogContent>
    </Dialog>
  );
};

export default NewTagDialog;
