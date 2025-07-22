import { useEffect, useRef } from "react";
import Chart from "chart.js/auto";

type Props = {
  data: any[];
  labels: string[];
  accessor: string;
  title: string;
};

export const GraficoConCaptura = ({ data, labels, accessor, title }: Props) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const chartRef = useRef<Chart | null>(null);

  useEffect(() => {
    if (!canvasRef.current) return;
    const ctx = canvasRef.current.getContext("2d");
    if (!ctx) return;

    if (chartRef.current) {
      chartRef.current.destroy();
    }

    const valores = data.map((d) => Number(d[accessor]) || 0);

    chartRef.current = new Chart(ctx, {
      type: "bar",
      data: {
        labels,
        datasets: [
          {
            label: title,
            data: valores,
            backgroundColor: "#4f46e5",
          },
        ],
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            display: false,
          },
        },
      },
    });
  }, [data, labels, accessor, title]);

  return (
    <div className="w-full flex justify-center mb-4">
      <canvas ref={canvasRef} width={600} height={300} />
    </div>
  );
};
