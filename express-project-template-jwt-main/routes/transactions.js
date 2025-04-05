const express = require("express");
const router = express.Router();
const prisma = require("../prisma");

// Obtener todas las transacciones (sin filtrar por usuario)
router.get("/", async (req, res) => {
  try {
    const transactions = await prisma.transaction.findMany();
    res.json(transactions);
  } catch (error) {
    console.error("Error al obtener transacciones:", error);
    res.status(500).json({ error: "Error al obtener transacciones" });
  }
});

// Crear transacción (requiere userId en el body)
router.post("/", async (req, res) => {
  try {
    const { title, amount, type, category, date, userId } = req.body;

    const newTransaction = await prisma.transaction.create({
      data: {
        title,
        amount: parseFloat(amount),
        type,
        category,
        date: new Date(date),
        userId,
      },
    });

    res.status(201).json(newTransaction);
  } catch (error) {
    console.error("Error al crear transacción:", error);
    res.status(500).json({ error: "Error al crear transacción" });
  }
});

module.exports = router;
