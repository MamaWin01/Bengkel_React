import { Navigate, useRoutes } from 'react-router-dom';
import {Guest} from '../middleware/Index';
import NotFound from '../views/home/NotFound';
import HomePage from '../views/home/client/HomePages';

export default function Web() {
  const routes = useRoutes([
    {
      path: '/',
      element: <Navigate to="/HomePage"/>,
    },
    {
        path: '/HomePage',
        element: <HomePage />,
      },
    {
      path: '*',
      element: <NotFound />,
    },
  ]);

  return routes;
}