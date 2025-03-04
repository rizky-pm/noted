import Sidebar from '@/components/sidebar';
import { Outlet } from 'react-router-dom';

const AuthenticatedRoot = () => {
  return (
    <main className='flex relative'>
      <Sidebar />
      <section className='w-5/6'>
        <Outlet />
      </section>
    </main>
  );
};

export default AuthenticatedRoot;
