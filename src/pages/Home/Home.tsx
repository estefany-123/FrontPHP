import { useElemento } from "@/hooks/Elementos/useElemento";
import { useMovimiento } from "@/hooks/Movimientos/useMovimiento";
import { useInventario } from "@/hooks/Inventarios/useInventario";
import { Card } from "@heroui/react";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar, Pie } from "react-chartjs-2";

ChartJS.register(
  BarElement,
  CategoryScale,
  LinearScale,
  ArcElement,
  Tooltip,
  Legend
);

const Dashboard = () => {
  const { elementos = [] } = useElemento();
  const { movimientos = [] } = useMovimiento();
  const { inventarios = [] } = useInventario();

  const movimientosPendientes = movimientos.filter(
    (m: any) => m.enProceso && !m.aceptado && !m.cancelado
  );

  const estadisticas = {
    labels: ["Pendientes", "Aceptados", "Cancelados"],
    datasets: [
      {
        label: "Movimientos",
        data: [
          movimientosPendientes.length,
          movimientos.filter((m: any) => m.aceptado).length,
          movimientos.filter((m: any) => m.cancelado).length,
        ],
        backgroundColor: ["#facc15", "#4ade80", "#f87171"],
        borderRadius: 8,
      },
    ],
  };

  const ultimosMovimientos = [...movimientos]
    .sort(
      (a: any, b: any) =>
        new Date(b.createdAt!).getTime() - new Date(a.createdAt!).getTime()
    )
    .slice(0, 5);

  const movimientosPorMes = (() => {
    const conteo: Record<string, number> = {};
    movimientos.forEach((mov) => {
      const fecha = mov.createdAt ? new Date(mov.createdAt) : null;
      if (!fecha) return;
      const mes = fecha.toLocaleString("default", { month: "short" });
      conteo[mes] = (conteo[mes] || 0) + 1;
    });

    return {
      labels: Object.keys(conteo),
      datasets: [
        {
          label: "Movimientos por Mes",
          data: Object.values(conteo),
          backgroundColor: "#60a5fa",
          borderRadius: 6,
        },
      ],
    };
  })();

  const movimientosHoy = movimientos.filter((m: any) => {
    if (!m.createdAt) return false;
    const hoy = new Date().toDateString();
    return new Date(m.createdAt).toDateString() === hoy;
  });

  const stockData = (() => {
    const labels: string[] = [];
    const data: number[] = [];

    inventarios.forEach((inv: any) => {
      const elemento = elementos.find(
        (e: any) =>
          e.idElemento === inv.id_elemento || e.id_elemento === inv.id_elemento
      );

      const nombreElemento = elemento?.nombre
        ? elemento.nombre
        : `Elemento ID ${inv.id_elemento}`;

      labels.push(nombreElemento);
      data.push(Number(inv.stock || 0));
    });

    return {
      labels,
      datasets: [
        {
          label: "Stock",
          data,
          backgroundColor: [
            "#f87171",
            "#60a5fa",
            "#34d399",
            "#fbbf24",
            "#a78bfa",
            "#f472b6",
            "#facc15",
            "#38bdf8",
            "#818cf8",
            "#5eead4",
          ],
        },
      ],
    };
  })();

  return (
    <div className="p-4 space-y-6">
      {/* 📊 Tarjetas resumen */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <Card className="bg-blue-100 dark:bg-zinc-800 dark:text-white p-3">
          <p className="text-sm text-blue-700">Total de Elementos</p>
          <p className="text-2xl font-bold text-blue-900">{elementos.length}</p>
        </Card>
        <Card className="bg-yellow-100 dark:bg-zinc-800 dark:text-white p-3">
          <p className="text-sm text-yellow-700">Movimientos Pendientes</p>
          <p className="text-2xl font-bold text-yellow-900">
            {movimientosPendientes.length}
          </p>
        </Card>
        <Card className="bg-green-100 dark:bg-zinc-800 dark:text-white p-3">
          <p className="text-sm text-green-700">Total Movimientos</p>
          <p className="text-2xl font-bold text-green-900">
            {movimientos.length}
          </p>
        </Card>
        <Card className="bg-purple-100 dark:bg-zinc-800 dark:text-white p-3">
          <p className="text-sm text-purple-700">Movimientos de Hoy</p>
          <p className="text-2xl font-bold text-purple-900">
            {movimientosHoy.length}
          </p>
        </Card>
      </div>

      {/* 📊 Gráficas en dos columnas */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Gráfico de Barras por Estado */}
        <div className="bg-white p-4 rounded-xl shadow dark:bg-zinc-800 dark:text-white h-[300px]">
          <h2 className="text-base font-semibold mb-4">
            Movimientos por Estado
          </h2>
          <Bar
            data={estadisticas}
            options={{
              responsive: true,
              maintainAspectRatio: false,
              plugins: { legend: { display: false } },
            }}
          />
        </div>

        {/* Gráfico Circular de Stock */}
        <div className="bg-white p-4 rounded-xl shadow dark:bg-zinc-800 dark:text-white h-[300px]">
          <h2 className="text-base font-semibold mb-4">
            Distribución de Stock
          </h2>
          <div className="relative w-full h-[220px]">
            <Pie
              data={stockData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    position: "bottom", // también puedes usar "top", "left", etc.
                  },
                },
              }}
            />
          </div>
        </div>
      </div>

      {/* 📅 Gráfico de Movimientos por Mes */}
      <div className="bg-white p-4 rounded-xl shadow dark:bg-zinc-800 dark:text-white h-[300px]">
        <h2 className="text-base font-semibold mb-4">Movimientos por Mes</h2>
        <Bar
          data={movimientosPorMes}
          options={{
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { display: false } },
          }}
        />
      </div>

      {/* 📋 Tabla de últimos movimientos */}
      <div className="bg-white p-4 rounded-xl shadow dark:bg-zinc-800 dark:text-white">
        <h2 className="text-lg font-semibold mb-4">Últimos Movimientos</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm text-left">
            <thead>
              <tr className="text-gray-600 dark:text-white">
                <th className="py-2 px-4">ID</th>
                <th className="py-2 px-4">Descripción</th>
                <th className="py-2 px-4">Fecha</th>
                <th className="py-2 px-4">Estado</th>
              </tr>
            </thead>
            <tbody>
              {ultimosMovimientos.map((mov: any) => {
                const fecha = mov.createdAt
                  ? new Date(mov.createdAt).toLocaleDateString()
                  : "Sin fecha";
                const estado = mov.aceptado
                  ? "Aceptado"
                  : mov.cancelado
                    ? "Cancelado"
                    : mov.enProceso
                      ? "Pendiente"
                      : "Desconocido";
                return (
                  <tr key={mov.idMovimiento}>
                    <td className="py-2 px-4">{mov.idMovimiento}</td>
                    <td className="py-2 px-4">
                      {mov.descripcion ?? "Sin descripción"}
                    </td>
                    <td className="py-2 px-4">{fecha}</td>
                    <td className="py-2 px-4">{estado}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
