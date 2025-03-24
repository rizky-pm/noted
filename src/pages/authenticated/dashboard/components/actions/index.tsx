import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { RotateCcw, Search } from 'lucide-react';
import { searchSchema, TypeSearchSchema } from './schema';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { useDispatch, useSelector } from 'react-redux';
import { applyFilter } from './actions.slice';
import { RootState } from '@/store';

import SortDrawer from '../sort-drawer';
import FilterDrawer from '../filter-drawer';
import CreateNewNoteDialog from '../create-new-note-dialog';

const Actions = () => {
  const filter = useSelector((state: RootState) => state.filter);
  const dispatch = useDispatch();

  const form = useForm<TypeSearchSchema>({
    resolver: zodResolver(searchSchema),
    defaultValues: {
      searchTerm: '',
    },
  });

  const onSearch = (values: TypeSearchSchema) => {
    dispatch(applyFilter({ ...filter, title: values.searchTerm }));
  };

  const onResetFilter = () => {
    form.reset();
    dispatch(applyFilter({ title: null, tag: [] }));
  };

  return (
    <div className='flex gap-2'>
      <Form {...form}>
        <form className='flex gap-2' onSubmit={form.handleSubmit(onSearch)}>
          <FormField
            control={form.control}
            name='searchTerm'
            render={({ field }) => (
              <FormItem>
                <Input
                  className='w-80'
                  placeholder='Search by title'
                  {...field}
                />
                <FormMessage />
              </FormItem>
            )}
          />
          <Button variant={'outline'} size={'icon'}>
            <Search />
          </Button>
        </form>
      </Form>

      <SortDrawer />
      <FilterDrawer />

      <Button variant={'destructive'} onClick={onResetFilter}>
        <RotateCcw /> Reset filters
      </Button>

      <div className='ml-auto'>
        <CreateNewNoteDialog />
      </div>
    </div>
  );
};

export default Actions;
