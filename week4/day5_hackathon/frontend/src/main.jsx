import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext.jsx";

// Pages
import HomePage from "./pages/HomePage.jsx";
import MoviesListPage from "./pages/MoviesListPage.jsx";
import WatchMoviePage from "./pages/WatchMoviePage.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import SignupPage from "./pages/SignupPage.jsx";
import SubscriptionPage from "./pages/SubscriptionPage.jsx";

// Admin Pages
import AdminLayout from "./pages/admin/AdminLayout.jsx";
import AdminDashboard from "./pages/admin/AdminDashboard.jsx";
import AdminUsers from "./pages/admin/AdminUsers.jsx";
import AdminMovies from "./pages/admin/AdminMovies.jsx";
import AdminPlans from "./pages/admin/AdminPlans.jsx";

// Route Guards
import { ProtectedRoute, AdminRoute } from "./components/ProtectedRoute.jsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "",
        element: <HomePage />,
      },
      {
        path: "movies",
        element: <MoviesListPage />,
      },
      {
        path: "watch/:id",
        element: <WatchMoviePage />,
      },
      {
        path: "login",
        element: <LoginPage />,
      },
      {
        path: "signup",
        element: <SignupPage />,
      },
      {
        path: "subscriptions",
        element: <SubscriptionPage />,
      },
    ],
  },
  {
    path: "/admin",
    element: (
      <AdminRoute>
        <AdminLayout />
      </AdminRoute>
    ),
    children: [
      {
        path: "",
        element: <AdminDashboard />,
      },
      {
        path: "users",
        element: <AdminUsers />,
      },
      {
        path: "movies",
        element: <AdminMovies />,
      },
      {
        path: "plans",
        element: <AdminPlans />,
      },
    ],
  },
]);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  </StrictMode>
);
