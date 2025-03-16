import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

import CreateNewNoteDialog from './components/create-new-note-dialog';
import useNoteService from '@/services/note';
import ViewNote from './components/view-note';
import useTagService from '@/services/tag';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { storeTagData } from './state';

const DashboardPage = () => {
  const { getAllNotes } = useNoteService();
  const { getAllTags } = useTagService();
  const dispatch = useDispatch();
  const { data: notesData, isLoading: getNotesIsLoading } = getAllNotes;
  const { data: tagData, isFetched } = getAllTags;

  useEffect(() => {
    if (isFetched && tagData) {
      dispatch(storeTagData(tagData.data));
    }
  }, [isFetched, tagData, dispatch]);

  return (
    <>
      <section className='p-4'>
        <div className='flex gap-4 mb-4'>
          <CreateNewNoteDialog />

          <Dialog>
            <DialogTrigger asChild>
              <Button variant='outline'>Setting</Button>
            </DialogTrigger>
            <DialogContent className='sm:max-w-[425px]'>
              <DialogHeader>
                <DialogTitle>Setting</DialogTitle>
                <DialogDescription>
                  Make changes to your profile here. Click save when you're
                  done.
                </DialogDescription>
              </DialogHeader>
              <div className='grid gap-4 py-4'>
                <p>
                  Lorem ipsum dolor sit amet consectetur, adipisicing elit.
                  Rerum, totam illo autem cumque dicta consectetur explicabo,
                  itaque enim dolore eum velit saepe voluptate maxime dolorem
                  incidunt. Consectetur magni sapiente esse!
                </p>
              </div>
              <DialogFooter>
                <Button type='submit'>Save changes</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        <div
          className={`flex flex-wrap gap-4 ${
            notesData?.notes.length ? '' : 'items-center h-[calc(100vh-6rem)]'
          }`}
        >
          {getNotesIsLoading ? (
            <div>
              <h1>Loading data ...</h1>
            </div>
          ) : notesData?.notes.length ? (
            notesData?.notes.map((note) => {
              return <ViewNote {...note} />;
            })
          ) : (
            <div className='flex justify-center items-center w-full h-full'>
              <p className='text-muted-foreground text-sm'>
                You don't have any note, try add one.
              </p>
            </div>
          )}
        </div>
      </section>
    </>
  );
};

export default DashboardPage;
