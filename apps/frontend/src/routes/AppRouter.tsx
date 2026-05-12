import { createBrowserRouter, RouterProvider } from 'react-router';
import MainLayout from '../layouts/MainLayout';
import { aboutRoutes } from './about/aboutRoutes';
import { homeRoutes } from './home/homeRoutes';
import { PATHS } from './paths';

const router = createBrowserRouter([
  {
    path: PATHS.ROOT,
    element: <MainLayout />,
    children: [...homeRoutes, ...aboutRoutes],
  },
]);

export const AppRouter = () => <RouterProvider router={router} />;
