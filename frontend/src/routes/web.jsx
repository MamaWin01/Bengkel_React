import { Navigate, useRoutes } from 'react-router-dom';
import { Guest, Protected } from '../middleware'
import NotFound from '../views/home/NotFound';

import HomePage from "../views/home/client/HomePages";
import BookList from "../views/home/admin/BookList";
import BookHistory from "../views/home/admin/BookHistory";

import Login from '../views/Auth/Login'
import Layout from '../views/layout/MainPages'

export default function Web() {
  const routes = useRoutes([
    {
      path: '/',
      element: <Navigate to="/HomePage" />,
    },
    {
      path: "/HomePage",
      element: <HomePage />,
    },
    {
      path: '/admin/login',
      element: <Guest><Login /></Guest>,
    },
    {
      path: '/admin',
      element: <Protected><Layout /></Protected>,
      children: [
        { element: <HomePage />, index: true },
        { path: 'bookList', element: <BookList /> },
        { path: 'bookHistory', element: <BookHistory /> },
      ],
    },
    {
      path: '*',
      element: <NotFound />,
    },
  ]);

  return routes;
}