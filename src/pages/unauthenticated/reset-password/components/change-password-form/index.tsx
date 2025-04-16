import { useForm } from 'react-hook-form';
import {
  changePasswordFormSchema,
  TypeChangePasswordFormSchema,
} from './schema';
import { zodResolver } from '@hookform/resolvers/zod';

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useResetPassword } from '@/services/authentication';
import { toast } from 'sonner';
import { getAxiosError } from '@/utils/error';
import { useNavigate } from 'react-router-dom';

interface IChangePasswordFormProps {
  email: string;
  token: string;
}

const ChangePasswordForm = (props: IChangePasswordFormProps) => {
  const { email, token } = props;

  const navigate = useNavigate();
  const resetPassword = useResetPassword();

  const form = useForm<TypeChangePasswordFormSchema>({
    resolver: zodResolver(changePasswordFormSchema),
    defaultValues: {
      password: '',
      confirmPassword: '',
    },
  });

  const onClickChangePassword = async (
    values: TypeChangePasswordFormSchema
  ) => {
    const payload = {
      newPassword: values.password,
      email,
      token,
    };

    resetPassword.mutateAsync(payload, {
      onSuccess: (result) => {
        toast.success(result.data.message, {
          onAutoClose: () => {
            navigate('/auth/sign-in', { replace: true });
          },
        });
        form.reset();
      },
      onError: (error) => {
        const { message } = getAxiosError(error);
        toast.error(message);
      },
      onSettled: () => {},
    });
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onClickChangePassword)}
        className='w-full space-y-4'
      >
        <FormField
          control={form.control}
          name='password'
          render={({ field }) => (
            <FormItem>
              <FormLabel>New Password</FormLabel>
              <FormControl>
                <Input type='password' className='text-sm' {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name='confirmPassword'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Confirm new password</FormLabel>
              <FormControl>
                <Input type='password' className='text-sm' {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button
          type='submit'
          className='w-full'
          disabled={resetPassword.isPending}
        >
          {resetPassword.isPending ? 'Changing password' : 'Change password'}
        </Button>
      </form>
    </Form>
  );
};

export default ChangePasswordForm;
