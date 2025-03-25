import { useForm } from 'react-hook-form';
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
import { signUpSchema, TypeSignUpSchema } from '../schema';
import useAuthenticationQuery from '@/services/authentication';
import { toast } from 'sonner';

const SignUpForm = () => {
  const navigate = useNavigate();
  const { signUpUser } = useAuthenticationQuery();
  const form = useForm<TypeSignUpSchema>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      username: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  });

  const onClickSignUp = async (credentials: TypeSignUpSchema) => {
    signUpUser.mutateAsync(credentials, {
      onSuccess: (data) => {
        toast.success(
          `${data.message}, you'll be redirected to sign in page in a moment.`,
          {
            onAutoClose: () => {
              navigate('/auth/sign-in');
            },
          }
        );
      },
      onError: (data) => {
        toast.error(data.message);

        console.error(data);
      },
    });
  };

  const onClickSignIn = () => {
    navigate('/auth/sign-in');
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onClickSignUp)}
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
          name='email'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder='Email Address' type='email' {...field} />
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
                <Input placeholder='Password' type='password' {...field} />
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
              <FormLabel>Confirm Password</FormLabel>
              <FormControl>
                <Input
                  placeholder='Confirm Password'
                  type='password'
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type='submit' className='w-full'>
          Sign up
        </Button>

        <Separator />

        <Button onClick={onClickSignIn} variant={'outline'} className='w-full'>
          Sign in
        </Button>
      </form>
    </Form>
  );
};

export default SignUpForm;
