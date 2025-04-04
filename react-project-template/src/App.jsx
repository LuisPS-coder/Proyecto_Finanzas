import { Routes, Route } from "react-router-dom";
import { HomePage } from "./pages/HomePage";
import { NavBar } from "./components/NavBar";
import SignUp from "./pages/Signup";
import Login from "./pages/Login";
import RequireAuth from "./components/ProtectedRoute";
import Dashboard from "./pages/Dashboard";

function App() {
  return (
    <Routes>
      <Route element={<NavBar />}>
        {/* HomePage disponible para todos */}
        <Route path="/" element={<HomePage />} />

        {/* Rutas protegidas */}
        <Route element={<RequireAuth />}>
          <Route path="/dashboard" element={<Dashboard />} />
        </Route>

        {/* Rutas públicas */}
        <Route path="/signup" element={<SignUp />} />
        <Route path="/login" element={<Login />} />
      </Route>
    </Routes>
  );
}

export default App;

