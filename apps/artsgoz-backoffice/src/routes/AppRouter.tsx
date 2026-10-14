import { createBrowserRouter, RouterProvider, Navigate } from 'react-router';
import { PATHS } from './paths';
import YellowCardBackofficePage from '../features/yellow-card/YellowCardBackofficePage';
import SaraniyakornPage from '../features/saraniyakorn/SaraniyakornPage';
import TrafficPage from '../features/saraniyakorn/TrafficPage';
import CategoriesPage from '../features/saraniyakorn/CategoriesPage';
import { ArticlesPage } from '../features/saraniyakorn/ArticlesPage';
import { PublishedArticlesPage } from '../features/saraniyakorn/PublishedArticlesPage';
import { CreateArticlePage } from '../features/saraniyakorn/CreateArticlePage';
import CommentsPage from '../features/saraniyakorn/CommentsPage';
import ActivitiesPage from '../features/saraniyakorn/ActivitiesPage';
import { AccountSettingsPage } from '../features/saraniyakorn/AccountSettingsPage';
import { AdminDashboardPage } from '../features/goz-admin/AdminDashboardPage';
import { AdminAuditLogPage } from '../features/goz-admin/AdminAuditLogPage';
import { AdminReviewsPage } from '../features/goz-admin/AdminReviewsPage';
import { AdminUsersPage } from '../features/goz-admin/AdminUsersPage';

const router = createBrowserRouter([
  {
    path: PATHS.ROOT,
    element: <Navigate to={PATHS.SARANIYAKORN} replace />,
  },
  {
    path: PATHS.DASHBOARD.ROOT,
    element: <AdminDashboardPage />,
  },
  {
    path: PATHS.ADMIN.ROOT,
    element: <AdminDashboardPage />,
  },
  {
    path: PATHS.ADMIN.DASHBOARD,
    element: <AdminDashboardPage />,
  },
  {
    path: PATHS.ADMIN.AUDIT_LOG,
    element: <AdminAuditLogPage />,
  },
  {
    path: PATHS.ADMIN.REVIEWS,
    element: <AdminReviewsPage />,
  },
  {
    path: PATHS.ADMIN.USERS,
    element: <AdminUsersPage />,
  },
  {
    path: PATHS.YELLOW_CARD_BACKOFFICE,
    element: <YellowCardBackofficePage />,
  },
  {
    path: PATHS.SARANIYAKORN,
    element: <SaraniyakornPage />,
  },
  {
    path: PATHS.SARANIYAKORN_TRAFFIC,
    element: <TrafficPage />,
  },
  {
    path: PATHS.SARANIYAKORN_CATEGORIES,
    element: <CategoriesPage />,
  },
  {
    path: PATHS.SARANIYAKORN_ARTICLES,
    element: <ArticlesPage />,
  },
  {
    path: PATHS.SARANIYAKORN_PUBLISHED_ARTICLES,
    element: <PublishedArticlesPage />,
  },
  {
    path: PATHS.SARANIYAKORN_CREATE,
    element: <CreateArticlePage />,
  },
  {
    path: PATHS.SARANIYAKORN_COMMENTS,
    element: <CommentsPage />,
  },
  {
    path: PATHS.SARANIYAKORN_ACTIVITIES,
    element: <ActivitiesPage />,
  },
  {
    path: PATHS.SARANIYAKORN_SETTINGS,
    element: <AccountSettingsPage />,
  },
]);

export const AppRouter = () => <RouterProvider router={router} />;
