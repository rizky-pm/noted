import { Navigate, Outlet } from 'react-router-dom';
import useAuthenticationQuery from '@/services/authentication';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';
import Sidebar from '@/components/sidebar';
import { useEffect } from 'react';
import LoadingScreen from '@/components/loading-screen';
import Footer from '@/components/footer';

const AuthenticatedRoot = () => {
  const { checkUser } = useAuthenticationQuery();
  const { refetch, isPending } = checkUser;
  const currentUser = useSelector((state: RootState) => state.auth.user);

  useEffect(() => {
    refetch();
  }, [refetch]);

  if (isPending) return <LoadingScreen />;

  return currentUser ? (
    <main className='flex flex-col items-center'>
      <div className='max-w-screen-lg w-full'>
        <Sidebar />
        <section>
          <Outlet />
        </section>
      </div>
      <Footer />
    </main>
  ) : (
    <Navigate to='/auth/sign-in' replace />
  );
};

export default AuthenticatedRoot;
