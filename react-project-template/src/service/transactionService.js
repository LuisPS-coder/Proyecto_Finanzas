import api from "./api";

// Obtener todas las transacciones del usuario
export const getTransactions = () => api.get("/transactions");

// Crear una nueva transacción
export const createTransaction = (data) => api.post("/transactions", data);

// Eliminar una transacción por ID
export const deleteTransaction = (id) => api.delete(`/transactions/${id}`);
