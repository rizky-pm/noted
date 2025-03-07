import { useForm } from 'react-hook-form';
import { signInSchema, TypeSignInSchema } from '../schema';
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
import { Separator } from '@/components/ui/separator';
import { TypographyH2, TypographyP } from '@/components/ui/typography';
import { useNavigate } from 'react-router-dom';
import useAuthenticationQuery from '@/services/authentication';
import { useDispatch } from 'react-redux';
import { signIn } from '@/features/auth/auth.slice';

const SignInForm = () => {
  const { signInUser } = useAuthenticationQuery();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const form = useForm<TypeSignInSchema>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      username: 'cosmo',
      password: 'cosmo666',
    },
  });

  const onClickSignIn = async (values: TypeSignInSchema) => {
    const payload = values;
    signInUser.mutate(payload, {
      onSuccess: (data) => {
        dispatch(signIn(data));
        navigate('/');
      },
      onError: (error) => {
        console.error(
          'Login failed',
          error.response?.data.message || 'Unknown error'
        );
      },
    });
  };

  const onClickSignUp = () => {
    navigate('/auth/sign-up');
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onClickSignIn)}
        className='w-3/5 space-y-4'
      >
        <div>
          <TypographyH2 className='text-primary'>Sign In!</TypographyH2>
          <TypographyP>
            Welcome back! Your ideas are waiting for you.
          </TypographyP>
        </div>
        <FormField
          control={form.control}
          name='username'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Username</FormLabel>
              <FormControl>
                <Input placeholder='Username' {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='password'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input placeholder='Password' {...field} type='password' />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type='submit' className='w-full'>
          Sign in
        </Button>

        <Separator />

        <Button onClick={onClickSignUp} variant={'outline'} className='w-full'>
          Sign up
        </Button>
      </form>
    </Form>
  );
};

export default SignInForm;
