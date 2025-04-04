import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useContext, useState } from "react";
import { AuthContext } from "../context/AuthProvider";
import Loading from "../components/Loading";

export default function Signup() {
  const navigate = useNavigate();
  const { registerUser } = useContext(AuthContext);

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
      await registerUser(data);
      navigate("/dashboard");
    } catch (err) {
      if (err.code === "ECONNABORTED" || err.message.includes("timeout")) {
        setError("Despertando servidor... vuelve a intentarlo en unos segundos");
      } else {
        setError("Error al registrarte: " + (err.response?.data?.message || err.message));
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
          <h2 className="text-2xl font-semibold text-blue-700 text-center">Crea tu cuenta</h2>

          <div>
            <label className="block text-sm font-medium text-gray-700">Nombre de usuario</label>
            <input
              type="text"
              autoComplete="username"
              {...register("username", { required: true })}
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            />
            {errors.username && <span className="text-red-500 text-sm">Este campo es obligatorio</span>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              autoComplete="email"
              {...register("email", { required: true })}
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            />
            {errors.email && <span className="text-red-500 text-sm">Este campo es obligatorio</span>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Contraseña</label>
            <input
              type="password"
              autoComplete="new-password"
              {...register("password", { required: true })}
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            />
            {errors.password && <span className="text-red-500 text-sm">Este campo es obligatorio</span>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Confirmar contraseña</label>
            <input
              type="password"
              autoComplete="new-password"
              {...register("confirmPassword", { required: true })}
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            />
            {errors.confirmPassword && <span className="text-red-500 text-sm">Este campo es obligatorio</span>}
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition"
          >
            Crear cuenta
          </button>

          {error && <p className="text-red-500 text-sm text-center">{error}</p>}
        </form>
      )}
    </div>
  );
}
