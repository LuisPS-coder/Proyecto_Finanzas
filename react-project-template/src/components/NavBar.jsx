import { Link, Outlet, useNavigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthProvider";

export const NavBar = () => {
  const { isAuth, user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <>
      <nav className="bg-white shadow-md px-6 py-4 flex justify-between items-center">
        {/* Logo + Inicio */}
        <div className="flex items-center gap-4">
          <img src="/logo.png" alt="Logo" className="h-8 w-auto" />
          <Link to="/" className="text-lg font-bold text-blue-700">
            Inicio
          </Link>
        </div>

        {/* Enlaces de navegación */}
        <div className="flex items-center gap-4 text-gray-700">
          {isAuth ? (
            <>
              <Link to="/dashboard" className="hover:text-blue-600">
                Dashboard
              </Link>
              <span className="text-sm text-gray-600">👤 {user?.email}</span>
              <button
                onClick={handleLogout}
                className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 text-sm"
              >
                Cerrar sesión
              </button>
            </>
          ) : (
            <>
              <Link to="/signup" className="hover:text-blue-600">
                Sign up
              </Link>
              <Link to="/login" className="hover:text-blue-600">
                Log in
              </Link>
            </>
          )}
        </div>
      </nav>
      <Outlet />
    </>
  );
};
