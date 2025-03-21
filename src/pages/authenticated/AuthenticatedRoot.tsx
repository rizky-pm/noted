import { Navigate, Outlet } from 'react-router-dom';
import useAuthenticationQuery from '@/services/authentication';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';
import Sidebar from '@/components/sidebar';
import { useEffect } from 'react';

const AuthenticatedRoot = () => {
  const { checkUser } = useAuthenticationQuery();
  const { refetch, isPending } = checkUser;
  const currentUser = useSelector((state: RootState) => state.auth.user);

  useEffect(() => {
    refetch();
  }, [refetch]);

  if (isPending) return <div>Loading...</div>;

  return currentUser ? (
    <main className='flex flex-col items-center'>
      <div className='max-w-screen-lg w-full'>
        <Sidebar />
        <section>
          <Outlet />
        </section>
      </div>
    </main>
  ) : (
    <Navigate to='/auth/sign-in' replace />
  );
};

export default AuthenticatedRoot;
