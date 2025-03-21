import { Button } from '@/components/ui/button';
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@/components/ui/drawer';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from '@/components/ui/form';
import { ArrowRightLeft } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { filtersSchema, TypeFiltersSchema } from './schema';
import { zodResolver } from '@hookform/resolvers/zod';

const SortDrawer = () => {
  const form = useForm<TypeFiltersSchema>({
    resolver: zodResolver(filtersSchema),
    defaultValues: {
      sortBy: 'a-to-z',
    },
  });

  const handleApplyFilter = (data: TypeFiltersSchema) => {
    console.log(data);
  };

  return (
    <div className='self-start'>
      <Drawer>
        <DrawerTrigger asChild>
          <Button variant={'outline'} size={'icon'}>
            <ArrowRightLeft className='rotate-90' />
          </Button>
        </DrawerTrigger>
        <DrawerContent className='flex justify-center items-center pb-8'>
          <div className='max-w-screen-lg w-full px-0 '>
            <DrawerHeader className='max-w-screen-lg w-full px-0'>
              <DrawerTitle>Sort By</DrawerTitle>
              <DrawerDescription>Set your preference</DrawerDescription>
            </DrawerHeader>

            <Form {...form}>
              <form onSubmit={form.handleSubmit(handleApplyFilter)}>
                <FormField
                  control={form.control}
                  name='sortBy'
                  render={({ field }) => (
                    <FormItem className='space-y-3'>
                      <FormControl>
                        <RadioGroup
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          className='flex gap-10'
                        >
                          <FormItem className='flex items-center space-x-3 space-y-0'>
                            <FormControl>
                              <RadioGroupItem value='a-to-z' />
                            </FormControl>
                            <FormLabel className='font-normal'>
                              A to Z
                            </FormLabel>
                          </FormItem>

                          <FormItem className='flex items-center space-x-3 space-y-0'>
                            <FormControl>
                              <RadioGroupItem value='z-to-a' />
                            </FormControl>
                            <FormLabel className='font-normal'>
                              Z to A
                            </FormLabel>
                          </FormItem>

                          <FormItem className='flex items-center space-x-3 space-y-0'>
                            <FormControl>
                              <RadioGroupItem value='latest' />
                            </FormControl>
                            <FormLabel className='font-normal'>
                              Latest
                            </FormLabel>
                          </FormItem>

                          <FormItem className='flex items-center space-x-3 space-y-0'>
                            <FormControl>
                              <RadioGroupItem value='Oldest' />
                            </FormControl>
                            <FormLabel className='font-normal'>
                              Oldest
                            </FormLabel>
                          </FormItem>
                        </RadioGroup>
                      </FormControl>
                    </FormItem>
                  )}
                />
              </form>
            </Form>
          </div>
        </DrawerContent>
      </Drawer>
    </div>
  );
};

export default SortDrawer;
