import AuthenticatedRoot from '@/pages/authenticated/AuthenticatedRoot';
import DashboardPage from '@/pages/authenticated/dashboard';
import ProfilePage from '@/pages/authenticated/profile';
import ErrorPage from '@/pages/error';
import { createBrowserRouter } from 'react-router-dom';

const routes = createBrowserRouter([
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
]);

export default routes;
