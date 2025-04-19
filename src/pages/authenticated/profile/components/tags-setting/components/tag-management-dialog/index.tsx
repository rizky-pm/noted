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
  FormMessage,
} from '@/components/ui/form';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import '@rc-component/color-picker/assets/index.css';
import { useCreateNewTag, useEditTagById } from '@/services/tag';
import { toast } from 'sonner';
import { useQueryClient } from '@tanstack/react-query';
import { SetStateAction, useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';
import { getColorPickerClasses } from '../../helpers';
import _ from 'lodash';
import { useDispatch } from 'react-redux';
import { toggleLoading } from '@/store/global/global.slice';
import { Separator } from '@/components/ui/separator';
import { ITagsSettingState } from '../../type';

interface IProps {
  initialState: ITagsSettingState;
  tagsSettingState: ITagsSettingState;
  setTagsSettingState: React.Dispatch<SetStateAction<ITagsSettingState>>;
}

const colorOptions = ['red', 'yellow', 'green', 'blue', 'purple', 'gray'];

const TagManagementDialog = (props: IProps) => {
  const { tagsSettingState, setTagsSettingState, initialState } = props;
  const { selectedTag } = tagsSettingState;

  const closeDialogRef = useRef<HTMLDivElement | null>(null);
  const dispatch = useDispatch();

  const query = useQueryClient();

  const form = useForm<TypeCreateNewTagSchema>({
    resolver: zodResolver(createNewTagSchema),
    defaultValues: {
      name: undefined,
      color: undefined,
    },
  });

  const createNewTag = useCreateNewTag();
  const editTagById = useEditTagById();

  const onSubmitNewTag = (values: TypeCreateNewTagSchema) => {
    const payload = {
      ...values,
    };

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

  const onSubmitEditTag = (values: TypeCreateNewTagSchema) => {
    if (tagsSettingState.dialog.id !== 'edit-tag') return;
    if (!selectedTag) return;

    const payload = {
      tagId: selectedTag._id,
      name:
        _.lowerCase(values.name) !== _.lowerCase(selectedTag?.label)
          ? values.name
          : undefined,
      color: values.color !== selectedTag?.color ? values.color : undefined,
    };

    dispatch(toggleLoading(true));

    editTagById.mutateAsync(payload, {
      onSuccess: (response) => {
        toast.success(response.data.message);
        query.invalidateQueries({ queryKey: ['tag.get-all'] });

        if (closeDialogRef) {
          closeDialogRef.current?.click();
        }
      },
      onError: (error) => {
        toast.error(error.message);
        console.error(error);
      },
      onSettled: () => {
        dispatch(toggleLoading(false));
      },
    });
  };

  useEffect(() => {
    if (selectedTag) {
      form.setValue('name', selectedTag.label);
      form.setValue('color', selectedTag.color);
    }
  }, [selectedTag, form]);

  return (
    <Dialog
      open={tagsSettingState.dialog.isOpen}
      onOpenChange={(isOpen) => {
        form.reset();

        if (!isOpen) {
          // * Partially keep dialog.id because to avoid unmount effect of delete button, to close the dialog first
          setTagsSettingState(() => ({
            ...tagsSettingState,
            dialog: {
              ...initialState.dialog,
              id: initialState.dialog.id === 'new-tag' ? 'new-tag' : 'edit-tag',
            },
          }));

          // * After 500ms or dialog completely unmounted or closed, back tagSettingState to the initialState
          setTimeout(() => {
            setTagsSettingState(initialState);
          }, 500);
        }
      }}
    >
      <DialogContent className='sm:max-w-[425px]'>
        <DialogHeader>
          <DialogTitle>{selectedTag ? 'Edit Tag' : 'Create Tag'}</DialogTitle>
          <DialogDescription>
            {selectedTag
              ? 'Update the tag name or color and click save.'
              : 'Choose a name and color to create a new tag.'}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={
              selectedTag
                ? form.handleSubmit(onSubmitEditTag)
                : form.handleSubmit(onSubmitNewTag)
            }
            className='flex flex-col gap-4'
          >
            <FormField
              control={form.control}
              name='name'
              render={({ field }) => (
                <FormItem>
                  <Label htmlFor='name' className='text-right'>
                    Title
                  </Label>
                  <Input
                    id='name'
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
                      {colorOptions.map((option) => (
                        <FormItem
                          className='flex items-center space-x-1 space-y-0'
                          key={option}
                        >
                          <FormControl>
                            <RadioGroupItem
                              value={option}
                              colorPicker={true}
                              className={cn(getColorPickerClasses(option))}
                            />
                          </FormControl>
                        </FormItem>
                      ))}
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button className='w-full' type='submit' size={'sm'}>
              {tagsSettingState.dialog.id === 'edit-tag' ? 'Save' : 'Add'}
            </Button>
            {tagsSettingState.dialog.id === 'edit-tag' ? (
              <>
                <Separator />
                <Button
                  className='w-full'
                  variant={'destructive'}
                  size={'sm'}
                  onClick={() => {
                    setTagsSettingState(() => ({
                      ...initialState,
                      alert: {
                        id: 'delete-tag',
                        isOpen: true,
                      },
                      selectedTag: selectedTag,
                    }));
                  }}
                >
                  Delete
                </Button>
              </>
            ) : null}
          </form>
        </Form>
        <DialogClose>
          <div id='close-dialog' ref={closeDialogRef} />
        </DialogClose>
      </DialogContent>
    </Dialog>
  );
};

export default TagManagementDialog;
