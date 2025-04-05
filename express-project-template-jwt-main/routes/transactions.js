const express = require("express");
const router = express.Router();
const prisma = require("../prisma");

// Obtener todas las transacciones
router.get("/", async (req, res) => {
  try {
    const transactions = await prisma.transaction.findMany({
      orderBy: { date: "desc" },
    });
    res.json(transactions);
  } catch (error) {
    console.error("Error al obtener transacciones:", error);
    res.status(500).json({ message: "Error al obtener transacciones" });
  }
});

// Crear una transacción (sin userId)
router.post("/", async (req, res) => {
  const { title, amount, type, category, date } = req.body;

  if (!title || !amount || !type || !category || !date) {
    return res.status(400).json({ message: "Datos incompletos" });
  }

  try {
    const transaction = await prisma.transaction.create({
      data: {
        title,
        amount,
        type,
        category,
        date: new Date(date),
      },
    });
    res.status(201).json(transaction);
  } catch (error) {
    console.error("Error al crear transacción:", error);
    res.status(500).json({ message: "Error al crear transacción" });
  }
});

// Eliminar una transacción
router.delete("/:id", async (req, res) => {
  const { id } = req.params;

  try {
    await prisma.transaction.delete({
      where: { id: Number(id) },
    });
    res.json({ message: "Transacción eliminada" });
  } catch (error) {
    console.error("Error al eliminar transacción:", error);
    res.status(500).json({ message: "Error al eliminar transacción" });
  }
});

module.exports = router;
