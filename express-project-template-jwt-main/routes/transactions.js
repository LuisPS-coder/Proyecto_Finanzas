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
    res.status(500).json({ error: "Error al obtener transacciones" });
  }
});

// Crear nueva transacción (sin validación ni user)
router.post("/", async (req, res) => {
  try {
    const { title, amount, type, category, date } = req.body;

    // Por si frontend no envía 'title', usar 'category'
    const titleToUse = title || category || "Sin título";

    const transaction = await prisma.transaction.create({
      data: {
        title: titleToUse,
        amount: parseFloat(amount),
        type,
        category,
        date: new Date(date),
      },
    });

    res.status(201).json(transaction);
  } catch (error) {
    console.error("Error al crear transacción:", error);
    res.status(500).json({ error: "Error al crear transacción" });
  }
});

// Eliminar transacción por ID
router.delete("/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id);

    await prisma.transaction.delete({ where: { id } });

    res.json({ message: "Transacción eliminada" });
  } catch (error) {
    console.error("Error al eliminar transacción:", error);
    res.status(500).json({ error: "Error al eliminar transacción" });
  }
});

module.exports = router;
