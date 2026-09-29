import { createBrowserRouter, RouterProvider } from 'react-router';
import MainLayout from '../layouts/MainLayout';
import { dashboardRoutes } from './dashboard/dashboardRoutes';
import { homeRoutes } from './home/homeRoutes';
import { PATHS } from './paths';
import YellowCardBackofficePage from '../features/yellow-card/YellowCardBackofficePage';

const router = createBrowserRouter([
  {
    path: PATHS.ROOT,
    element: <MainLayout />,
    children: [...homeRoutes, ...dashboardRoutes],
  },
  {
    path: PATHS.YELLOW_CARD_BACKOFFICE,
    element: <YellowCardBackofficePage />,
  },
]);

export const AppRouter = () => <RouterProvider router={router} />;
