const router = require("express").Router();
const prisma = require("../prisma");
const jwt = require("jsonwebtoken");

// Middleware para extraer el userId desde la cookie
function getUserIdFromToken(req) {
  const token = req.cookies.token;
  if (!token) return null;

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    return decoded.userId;
  } catch (err) {
    return null;
  }
}

// GET /transactions - obtener todas las transacciones del usuario
router.get("/", async (req, res) => {
  const userId = getUserIdFromToken(req);
  if (!userId) return res.status(401).json({ message: "No autorizado" });

  try {
    const transactions = await prisma.transaction.findMany({
      where: { userId },
      orderBy: { date: "desc" },
    });
    res.json(transactions);
  } catch (err) {
    res.status(500).json({ error: "Error al obtener transacciones" });
  }
});

// POST /transactions - crear una nueva transacción
router.post("/", async (req, res) => {
  const userId = getUserIdFromToken(req);
  if (!userId) return res.status(401).json({ message: "No autorizado" });

  const { type, category, amount, note, date } = req.body;

  try {
    const newTransaction = await prisma.transaction.create({
      data: {
        userId,
        type,
        category,
        amount: parseFloat(amount),
        note,
        date: date ? new Date(date) : undefined,
      },
    });
    res.status(201).json(newTransaction);
  } catch (err) {
    res.status(500).json({ error: "Error al crear transacción" });
  }
});

// DELETE /transactions/:id - eliminar una transacción
router.delete("/:id", async (req, res) => {
  const userId = getUserIdFromToken(req);
  if (!userId) return res.status(401).json({ message: "No autorizado" });

  const { id } = req.params;

  try {
    // Asegúrate de que la transacción pertenece al usuario
    const transaction = await prisma.transaction.findUnique({
      where: { id: parseInt(id) },
    });

    if (!transaction || transaction.userId !== userId) {
      return res.status(403).json({ message: "Acceso denegado" });
    }

    await prisma.transaction.delete({
      where: { id: parseInt(id) },
    });

    res.json({ message: "Transacción eliminada" });
  } catch (err) {
    res.status(500).json({ error: "Error al eliminar transacción" });
  }
});

module.exports = router;
