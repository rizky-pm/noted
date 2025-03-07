import useAuthenticationQuery from '@/services/authentication';
import { RootState } from '@/store';
import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Navigate, Outlet } from 'react-router-dom';

const UnauthenticatedRoot = () => {
  console.log('Unauthenticated');
  const { checkUser } = useAuthenticationQuery();
  const { isLoading, refetch } = checkUser;
  const { user } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    refetch();
  }, []);

  if (isLoading) return <div>Loading...</div>;

  return user ? (
    <Navigate to='/' replace />
  ) : (
    <main className='p-4'>
      <Outlet />
    </main>
  );
};

export default UnauthenticatedRoot;
