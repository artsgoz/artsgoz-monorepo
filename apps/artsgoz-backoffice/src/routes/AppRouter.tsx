import { createBrowserRouter, RouterProvider } from 'react-router';
import MainLayout from '../layouts/MainLayout';
import { dashboardRoutes } from './dashboard/dashboardRoutes';
import { homeRoutes } from './home/homeRoutes';
import { PATHS } from './paths';

const router = createBrowserRouter([
  {
    path: PATHS.ROOT,
    element: <MainLayout />,
    children: [...homeRoutes, ...dashboardRoutes],
  },
]);

export const AppRouter = () => <RouterProvider router={router} />;
