import { Navigate, Outlet } from 'react-router-dom';
import useAuthenticationQuery from '@/services/authentication';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';
import Sidebar from '@/components/sidebar';
import { useEffect } from 'react';
import LoadingScreen from '@/components/loading-screen';
import Footer from '@/components/footer';
import { Loader } from 'lucide-react';
import { motion } from 'framer-motion';

const AuthenticatedRoot = () => {
  const { checkUser } = useAuthenticationQuery();
  const { refetch, isPending } = checkUser;
  const currentUser = useSelector((state: RootState) => state.auth.user);
  const { isLoading } = useSelector((state: RootState) => state.global);

  useEffect(() => {
    refetch();
  }, [refetch]);

  useEffect(() => {
    if (isLoading) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [isLoading]);

  if (isPending) return <LoadingScreen />;

  return currentUser ? (
    <main className={`flex flex-col items-center relative`}>
      <div className='max-w-screen-lg w-full'>
        <Sidebar />
        <section>
          <Outlet />
        </section>
      </div>
      <Footer />
      {isLoading ? (
        <motion.div
          id='overlay'
          className='bg-black/70 w-full h-full fixed top-0 left-0 flex justify-center items-center flex-col'
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          <div className='p-4 bg-accent/20 rounded-lg'>
            <motion.div
              animate={{ rotate: [0, 360] }}
              transition={{
                repeat: Infinity,
                duration: 3,
                ease: 'linear',
              }}
            >
              <Loader className='w-10 h-10 text-background' />
            </motion.div>
          </div>
        </motion.div>
      ) : null}
    </main>
  ) : (
    <Navigate to='/auth/sign-in' replace />
  );
};

export default AuthenticatedRoot;
