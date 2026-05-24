import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { clearSession, getCurrentUser, isAuthenticated } from "../services/api";

const Navbar = () => {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [user, setUser] = useState(null);

  const loggedIn = isAuthenticated();

  useEffect(() => {
    if (loggedIn) {
      setUser(getCurrentUser());
    } else {
      setUser(null);
    }
  }, [loggedIn]);

  const handleLogout = () => {
    clearSession();
    navigate("/login", { replace: true });
  };

  return (
    <header className="bg-gray-600 text-white">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
        <div className="flex items-center gap-3">
          <div className="text-2xl font-bold">TaskManager</div>
          {user ? (
            <div className="hidden sm:block text-sm text-gray-200">
              <div className="font-semibold">{user.fullName}</div>
              <div className="text-xs text-gray-100">{user.email}</div>
            </div>
          ) : null}
        </div>

        <button
          className="sm:hidden rounded-md border border-white px-3 py-2"
          onClick={() => setMenuOpen((prev) => !prev)}
          aria-label="Toggle navigation"
        >
          <span className="block h-0.5 w-5 bg-white"></span>
          <span className="mt-1 block h-0.5 w-5 bg-white"></span>
          <span className="mt-1 block h-0.5 w-5 bg-white"></span>
        </button>

        <nav
          className={`${
            menuOpen ? "block" : "hidden"
          } sm:block text-sm font-semibold`}
        >
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-4">
            {loggedIn ? (
              <>
                <Link
                  to="/"
                  onClick={() => setMenuOpen(false)}
                  className="hover:text-blue-200 transition-all"
                >
                  Dashboard
                </Link>
                <button
                  onClick={handleLogout}
                  className="rounded-md bg-red-500 px-4 py-1 text-white hover:bg-red-600 transition-all cursor-pointer"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  onClick={() => setMenuOpen(false)}
                  className="hover:text-blue-200 transition-all"
                >
                  Login
                </Link>
                <Link
                  to="/registration"
                  onClick={() => setMenuOpen(false)}
                  className="rounded-md bg-red-500 px-4 py-1 text-white hover:bg-red-600 transition-all"
                >
                  Register
                </Link>
              </>
            )}
          </div>
        </nav>
      </div>
    </header>
  );
};

export default Navbar;
