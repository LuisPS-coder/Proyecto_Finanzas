import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useContext, useState } from "react";
import { AuthContext } from "../context/AuthProvider";
import Loading from "../components/Loading"; // asegúrate de crear este componente

export default function SignUp() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const { register: registerUser } = useContext(AuthContext);
  const navigate = useNavigate();

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
        setError("Error al registrar: " + (err.response?.data?.message || err.message));
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {loading ? (
        <Loading message="Despertando servidor..." />
      ) : (
        <form onSubmit={handleSubmit(onSubmit)}>
          <label htmlFor="email">
            Email
            <input
              type="email"
              name="email"
              autoComplete="username"
              {...register("email", { required: true })}
            />
            {errors.email && <span>This field is required</span>}
          </label>
          <label htmlFor="password">
            Password
            <input
              type="password"
              name="password"
              autoComplete="new-password"
              {...register("password", { required: true })}
            />
            {errors.password && <span>This field is required</span>}
          </label>
          <button type="submit">Sign up</button>
          {error && <p style={{ color: "red" }}>{error}</p>}
        </form>
      )}
    </div>
  );
}
