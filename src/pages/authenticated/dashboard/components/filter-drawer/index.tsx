import { Button } from '@/components/ui/button';
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@/components/ui/drawer';
import { RootState } from '@/store';
import _ from 'lodash';
import { ListFilterPlus } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { applyFilter } from '../actions/actions.slice';

const FilterDrawer = () => {
  const [filter, setFilter] = useState<{ tag: string[] }>({
    tag: [],
  });

  const tags = useSelector((state: RootState) => state.tag);
  const filterState = useSelector((state: RootState) => state.filter);
  const dispatch = useDispatch();

  const onClickTag = (id: string) => {
    const isIdExists = _.includes(filter.tag, id);

    const updatedTags = isIdExists
      ? _.without(filter.tag, id)
      : [...filter.tag, id];

    setFilter((prevFilter) => ({
      ...prevFilter,
      tag: updatedTags,
    }));
  };

  const onClickApply = () => {
    dispatch(applyFilter({ ...filterState, tag: filter.tag }));
  };

  useEffect(() => {
    if (filterState.tag.length) {
      setFilter((prevState) => ({
        ...prevState,
        tag: filterState.tag,
      }));
    }
  }, [filterState]);

  return (
    <div className='self-start'>
      <Drawer>
        <DrawerTrigger asChild>
          <Button variant={'outline'} size={'icon'}>
            <ListFilterPlus />
          </Button>
        </DrawerTrigger>
        <DrawerContent className='flex justify-center items-center pb-8'>
          <div className='max-w-screen-lg w-full px-0 flex flex-col gap-4'>
            <DrawerHeader className='max-w-screen-lg w-full px-0'>
              <DrawerTitle>Filter</DrawerTitle>
              <DrawerDescription>Set your preference</DrawerDescription>
            </DrawerHeader>

            <span className='font-medium'>Tag</span>

            <div className='flex flex-wrap gap-4'>
              {tags.length
                ? tags.map((tag) => (
                    <span
                      className={` text-sm rounded px-2 py-1 transition-all cursor-pointer ${
                        _.includes(filter.tag, tag._id)
                          ? 'bg-primary text-background'
                          : 'bg-muted text-foreground'
                      }`}
                      key={tag._id}
                      onClick={() => {
                        onClickTag(tag._id);
                      }}
                    >
                      {tag.label}
                    </span>
                  ))
                : null}
            </div>

            <Button size={'sm'} className='self-start' onClick={onClickApply}>
              Apply
            </Button>
          </div>
        </DrawerContent>
      </Drawer>
    </div>
  );
};

export default FilterDrawer;
