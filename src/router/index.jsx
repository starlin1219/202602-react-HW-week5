import { createHashRouter } from "react-router";
import FrontendLayout from "../layout/FrontendLayout";
import Home from "../pages/front/Home";
import Products from "../pages/front/Procucts";
import ProductDetail from "../pages/front/ProductDetail";
import Cart from "../pages/front/Cart";

import Login from "../pages/Login";
import AdminLayout from "../layout/AdminLayout";
import ProductsList from "../pages/ProductsList";
import RequireAuth from "../components/RequireAuth";
import NotFound from "../pages/NotFound";
import RequireGuest from "../components/RequireGuest";

const router = createHashRouter([
  {
    path: "/",
    element: <FrontendLayout />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: "product",
        element: <Products />,
      },
      {
        path: "product/:id",
        element: <ProductDetail />,
      },
      {
        path: "cart",
        element: <Cart />,
      },
    ],
  },
  {
    path: "/login",
    element: (
      <RequireGuest>
        <Login />
      </RequireGuest>
    ),
  },
  {
    path: "/admin",
    element: (
      <RequireAuth>
        <AdminLayout />
      </RequireAuth>
    ),
    children: [
      {
        path: "products",
        element: <ProductsList />,
      },
    ],
  },
  { path: "*", element: <NotFound /> },
]);

export default router;
