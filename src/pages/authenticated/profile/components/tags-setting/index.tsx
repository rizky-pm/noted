import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { TypographyH4 } from '@/components/ui/typography';
import { useDeleteTagById, useGetAllTag } from '@/services/tag';
import { RootState } from '@/store';
import { storeTagData } from '@/store/tag/tag.slice';
import { CircleAlert, Ellipsis, PlusIcon } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'sonner';
import TagManagementDialog from './components/tag-management-dialog';
import { useQueryClient } from '@tanstack/react-query';

import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { cn } from '@/lib/utils';
import { getColorPickerClasses } from './helpers';
import { ITag } from '@/types/tag.type';
import { ITagsSettingState } from './type';

const initialState: ITagsSettingState = {
  dialog: {
    id: null,
    isOpen: false,
  },
  alert: {
    id: null,
    isOpen: false,
  },
  selectedTag: null,
};

const TagsSetting = () => {
  const [tagsSettingState, setTagsSettingState] =
    useState<ITagsSettingState>(initialState);

  const queryClient = useQueryClient();
  const dispatch = useDispatch();
  const tags = useSelector((state: RootState) => state.tag);
  const deleteTagById = useDeleteTagById();
  const { data: tagData, isFetched } = useGetAllTag();

  const onClickTag = (tag: ITag) => {
    setTagsSettingState(() => ({
      ...initialState,
      dialog: {
        id: 'edit-tag',
        isOpen: true,
      },
      selectedTag: tag,
    }));
  };

  const onClickConfirmDelete = async (tagId: string) => {
    deleteTagById.mutateAsync(tagId, {
      onSuccess: () => {
        toast.success('Tag deleted successfuly');
        setTagsSettingState(initialState);
        queryClient.invalidateQueries({ queryKey: ['tag.get-all'] });
      },
      onError: (error) => {
        console.error(error);
        toast.error('Failed delete tag');
      },
    });
  };

  useEffect(() => {
    if (isFetched && tagData) {
      dispatch(storeTagData(tagData.data));
    }
  }, [isFetched, tagData, dispatch]);

  return (
    <>
      <Card className='p-4 mt-4'>
        <CardContent className='p-0 flex flex-col gap-4'>
          <div className='flex justify-between'>
            <TypographyH4>Tags</TypographyH4>
            <Button
              size={'icon'}
              onClick={() => {
                setTagsSettingState(() => ({
                  ...initialState,
                  dialog: {
                    id: 'new-tag',
                    isOpen: true,
                    selectedTag: null,
                  },
                }));
              }}
            >
              <PlusIcon />
            </Button>
          </div>
          {isFetched ? (
            <ScrollArea className='h-[300px]'>
              {tags.map((tag) => (
                <div
                  className='flex items-center gap-2 mt-4 py-1 px-2 h-12'
                  key={tag._id}
                >
                  <div
                    className={cn(
                      'w-5 h-5 border-2 rounded-full',
                      getColorPickerClasses(tag.color)
                    )}
                  />
                  <span>{tag.label}</span>
                  {tag.deletable ? (
                    <Button
                      onClick={() => {
                        onClickTag(tag);
                      }}
                      className='ml-auto'
                      size={'icon'}
                      variant={'ghost'}
                    >
                      <Ellipsis />
                    </Button>
                  ) : null}
                </div>
              ))}
            </ScrollArea>
          ) : (
            <h1>Loading</h1>
          )}
        </CardContent>
      </Card>
      <TagManagementDialog
        initialState={initialState}
        tagsSettingState={tagsSettingState}
        setTagsSettingState={setTagsSettingState}
      />

      <AlertDialog
        open={tagsSettingState.alert.isOpen}
        onOpenChange={(isOpen) => {
          if (!isOpen) {
            setTagsSettingState(initialState);
          }
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <CircleAlert className='w-12 h-12 text-red-800 bg-red-200 rounded-full p-2' />
            <AlertDialogTitle>
              Are you sure you want to delete "
              {tagsSettingState.selectedTag?.label}" tag?
            </AlertDialogTitle>
            <AlertDialogDescription>
              All notes using
              <span className='font-bold'>
                "{tagsSettingState.selectedTag?.label}"
              </span>{' '}
              tag will be deleted. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <Button
              variant={'destructive'}
              onClick={() => {
                if (tagsSettingState.selectedTag) {
                  onClickConfirmDelete(tagsSettingState.selectedTag._id);
                }
              }}
            >
              Delete
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default TagsSetting;
