import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthProvider";

function RequireAuth() {
  const { isAuth, loading } = useContext(AuthContext);
  const location = useLocation();

  if (loading) return <p>Cargando sesión...</p>;

  return isAuth ? (
    <Outlet />
  ) : (
    <Navigate to="/login" state={{ from: location }} replace />
  );
}

export default RequireAuth;
