import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { changePasswordSchema, TypeChangePasswordSchema } from './schema';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { TypographyH4 } from '@/components/ui/typography';

const ChangePassword = () => {
  const form = useForm<TypeChangePasswordSchema>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: {
      oldPassword: '',
      newPassword: '',
      confirmNewPassword: '',
    },
  });

  const handleClickChangePassword = (values: TypeChangePasswordSchema) => {
    console.log(values);
  };

  return (
    <Card className='p-4 mt-4'>
      <CardContent className='p-0 flex flex-col gap-4'>
        <TypographyH4>Password</TypographyH4>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleClickChangePassword)}
            className='flex flex-col gap-4'
          >
            <FormField
              control={form.control}
              name='oldPassword'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Old password</FormLabel>
                  <FormControl>
                    <Input type='password' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='newPassword'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>New password</FormLabel>
                  <FormControl>
                    <Input type='password' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='confirmNewPassword'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Confirm new password</FormLabel>
                  <FormLabel>
                    <Input type='password' {...field} />
                  </FormLabel>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type='submit'>Save </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default ChangePassword;
