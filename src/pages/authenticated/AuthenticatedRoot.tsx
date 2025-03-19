import { Navigate, Outlet } from 'react-router-dom';
import useAuthenticationQuery from '@/services/authentication';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';
import Sidebar from '@/components/sidebar';

const AuthenticatedRoot = () => {
  const { checkUser } = useAuthenticationQuery();
  const { isLoading } = checkUser;
  const { user } = useSelector((state: RootState) => state.auth);

  if (isLoading) return <div>Loading...</div>;

  return user ? (
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
