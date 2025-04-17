import { TypographyH1, TypographyH3 } from '@/components/ui/typography';
import SignInForm from './components/sign-in-form';
import { useBreakpoints } from '@/hooks';

const SignInPage = () => {
  const { isMediumScreen } = useBreakpoints();

  return (
    <section className='flex'>
      {isMediumScreen ? (
        <div className='w-full md:w-1/2 h-[calc(100vh-2rem)] rounded-lg bg-primary flex flex-col p-16 justify-center text-primary-foreground'>
          <TypographyH1>Noted!</TypographyH1>
          <TypographyH3>
            Never let a great idea slip away—capture your thoughts effortlessly
            with Noted!
          </TypographyH3>
        </div>
      ) : null}
      <div
        className={
          'w-full md:w-1/2 h-[calc(100vh-2rem)] rounded-lg flex justify-center items-center'
        }
      >
        <SignInForm />
      </div>
    </section>
  );
};

export default SignInPage;
