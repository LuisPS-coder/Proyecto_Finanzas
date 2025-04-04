import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthProvider";
import {
  getTransactions,
  createTransaction,
  deleteTransaction,
} from "../service/transactionService";
import TransactionPieChart from "../components/TransactionPieChart";
import TransactionBarChart from "../components/TransactionBarChart";
import { useNavigate } from "react-router-dom";


export default function Dashboard() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [transactions, setTransactions] = useState([]);
  const [form, setForm] = useState({
    type: "gasto",
    category: "",
    amount: "",
    note: "",
  });

  const [filtro, setFiltro] = useState("mes");
  const [desde, setDesde] = useState("");
  const [hasta, setHasta] = useState("");

  const fetchData = async () => {
    const res = await getTransactions();
    setTransactions(res.data);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await createTransaction(form);
    setForm({ type: "gasto", category: "", amount: "", note: "" });
    fetchData();
  };

  const handleDelete = async (id) => {
    await deleteTransaction(id);
    fetchData();
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };
  

  const filtrarPorFecha = () => {
    const ahora = new Date();
    let inicio, fin;

    switch (filtro) {
      case "semana":
        inicio = new Date(ahora);
        inicio.setDate(inicio.getDate() - 7);
        fin = ahora;
        break;
      case "mes":
        inicio = new Date(ahora.getFullYear(), ahora.getMonth(), 1);
        fin = ahora;
        break;
      case "trimestre":
        const mesActual = ahora.getMonth();
        const trimestreInicio = mesActual - (mesActual % 3);
        inicio = new Date(ahora.getFullYear(), trimestreInicio, 1);
        fin = ahora;
        break;
      case "personalizado":
        if (!desde || !hasta) return transactions;
        inicio = new Date(desde);
        fin = new Date(hasta);
        break;
      default:
        return transactions;
    }

    return transactions.filter((tx) => {
      const fechaTx = new Date(tx.date);
      return fechaTx >= inicio && fechaTx <= fin;
    });
  };

  const transFiltradas = filtrarPorFecha();

  const totalIngreso = transFiltradas
    .filter((t) => t.type === "ingreso")
    .reduce((sum, t) => sum + t.amount, 0);

  const totalGasto = transFiltradas
    .filter((t) => t.type === "gasto")
    .reduce((sum, t) => sum + t.amount, 0);

  const balance = totalIngreso - totalGasto;

  return (
    <div className="min-h-screen bg-blue-50 p-6 text-gray-900">
      <div className="max-w-4xl mx-auto bg-white shadow-md rounded-xl p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-blue-800">Bienvenido al Dashboard</h1>
          <button onClick={handleLogout} className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded">
            Cerrar sesión
          </button>
        </div>
  
        {user && (
          <div className="mb-4 text-sm text-gray-600">
            <p>Email: {user.email}</p>
            {user.username && <p>Nombre de usuario: {user.username}</p>}
          </div>
        )}
  
        <div className="mb-6">
          <h3 className="text-xl font-semibold text-blue-700 mb-2">Filtrar por fecha</h3>
          <select
            className="border border-gray-300 p-2 rounded w-full sm:w-1/2"
            value={filtro}
            onChange={(e) => setFiltro(e.target.value)}
          >
            <option value="semana">Esta semana</option>
            <option value="mes">Este mes</option>
            <option value="trimestre">Este trimestre</option>
            <option value="personalizado">Rango personalizado</option>
            <option value="todos">Ver todo</option>
          </select>
  
          {filtro === "personalizado" && (
            <div className="flex gap-4 mt-4">
              <div className="flex-1">
                <label className="block mb-1 text-sm font-medium">Desde</label>
                <input
                  type="date"
                  value={desde}
                  onChange={(e) => setDesde(e.target.value)}
                  className="border border-gray-300 p-2 rounded w-full"
                />
              </div>
              <div className="flex-1">
                <label className="block mb-1 text-sm font-medium">Hasta</label>
                <input
                  type="date"
                  value={hasta}
                  onChange={(e) => setHasta(e.target.value)}
                  className="border border-gray-300 p-2 rounded w-full"
                />
              </div>
            </div>
          )}
        </div>
  
        {transFiltradas.length > 0 && (
          <div className="mb-6 bg-blue-100 p-4 rounded">
            <h3 className="text-xl font-semibold text-blue-700 mb-2">Resumen financiero</h3>
            <p>Total ingresos: <span className="text-green-700 font-medium">${totalIngreso.toFixed(2)}</span></p>
            <p>Total gastos: <span className="text-red-700 font-medium">${totalGasto.toFixed(2)}</span></p>
            <p className="font-bold text-gray-800 mt-2">Balance actual: ${balance.toFixed(2)}</p>
          </div>
        )}
  
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-blue-700 mb-2">Añadir nueva transacción</h2>
          <form onSubmit={handleSubmit} className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <select name="type" value={form.type} onChange={handleChange} className="p-2 border border-gray-300 rounded">
              <option value="gasto">Gasto</option>
              <option value="ingreso">Ingreso</option>
            </select>
            <input
              type="text"
              name="category"
              placeholder="Categoría"
              value={form.category}
              onChange={handleChange}
              required
              className="p-2 border border-gray-300 rounded"
            />
            <input
              type="number"
              name="amount"
              placeholder="Monto"
              value={form.amount}
              onChange={handleChange}
              required
              className="p-2 border border-gray-300 rounded"
            />
            <input
              type="text"
              name="note"
              placeholder="Nota (opcional)"
              value={form.note}
              onChange={handleChange}
              className="p-2 border border-gray-300 rounded"
            />
            <button type="submit" className="col-span-full sm:col-span-2 lg:col-span-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded">
              Añadir
            </button>
          </form>
        </div>
  
        {transFiltradas.length > 0 && (
          <>
            <h3 className="text-xl font-semibold text-blue-700 mb-2">Gráfica por categoría</h3>
            <TransactionPieChart data={transFiltradas} />
  
            <h3 className="text-xl font-semibold text-blue-700 mt-6 mb-2">Gráfica por tipo</h3>
            <TransactionBarChart data={transFiltradas} />
  
            <h3 className="text-xl font-semibold text-blue-700 mt-6 mb-2">Evolución mensual</h3>
            <TransactionLineChart data={transFiltradas} />
          </>
        )}
  
        <div className="mt-6">
          <h2 className="text-2xl font-bold text-blue-700 mb-4">Mis transacciones</h2>
          <ul className="space-y-2">
            {transFiltradas.map((tx) => (
              <li key={tx.id} className="bg-gray-100 p-3 rounded flex justify-between items-center">
                <div>
                  <span className="font-semibold">{tx.type.toUpperCase()}</span> – {tx.category} – ${tx.amount}
                  {tx.note && <span> – {tx.note}</span>}
                </div>
                <button
                  onClick={() => handleDelete(tx.id)}
                  className="bg-red-400 hover:bg-red-600 text-white px-3 py-1 rounded"
                >
                  Eliminar
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
  
}
