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

  if (isPending) return <div>Loading...</div>;

  return user ? (
    <Navigate to='/' replace />
  ) : (
    <main className='p-4'>
      <Outlet />
    </main>
  );
};

export default UnauthenticatedRoot;
