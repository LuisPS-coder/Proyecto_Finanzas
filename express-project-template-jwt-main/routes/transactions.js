const express = require("express");
const router = express.Router();
const prisma = require("../prisma");

// Obtener todas las transacciones
router.get("/", async (req, res) => {
  try {
    const transactions = await prisma.transaction.findMany({
      orderBy: { date: "desc" }
    });
    res.json(transactions);
  } catch (error) {
    console.error("Error al obtener transacciones:", error);
    res.status(500).send("Error al obtener transacciones");
  }
});

// Crear una nueva transacción (sin userId)
router.post("/", async (req, res) => {
  const { title, amount, type, category, date } = req.body;
  try {
    const newTransaction = await prisma.transaction.create({
      data: {
        title,
        amount,
        type,
        category,
        date: new Date(date)
      },
    });
    res.json(newTransaction);
  } catch (error) {
    console.error("Error al crear la transacción:", error);
    res.status(500).send("Error al crear transacción");
  }
});

// Eliminar una transacción
router.delete("/:id", async (req, res) => {
  const transactionId = Number(req.params.id);
  try {
    await prisma.transaction.delete({
      where: { id: transactionId },
    });
    res.sendStatus(204);
  } catch (error) {
    console.error("Error al eliminar transacción:", error);
    res.status(500).send("Error al eliminar transacción");
  }
});

module.exports = router;
