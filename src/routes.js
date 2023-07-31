import { Navigate, useRoutes } from 'react-router-dom';
// layouts
import DashboardLayout from './layouts/dashboard';
import SimpleLayout from './layouts/simple';
//
import BlogPage from './pages/BlogPage';
import UserPage from './pages/UserPage';
import LoginPage from './pages/LoginPage';
import Page404 from './pages/Page404';
import ProductsPage from './pages/ProductsPage';
import DashboardAppPage from './pages/DashboardAppPage';
import DownloadLogPage from './pages/DownloadLogPage';
import NewCreateLogPage from './pages/NewCreateLogPage';
import VersionUpLogPage from './pages/VersionUpLogPage';
import EngChangeLogPage from './pages/EngChangeLogPage';
import UserLoginLogPage from './pages/UserLoginLogPage';
import LicenseLoginLogPage from './pages/LicenseLoginLogPage';

// ----------------------------------------------------------------------

export default function Router() {
  const routes = useRoutes([
    {
      path: '/dashboard',
      element: <DashboardLayout />,
      children: [
        { element: <Navigate to="/dashboard/download" />, index: true },
        { path: 'app', element: <DashboardAppPage /> },
        { path: 'download', element: <DownloadLogPage /> },
        { path: 'newcreate', element: <NewCreateLogPage /> },
        { path: 'versionup', element: <VersionUpLogPage /> },
        { path: 'engchange', element: <EngChangeLogPage /> },
        { path: 'licenselog', element: <LicenseLoginLogPage /> },
        { path: 'userlog', element: <UserLoginLogPage /> },        
        { path: 'user', element: <UserPage /> },
        { path: 'products', element: <ProductsPage /> },
        { path: 'blog', element: <BlogPage /> },
      ],
    },
    {
      path: 'login',
      element: <LoginPage />,
    },
    {
      element: <SimpleLayout />,
      children: [
        { element: <Navigate to="/dashboard/download" />, index: true },
        { path: '404', element: <Page404 /> },
        { path: '*', element: <Navigate to="/404" /> },
      ],
    },
    {
      path: '*',
      element: <Navigate to="/404" replace />,
    },
  ]);

  return routes;
}
