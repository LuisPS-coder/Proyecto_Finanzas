const express = require('express');
const router = express.Router();
const prisma = require("../prisma");

router.get('/', async (req, res) => {
  try {
    const transactions = await prisma.transaction.findMany({
      where: {
        userId: req.user.sub, 
      },
    });
    
    res.json(transactions);
  } catch (error) {
    console.error('Error al obtener transacciones:', error);
    res.status(500).json({ error: 'Error al obtener transacciones' });
  }
});

// Crear una nueva transacción
router.post('/', async (req, res) => {
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
    console.error('Error al crear transacción:', error);
    res.status(500).json({ error: 'Error al crear transacción' });
  }
});

module.exports = router;


