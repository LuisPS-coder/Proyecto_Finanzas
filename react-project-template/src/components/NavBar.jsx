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
      <nav style={{ padding: "1rem", display: "flex", gap: "1rem" }}>
        <Link to="/">Inicio</Link>

        {isAuth ? (
          <>
            <Link to="/dashboard">Dashboard</Link>
            <span>👤 {user?.email}</span>
            <button onClick={handleLogout}>Cerrar sesión</button>
          </>
        ) : (
          <>
            <Link to="/signup">Sign up</Link>
            <Link to="/login">Log in</Link>
          </>
        )}
      </nav>
      <Outlet />
    </>
  );
};
