import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthProvider";
import {
  getTransactions,
  createTransaction,
  deleteTransaction,
} from "../services/transactionService";
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
    <div>
      <h1>Bienvenido al Dashboard</h1>

      {user && (
        <>
          <p>Email: {user.email}</p>
          {user.username && <p>Nombre de usuario: {user.username}</p>}
        </>
      )}

      <button onClick={handleLogout}>Cerrar sesión</button>


      <hr />

      <h3>Filtrar por fecha</h3>
      <select value={filtro} onChange={(e) => setFiltro(e.target.value)}>
        <option value="semana">Esta semana</option>
        <option value="mes">Este mes</option>
        <option value="trimestre">Este trimestre</option>
        <option value="personalizado">Rango personalizado</option>
        <option value="todos">Ver todo</option>
      </select>

      {filtro === "personalizado" && (
        <div style={{ display: "flex", gap: "1rem", marginTop: "1rem" }}>
          <div>
            <label>Desde</label>
            <input
              type="date"
              value={desde}
              onChange={(e) => setDesde(e.target.value)}
            />
          </div>
          <div>
            <label>Hasta</label>
            <input
              type="date"
              value={hasta}
              onChange={(e) => setHasta(e.target.value)}
            />
          </div>
        </div>
      )}

      <hr />

      {transFiltradas.length > 0 && (
        <>
          <h3>Resumen financiero</h3>
          <p>Total ingresos: ${totalIngreso.toFixed(2)}</p>
          <p>Total gastos: ${totalGasto.toFixed(2)}</p>
          <p><strong>Balance actual: ${balance.toFixed(2)}</strong></p>
        </>
      )}

      <hr />

      <h2>Añadir nueva transacción</h2>
      <form onSubmit={handleSubmit}>
        <select name="type" value={form.type} onChange={handleChange}>
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
        />

        <input
          type="number"
          name="amount"
          placeholder="Monto"
          value={form.amount}
          onChange={handleChange}
          required
        />

        <input
          type="text"
          name="note"
          placeholder="Nota (opcional)"
          value={form.note}
          onChange={handleChange}
        />

        <button type="submit">Añadir</button>
      </form>

      <hr />

      {transFiltradas.length > 0 && (
  <>
    <h3>Gráfica por categoría</h3>
    <TransactionPieChart data={transFiltradas} />

    <h3>Gráfica por tipo</h3>
    <TransactionBarChart data={transFiltradas} />

    <h3>Evolución mensual</h3>
    <TransactionLineChart data={transFiltradas} />
  </>
)}


      <h2>Mis transacciones</h2>
      <ul>
        {transFiltradas.map((tx) => (
          <li key={tx.id}>
            <strong>{tx.type.toUpperCase()}</strong> – {tx.category} – ${tx.amount}
            {tx.note && <> – {tx.note}</>}
            <button onClick={() => handleDelete(tx.id)}>Eliminar</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
