import AuthenticatedRoot from '@/pages/authenticated/AuthenticatedRoot';
import DashboardPage from '@/pages/authenticated/dashboard';
import ProfilePage from '@/pages/authenticated/profile';
import ErrorPage from '@/pages/error';
import ForgetPasswordPage from '@/pages/unauthenticated/forget-password';
import ResetPasswordPage from '@/pages/unauthenticated/reset-password';
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
        {
          path: 'forget-password',
          element: <ForgetPasswordPage />,
        },
        {
          path: 'forget-password/reset',
          element: <ResetPasswordPage />,
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
