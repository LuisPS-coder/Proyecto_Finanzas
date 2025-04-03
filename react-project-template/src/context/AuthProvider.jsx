import { createContext, useState, useEffect } from "react";
import { postLogin, postRegister, isUserLoggedIn } from "../service/auth";
import api from "../service/api";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuth, setIsAuth] = useState(false);
  const [loading, setLoading] = useState(true);

  // Al cargar la app: verificar si hay un token y si es válido
  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      isUserLoggedIn()
        .then((res) => {
          setUser(res.user);
          setIsAuth(true);
        })
        .catch(() => {
          localStorage.removeItem("token");
          delete api.defaults.headers.common["Authorization"];
          setUser(null);
          setIsAuth(false);
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const login = async ({ email, password }) => {
    const res = await postLogin({ email, password });

    if (res.token) {
      localStorage.setItem("token", res.token);
      api.defaults.headers.common["Authorization"] = `Bearer ${res.token}`;
      setUser(res.user);
      setIsAuth(true);
    }

    return res;
  };

  const register = async ({ email, password }) => {
    const res = await postRegister({ email, password });

    if (res.token) {
      localStorage.setItem("token", res.token);
      api.defaults.headers.common["Authorization"] = `Bearer ${res.token}`;
      setUser(res.user);
      setIsAuth(true);
    }

    return res;
  };

  const logout = () => {
    localStorage.removeItem("token");
    delete api.defaults.headers.common["Authorization"];
    setUser(null);
    setIsAuth(false);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuth,
        loading,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
