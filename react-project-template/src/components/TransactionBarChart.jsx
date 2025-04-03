import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
  } from "recharts";
  
  export default function TransactionBarChart({ data }) {
    // Filtrar y agrupar por tipo
    const summary = data.reduce(
      (acc, tx) => {
        if (tx.type === "ingreso") acc.ingreso += tx.amount;
        else if (tx.type === "gasto") acc.gasto += tx.amount;
        return acc;
      },
      { ingreso: 0, gasto: 0 }
    );
  
    const chartData = [
      { name: "Ingreso", total: summary.ingreso },
      { name: "Gasto", total: summary.gasto },
    ];
  
    return (
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="total" fill="#8884d8" />
        </BarChart>
      </ResponsiveContainer>
    );
  }
  