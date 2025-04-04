import { Link } from "react-router-dom";
import { useAuth } from '../hooks/useAuth'
import React, { useContext } from "react";
import { AuthContext } from "../context/AuthProvider";


export const HomePage = () => {
  const { auth } = useAuth();

  return (
    <div className="min-h-screen bg-blue-50 text-blue-900 font-sans">
      {/* Hero principal */}
      <div className="flex flex-col items-center justify-center px-4 py-20">
        <img
          src="/logo.png"
          alt="Logo Balance"
          className="h-28 w-auto mb-6"
        />
        <h1 className="text-4xl font-bold text-center mb-4">
          Toma el control de tus finanzas con Balance
        </h1>
        <p className="text-lg text-center max-w-xl mb-6">
          Registra tus ingresos y gastos, visualiza estadísticas en tiempo real y alcanza tus metas financieras de forma sencilla y segura.
        </p>

        {!auth?.token && (
          <div className="flex gap-4">
            <Link
              to="/signup"
              className="bg-indigo-600 text-white px-6 py-2 rounded hover:bg-indigo-700 transition"
            >
              Empieza ahora
            </Link>
            <Link
              to="/login"
              className="border border-indigo-600 text-indigo-600 px-6 py-2 rounded hover:bg-indigo-50 transition"
            >
              Ya tengo cuenta
            </Link>
          </div>
        )}
      </div>

      {/* Sección de beneficios */}
      <div className="bg-white py-16 px-6">
        <h2 className="text-2xl font-semibold text-center mb-12">
          ¿Por qué usar Balance?
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto text-center">
          {/* Beneficio 1 */}
          <div className="flex flex-col items-center">
            <svg className="h-16 w-16 mb-4 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path d="M5 3v18" />
              <path d="M19 21v-18" />
              <path d="M5 7h14" />
              <path d="M5 15h14" />
              <path d="M8 13v4" />
              <path d="M11 13v4" />
              <path d="M16 13v4" />
              <path d="M14 5v4" />
              <path d="M11 5v4" />
              <path d="M8 5v4" />
              <path d="M3 21h18" />
            </svg>
            <h3 className="text-lg font-bold mb-2">Gráficos automáticos</h3>
            <p className="text-sm text-gray-700">
              Visualiza tus hábitos financieros con estadísticas claras y atractivas.
            </p>
          </div>

          {/* Beneficio 2 */}
          <div className="flex flex-col items-center">
            <svg className="h-16 w-16 mb-4 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path d="M11.5 21h-4.5a2 2 0 0 1 -2 -2v-6a2 2 0 0 1 2 -2h10a2 2 0 0 1 2 2v.5" />
              <path d="M11 16a1 1 0 1 0 2 0a1 1 0 0 0 -2 0" />
              <path d="M8 11v-4a4 4 0 1 1 8 0v4" />
              <path d="M15 19l2 2l4 -4" />
            </svg>
            <h3 className="text-lg font-bold mb-2">Privacidad y seguridad</h3>
            <p className="text-sm text-gray-700">
              Tus datos están cifrados y solo tú puedes acceder a ellos.
            </p>
          </div>

          {/* Beneficio 3 */}
          <div className="flex flex-col items-center">
            <svg className="h-16 w-16 mb-4 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path d="M3 12a9 9 0 1 0 18 0a9 9 0 0 0 -18 0" />
              <path d="M3.6 9h16.8" />
              <path d="M3.6 15h16.8" />
              <path d="M11.5 3a17 17 0 0 0 0 18" />
              <path d="M12.5 3a17 17 0 0 1 0 18" />
            </svg>
            <h3 className="text-lg font-bold mb-2">Accede desde cualquier lugar</h3>
            <p className="text-sm text-gray-700">
              Balance funciona en móviles y ordenadores, sin instalaciones.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

