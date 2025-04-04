const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcrypt");

const prisma = new PrismaClient();

async function main() {
  const existing = await prisma.user.findUnique({
    where: { email: "test@finanzas.com" },
  });

  if (existing) {
    console.log("🔁 Seed skipped: test user already exists");
    return;
  }

  const password = await bcrypt.hash("123456", 10);

  const user = await prisma.user.create({
    data: {
      email: "test@finanzas.com",
      password,
    },
  });

  const now = new Date();
  const sixMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 5, 1);

  const types = ["ingreso", "gasto"];
  const categories = {
    ingreso: ["Salario", "Intereses", "Ventas"],
    gasto: ["Compras", "Renta", "Suscripciones"],
  };

  const transactions = Array.from({ length: 60 }, (_, i) => {
    const type = types[Math.floor(Math.random() * types.length)];
    const category = categories[type][Math.floor(Math.random() * categories[type].length)];
    const date = new Date(sixMonthsAgo.getTime() + Math.random() * (now.getTime() - sixMonthsAgo.getTime()));
    return {
      title: `${category} #${i + 1}`,
      amount: parseFloat((Math.random() * 1000 + 50).toFixed(2)),
      type,
      category,
      date,
      userId: user.id,
    };
  });

  await prisma.transaction.createMany({ data: transactions });
  console.log("🌱 Seeding completo en producción.");
}

main()
  .then(() => prisma.$disconnect())
  .catch((e) => {
    console.error(e);
    prisma.$disconnect();
    process.exit(1);
  });
