import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useContext, useState } from "react";
import { AuthContext } from "../context/AuthProvider";
import Loading from "../components/Loading";

export default function Login() {
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const onSubmit = async (data) => {
    setLoading(true);
    setError("");

    try {
      await login(data);
      navigate("/");
    } catch (err) {
      if (err.code === "ECONNABORTED" || err.message.includes("timeout")) {
        setError("Despertando servidor... vuelve a intentarlo en unos segundos");
      } else {
        setError("Error al iniciar sesión: " + (err.response?.data?.message || err.message));
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-blue-50">
      {loading ? (
        <Loading message="Despertando servidor..." />
      ) : (
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="bg-white p-8 rounded-xl shadow-md w-full max-w-md space-y-6"
        >
          <h2 className="text-2xl font-semibold text-blue-700 text-center">Inicia sesión</h2>

          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              autoComplete="username"
              {...register("email", { required: true })}
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            />
            {errors.email && <span className="text-red-500 text-sm">Este campo es obligatorio</span>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Contraseña</label>
            <input
              type="password"
              autoComplete="current-password"
              {...register("password", { required: true })}
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            />
            {errors.password && <span className="text-red-500 text-sm">Este campo es obligatorio</span>}
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition"
          >
            Iniciar sesión
          </button>

          {error && <p className="text-red-500 text-sm text-center">{error}</p>}
        </form>
      )}
    </div>
  );
}
