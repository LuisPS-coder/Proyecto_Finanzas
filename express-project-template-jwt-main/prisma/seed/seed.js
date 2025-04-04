// prisma/seed/seed.js
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');

const prisma = new PrismaClient();

async function main() {
  const password = await bcrypt.hash('123456', 10);

  const user = await prisma.user.create({
    data: {
      email: 'test@finanzas.com',
      username: 'Tester',
      password,
    },
  });

  const categories = [
    { name: 'Salario', type: 'ingreso' },
    { name: 'Ventas', type: 'ingreso' },
    { name: 'Compras', type: 'gasto' },
    { name: 'Renta', type: 'gasto' },
    { name: 'Suscripciones', type: 'gasto' },
  ];

  const SIX_MONTHS = 1000 * 60 * 60 * 24 * 30 * 6;
  const createdTransactions = [];

  for (let i = 0; i < 60; i++) {
    const category = categories[Math.floor(Math.random() * categories.length)];
    const randomDate = new Date(Date.now() - Math.floor(Math.random() * SIX_MONTHS));

    createdTransactions.push({
      title: `${category.name} #${i + 1}`,
      amount: parseFloat((Math.random() * 1000).toFixed(2)),
      type: category.type,
      category: category.name,
      date: randomDate,
      userId: user.id,
    });
  }

  await prisma.transaction.createMany({
    data: createdTransactions,
  });

  console.log('🌱 Seeding completo!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
