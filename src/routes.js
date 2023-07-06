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
import DashboardAppPage2 from './pages/DashboardAppPage2';
import DownloadLogPage from './pages/DownloadLogPage';
import LogReportPage from './pages/LogReportPage';
import LogReportPage2 from './pages/LogReportPage2';
import UserLoginLogPage from './pages/UserLoginLogPage';
import LicenseLoginLogPage from './pages/LicenseLoginLogPage';

// ----------------------------------------------------------------------

export default function Router() {
  const routes = useRoutes([
    {
      path: '/dashboard',
      element: <DashboardLayout />,
      children: [
        { element: <Navigate to="/dashboard/app" />, index: true },
        { path: 'app', element: <DashboardAppPage /> },
        { path: 'downloadlog', element: <DownloadLogPage /> },
        { path: 'licenselog', element: <LicenseLoginLogPage /> },
        { path: 'userlog', element: <UserLoginLogPage /> },
        { path: 'dashboard2', element: <DashboardAppPage2 /> },
        { path: 'logreport', element: <LogReportPage /> },
        { path: 'logreport2', element: <LogReportPage2 /> },
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
        { element: <Navigate to="/dashboard/app" />, index: true },
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
