import { cn } from '@/lib/utils';
import { useBreakpoints } from '@/hooks';
import SendEmailForm from './components/send-email-form';
import { TypographyH2, TypographyLead } from '@/components/ui/typography';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Lock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const ForgetPasswordPage = () => {
  const navigate = useNavigate();
  const { isMediumScreen } = useBreakpoints();

  const onClickBackToSignIn = () => {
    navigate('/auth/sign-in');
  };

  return (
    <section className='flex flex-col justify-center items-center'>
      <div
        className={cn(
          'w-1/2 h-[calc(100vh-2rem)] rounded-lg flex flex-col justify-center items-center px-10 space-y-4',
          {
            'w-full': !isMediumScreen,
          }
        )}
      >
        <div className='text-center space-y-2 flex flex-col items-center'>
          <Lock className='w-10 h-10' />
          <TypographyH2>Forgot your password?</TypographyH2>
          <TypographyLead className='text-sm'>
            Enter your registered email address & we'll send you a link to reset
            your password.
          </TypographyLead>
        </div>
        <SendEmailForm />
        <Button variant={'ghost'} onClick={onClickBackToSignIn}>
          <ArrowLeft /> Back to sign in
        </Button>
      </div>
    </section>
  );
};

export default ForgetPasswordPage;
