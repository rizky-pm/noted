import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { TypographyH4 } from '@/components/ui/typography';
import { useDeleteTagById, useGetAllTag } from '@/services/tag';
import { RootState } from '@/store';
import { storeTagData } from '@/store/tag/tag.slice';
import { PlusIcon, TrashIcon } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'sonner';
import NewTagDialog from './new-tag-dialog';
import { useQueryClient } from '@tanstack/react-query';

const TagsSetting = () => {
  const queryClient = useQueryClient();
  const [isCreateNewTagDialogOpen, setIsCreateNewTagDialogOpen] =
    useState(false);

  const dispatch = useDispatch();
  const tags = useSelector((state: RootState) => state.tag);
  const deleteTagById = useDeleteTagById();
  const { data: tagData, isFetched } = useGetAllTag();

  const onClickDelete = async (tagId: string) => {
    deleteTagById.mutateAsync(tagId, {
      onSuccess: () => {
        toast.success('Tag deleted successfuly');
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
                setIsCreateNewTagDialogOpen(true);
              }}
            >
              <PlusIcon />
            </Button>
          </div>
          <ScrollArea className='max-h-80 flex flex-wrap'>
            {isFetched ? (
              tags.map((tag) => (
                <div
                  key={tag._id}
                  className='first:pt-0 py-2 border-b-[.0625rem] last:border-b-0'
                >
                  <div
                    key={tag._id}
                    className='flex justify-between items-center h-10'
                  >
                    <span>{tag.label}</span>
                    <div className='flex gap-2'>
                      {tag.deletable ? (
                        <Button
                          variant={'destructive'}
                          size={'icon'}
                          onClick={() => {
                            onClickDelete(tag._id);
                          }}
                        >
                          <TrashIcon />
                        </Button>
                      ) : null}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <h1>Loading</h1>
            )}
          </ScrollArea>
        </CardContent>
      </Card>
      <NewTagDialog
        isDialogOpen={isCreateNewTagDialogOpen}
        setIsDialogOpen={setIsCreateNewTagDialogOpen}
      />
    </>
  );
};

export default TagsSetting;
