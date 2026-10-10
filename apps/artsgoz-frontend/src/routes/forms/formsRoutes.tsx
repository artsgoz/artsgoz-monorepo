import type { RouteObject } from 'react-router';
import { PATHS } from '../paths';
import FormsPage from './pages/FormsPage';
import YellowCardPage from './pages/YellowCardPage';

export const formsRoutes: RouteObject[] = [
  {
    path: PATHS.FORMS,
    element: <FormsPage />,
  },
  {
    path: PATHS.YELLOW_CARD,
    element: <YellowCardPage />,
  },
];
