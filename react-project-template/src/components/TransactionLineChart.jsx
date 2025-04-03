import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    Tooltip,
    Legend,
    CartesianGrid,
    ResponsiveContainer,
  } from "recharts";
  
  // Agrupar por mes y sumar ingresos/gastos
  function agruparPorMes(data) {
    const resumen = {};
  
    data.forEach((tx) => {
      const fecha = new Date(tx.date);
      const mes = fecha.toLocaleString("default", {
        month: "short",
        year: "numeric",
      });
  
      if (!resumen[mes]) {
        resumen[mes] = { name: mes, ingreso: 0, gasto: 0 };
      }
  
      if (tx.type === "ingreso") resumen[mes].ingreso += tx.amount;
      if (tx.type === "gasto") resumen[mes].gasto += tx.amount;
    });
  
    // Ordenar los meses cronológicamente
    return Object.values(resumen).sort((a, b) => {
      return new Date("1 " + a.name) - new Date("1 " + b.name);
    });
  }
  
  export default function TransactionLineChart({ data }) {
    const dataPorMes = agruparPorMes(data);
  
    return (
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={dataPorMes}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="ingreso" stroke="#00C49F" />
          <Line type="monotone" dataKey="gasto" stroke="#FF8042" />
        </LineChart>
      </ResponsiveContainer>
    );
  }
  