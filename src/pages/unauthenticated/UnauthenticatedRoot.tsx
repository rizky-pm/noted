import LoadingScreen from '@/components/loading-screen';
import useAuthenticationQuery from '@/services/authentication';
import { RootState } from '@/store';
import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Navigate, Outlet } from 'react-router-dom';

const UnauthenticatedRoot = () => {
  const { checkUser } = useAuthenticationQuery();
  const { refetch, isPending } = checkUser;
  const user = useSelector((state: RootState) => state.auth.user);

  useEffect(() => {
    refetch();
  }, [refetch]);

  if (isPending) return <LoadingScreen />;

  return user ? (
    <Navigate to='/' replace />
  ) : (
    <main className='p-4 flex justify-center items-center h-screen sm:block'>
      <Outlet />
    </main>
  );
};

export default UnauthenticatedRoot;
