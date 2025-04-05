const router = require("express").Router();
const prisma = require("../prisma");
const isAuthenticated = require("../middlewares/isAuthenticated");

router.get("/", isAuthenticated, async (req, res) => {
  try {
    const email = req.user.sub;

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return res.status(404).json({ message: "User not found" });

    const transactions = await prisma.transaction.findMany({
      where: { userId: user.id },
      orderBy: { date: "desc" },
    });

    res.json(transactions);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error al obtener transacciones" });
  }
});

router.post("/", isAuthenticated, async (req, res) => {
  try {
    console.log('🌐 Recibida nueva transacción:', req.body);
    const email = req.user.sub;
    const { type, category, amount, note, date } = req.body;

    if (!type || !category || !amount) {
      return res.status(400).json({ message: "Campos obligatorios faltantes" });
    }

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return res.status(404).json({ message: "User not found" });

    const newTransaction = await prisma.transaction.create({
      data: {
        userId: user.id,
        type,
        category,
        amount: parseFloat(amount),
        note,
        date: date ? new Date(date) : undefined,
      },
    });

    console.log('✅ Transacción creada:', newTransaction);
    res.status(201).json(newTransaction);
  } catch (err) {
    console.error('❌ Error al crear transacción:', err);
    res.status(500).json({ error: "Error al crear transacción" });
  }
});


router.delete("/:id", isAuthenticated, async (req, res) => {
  try {
    const email = req.user.sub;
    const { id } = req.params;

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return res.status(404).json({ message: "User not found" });

    const transaction = await prisma.transaction.findUnique({
      where: { id: parseInt(id) },
    });

    if (!transaction || transaction.userId !== user.id) {
      return res.status(403).json({ message: "Acceso denegado" });
    }

    await prisma.transaction.delete({ where: { id: parseInt(id) } });

    res.json({ message: "Transacción eliminada" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error al eliminar transacción" });
  }
});

module.exports = router;

