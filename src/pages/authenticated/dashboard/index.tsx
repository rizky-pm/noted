import { useGetAllNotes } from '@/services/note';
import ViewNote from './components/view-note';
import useTagService from '@/services/tag';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { storeTagData } from './state';
import Actions from './components/actions';
import { RootState } from '@/store';

const DashboardPage = () => {
  const filters = useSelector((state: RootState) => state.filters);
  const getAllNotes = useGetAllNotes(filters);
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
    <section className='flex flex-col gap-2 p-4'>
      <Actions />
      <div
        className={`w-full flex flex-wrap gap-4 justify-center ${
          notesData?.notes.length ? '' : ' h-[calc(100vh-6rem)]'
        }`}
      >
        {getNotesIsLoading ? (
          <div>
            <h1>Loading data ...</h1>
          </div>
        ) : notesData?.notes.length ? (
          notesData?.notes.map((note) => {
            return <ViewNote {...note} key={note._id} />;
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
  );
};

export default DashboardPage;
