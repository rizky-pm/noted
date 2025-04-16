import { useForm } from 'react-hook-form';
import { sendEmailFormSchema, TypeSendEmailFormSchema } from './schema';
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
import { useRequestToResetPassword } from '@/services/authentication';
import { useDispatch } from 'react-redux';
import { toggleLoading } from '@/store/global/global.slice';
import { toast } from 'sonner';
import { getAxiosError } from '@/utils/error';

const SendEmailForm = () => {
  const dispatch = useDispatch();
  const form = useForm<TypeSendEmailFormSchema>({
    resolver: zodResolver(sendEmailFormSchema),
    defaultValues: {
      email: '',
    },
  });

  const requestToResetPassword = useRequestToResetPassword();

  const onClickResetPassword = async (payload: TypeSendEmailFormSchema) => {
    dispatch(toggleLoading(true));

    requestToResetPassword.mutateAsync(payload, {
      onSuccess: (result) => {
        toast.success(result.data.message);
        form.reset();
      },
      onError: (error) => {
        const { message } = getAxiosError(error);
        toast.error(message);
      },
      onSettled: () => {
        dispatch(toggleLoading(false));
      },
    });
  };

  return (
    <>
      {requestToResetPassword.isSuccess ? (
        <p
          className={
            'text-sm p-4 bg-green-200 rounded-md text-green-800 text-center'
          }
        >
          A link to reset your password has been sent to your email address.
          Please check your inbox to continue
        </p>
      ) : null}

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onClickResetPassword)}
          className='w-full space-y-4'
        >
          <FormField
            control={form.control}
            name='email'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email address</FormLabel>
                <FormControl>
                  <Input
                    placeholder='johndoe@email.com'
                    type='email'
                    className='text-sm'
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button
            type='submit'
            className='w-full'
            disabled={requestToResetPassword.isPending}
          >
            Reset password
          </Button>
        </form>
      </Form>
    </>
  );
};

export default SendEmailForm;
