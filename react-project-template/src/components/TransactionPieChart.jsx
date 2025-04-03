import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";

// Puedes personalizar colores
const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#AF19FF"];

export default function TransactionPieChart({ data }) {
  // Agrupar por categoría y sumar montos
  const grouped = data.reduce((acc, tx) => {
    const key = tx.category;
    acc[key] = (acc[key] || 0) + tx.amount;
    return acc;
  }, {});

  const chartData = Object.entries(grouped).map(([category, total]) => ({
    name: category,
    value: total,
  }));

  return (
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <Pie
          data={chartData}
          dataKey="value"
          nameKey="name"
          cx="50%"
          cy="50%"
          outerRadius={100}
          label
        >
          {chartData.map((_, index) => (
            <Cell key={index} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  );
}
