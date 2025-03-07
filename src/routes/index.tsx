import AuthenticatedRoot from '@/pages/authenticated/AuthenticatedRoot';
import DashboardPage from '@/pages/authenticated/dashboard';
import ProfilePage from '@/pages/authenticated/profile';
import ErrorPage from '@/pages/error';
import SignInPage from '@/pages/unauthenticated/sign-in';
import SignUpPage from '@/pages/unauthenticated/sign-up';
import UnauthenticatedRoot from '@/pages/unauthenticated/UnauthenticatedRoot';
import { createBrowserRouter } from 'react-router-dom';

const routes = createBrowserRouter(
  [
    {
      path: '/',
      element: <AuthenticatedRoot />,
      errorElement: <ErrorPage />,
      children: [
        {
          index: true,
          element: <DashboardPage />,
        },
        {
          path: 'profile',
          element: <ProfilePage />,
        },
      ],
    },
    {
      path: '/auth',
      element: <UnauthenticatedRoot />,
      errorElement: <ErrorPage />,
      children: [
        {
          path: 'sign-in',
          element: <SignInPage />,
        },
        {
          path: 'sign-up',
          element: <SignUpPage />,
        },
      ],
    },
  ],
  {
    future: {
      v7_relativeSplatPath: true,
    },
  }
);

export default routes;
