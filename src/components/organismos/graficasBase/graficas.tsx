import {
    Bar,
    Line,
    Pie,
    Doughnut,
    Radar,
    PolarArea,
    Bubble,
    Scatter,
  } from "react-chartjs-2";
  import { ChartData, ChartOptions } from "chart.js";
  
  const componentes = {
    bar: Bar,
    line: Line,
    pie: Pie,
    doughnut: Doughnut,
    radar: Radar,
    polarArea: PolarArea,
    bubble: Bubble,
    scatter: Scatter,
  } as const;
  
  type TipoGrafico = keyof typeof componentes;
  
  interface Props {
    tipo?: TipoGrafico;
    data: ChartData<any>;
    options?: ChartOptions<any>;
    titulo?: string;
    className?: string;
  }
  
  const GraficaBase = ({
    tipo = "bar",
    data,
    options,
    titulo,
    className = "",
  }: Props) => {
    const Componente = componentes[tipo];
  
    return (
      <div className={`bg-white shadow-md rounded-xl p-4 ${className}`}>
        {titulo && <h2 className="text-xl font-semibold mb-3">{titulo}</h2>}
        <Componente data={data} options={options} />
      </div>
    );
  };
  
  export default GraficaBase;
  