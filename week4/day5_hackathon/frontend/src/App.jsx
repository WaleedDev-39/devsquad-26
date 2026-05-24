import React from "react";
import Navbar from "./components/Navbar";
import { Outlet, useLocation } from "react-router-dom";
import Footer from "./components/Footer";

const App = () => {
  const location = useLocation();

  // Don't show navbar on admin pages or auth pages
  const isAdminPage = location.pathname.startsWith("/admin");
  const isAuthPage =
    location.pathname === "/login" || location.pathname === "/signup";

  return (
    <div>
      {!isAdminPage && !isAuthPage && <Navbar />}
      <Outlet />
    </div>
  );
};

export default App;