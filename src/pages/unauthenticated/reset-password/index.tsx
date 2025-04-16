import LoadingScreen from '@/components/loading-screen';
import { TypographyH2, TypographyLead } from '@/components/ui/typography';
import { useValidateResetPasswordSession } from '@/services/authentication';
import _ from 'lodash';
import { useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import ChangePasswordForm from './components/change-password-form';
import { cn } from '@/lib/utils';
import { useBreakpoints } from '@/hooks';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

const ResetPasswordPage = () => {
  const navigate = useNavigate();
  const { search } = useLocation();
  const { isMediumScreen } = useBreakpoints();

  const extractedData = useMemo(() => {
    const urlParams = new URLSearchParams(search);
    const queryObject = Object.fromEntries(urlParams);

    const token = _.get(queryObject, 'token');
    const email = _.get(queryObject, 'email');

    return { token, email };
  }, [search]);

  const { data, isPending } = useValidateResetPasswordSession({
    token: extractedData.token,
    email: extractedData.email,
  });

  if (isPending) {
    return <LoadingScreen />;
  }

  if (data?.code !== 200) {
    navigate('/auth/sign-in', { replace: true });
  }

  const onClickBackToSignIn = () => {
    navigate('/auth/sign-in', { replace: true });
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
          <TypographyH2>Change Your Password</TypographyH2>
          <TypographyLead className='text-sm'>
            For your security, please enter a new password below. Make sure it’s
            strong and unique to protect your account.
          </TypographyLead>
        </div>

        <ChangePasswordForm
          email={extractedData.email}
          token={extractedData.token}
        />

        <Button variant={'ghost'} onClick={onClickBackToSignIn}>
          <ArrowLeft /> Back to sign in
        </Button>
      </div>
    </section>
  );
};

export default ResetPasswordPage;
