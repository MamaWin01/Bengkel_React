import { Navigate, useRoutes } from "react-router-dom";
import { Guest } from "../middleware/Index";
import NotFound from "../views/home/NotFound";
import HomePage from "../views/home/client/HomePages";
import Login from "../views/Auth/Login";

export default function Web() {
  const routes = useRoutes([
    {
      path: "/",
      element: <Navigate to="/HomePage" />,
    },
    {
      path: "/HomePage",
      element: <HomePage />,
    },
    {
      path: "/admin/login",
      element: <Login />,
    },
  ]);

  return routes;
}
