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

import FilterDrawer from '../filter-drawer';
import CreateNewNoteDialog from '../create-new-note-dialog';
import { useBreakpoints } from '@/hooks';

const Actions = () => {
  const filter = useSelector((state: RootState) => state.filter);
  const dispatch = useDispatch();
  const { isMediumScreen } = useBreakpoints();

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
    <div className='flex w-full flex-wrap gap-y-2 md:gap-y-0 gap-2'>
      <Form {...form}>
        <form
          className='flex justify-between w-full md:w-auto md:gap-2'
          onSubmit={form.handleSubmit(onSearch)}
        >
          <FormField
            control={form.control}
            name='searchTerm'
            render={({ field }) => (
              <FormItem className='w-full'>
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

      <FilterDrawer />

      <Button
        variant={'destructive'}
        size={isMediumScreen ? 'default' : 'icon'}
        onClick={onResetFilter}
      >
        <RotateCcw /> {isMediumScreen ? 'Reset filters' : ''}
      </Button>

      <div className='md:ml-auto'>
        <CreateNewNoteDialog />
      </div>
    </div>
  );
};

export default Actions;
