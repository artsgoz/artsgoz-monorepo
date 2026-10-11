import { createBrowserRouter, RouterProvider } from 'react-router';
import MainLayout from '../layouts/MainLayout';
import { aboutRoutes } from './about/aboutRoutes';
import { homeRoutes } from './home/homeRoutes';
import { creditTrackingRoutes } from './credit-tracking/creditTrackingRoutes';
import { professorsRoutes } from './professors/professorsRoutes';
import { studentServicesRoutes } from './student-services/studentServicesRoutes';
import { formsRoutes } from './forms/formsRoutes';
import { curriculumRoutes } from './curriculum/curriculumRoutes';
import { internshipsRoutes } from './internships/internshipsRoutes';
import { articlesRoutes } from './articles/articlesRoutes';
import { clubsRoutes } from './clubs/clubsRoutes';
import { helpRoutes } from './help/helpRoutes';
import { PATHS } from './paths';

const router = createBrowserRouter([
  {
    path: PATHS.ROOT,
    element: <MainLayout />,
    children: [
      ...homeRoutes,
      ...aboutRoutes,
      ...creditTrackingRoutes,
      ...professorsRoutes,
      ...studentServicesRoutes,
      ...formsRoutes,
      ...curriculumRoutes,
      ...internshipsRoutes,
      ...articlesRoutes,
      ...clubsRoutes,
      ...helpRoutes,
    ],
  },
]);

export const AppRouter = () => <RouterProvider router={router} />;
