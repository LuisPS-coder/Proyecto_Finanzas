import React, { useEffect, useState } from "react";
import {
  getTransactions,
  createTransaction,
  deleteTransaction,
} from "../services/transactionService";

function Dashboard() {
  const [transactions, setTransactions] = useState([]);
  const [form, setForm] = useState({
    title: "",
    amount: "",
    type: "ingreso",
    category: "",
    date: "",
  });

  const fetchTransactions = async () => {
    try {
      const res = await getTransactions();
      setTransactions(res.data);
    } catch (err) {
      console.error("Error al cargar transacciones:", err);
    }
  };

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createTransaction(form);
      setForm({
        title: "",
        amount: "",
        type: "ingreso",
        category: "",
        date: "",
      });
      fetchTransactions();
    } catch (err) {
      console.error("Error al crear transacción:", err);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteTransaction(id);
      fetchTransactions();
    } catch (err) {
      console.error("Error al eliminar transacción:", err);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Panel de Transacciones</h1>

      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6"
      >
        <input
          type="text"
          name="title"
          value={form.title}
          onChange={handleChange}
          placeholder="Título"
          required
          className="p-2 border border-gray-300 rounded"
        />
        <input
          type="number"
          name="amount"
          value={form.amount}
          onChange={handleChange}
          placeholder="Cantidad"
          required
          className="p-2 border border-gray-300 rounded"
        />
        <select
          name="type"
          value={form.type}
          onChange={handleChange}
          className="p-2 border border-gray-300 rounded"
        >
          <option value="ingreso">Ingreso</option>
          <option value="gasto">Gasto</option>
        </select>
        <input
          type="text"
          name="category"
          value={form.category}
          onChange={handleChange}
          placeholder="Categoría"
          required
          className="p-2 border border-gray-300 rounded"
        />
        <input
          type="date"
          name="date"
          value={form.date}
          onChange={handleChange}
          required
          className="p-2 border border-gray-300 rounded"
        />
        <button
          type="submit"
          className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition"
        >
          Añadir transacción
        </button>
      </form>

      <ul className="space-y-2">
        {transactions.map((tx) => (
          <li
            key={tx.id}
            className="bg-white p-4 shadow rounded flex justify-between items-center"
          >
            <span>
              <strong>{tx.title}</strong> - {tx.amount}€ ({tx.type})
            </span>
            <button
              onClick={() => handleDelete(tx.id)}
              className="text-red-600 hover:underline"
            >
              Eliminar
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Dashboard;
