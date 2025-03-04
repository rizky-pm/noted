import NoteCard from '@/components/note-card';
import { Button } from '@/components/ui/button';
import { NOTES } from '@/constant';
import CreateNewNoteDialog from './components/create-new-note-dialog';

const DashboardPage = () => {
  return (
    <>
      <section className='p-4'>
        <div className='flex gap-4 mb-4'>
          <CreateNewNoteDialog />
          <Button variant={'outline'}>Filter</Button>
          <Button variant={'outline'}>Sort</Button>
        </div>

        <div className='flex flex-wrap gap-4 items-center justify-center'>
          {NOTES.map((note) => (
            <NoteCard data={note} key={note.id} />
          ))}
        </div>
      </section>
    </>
  );
};

export default DashboardPage;
