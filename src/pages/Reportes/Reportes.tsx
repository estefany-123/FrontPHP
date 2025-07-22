import { useState } from "react";

import {ReportGenerator} from "@/components/templates/ReportGenerator";
import { reports, filtrosPorReporte } from "@/constants/reportes.config";
import { useReportData } from "@/hooks/Reportes/useReportData";

export const Reportes = () => {
  const [selectedReportId, setSelectedReportId] = useState(reports[0].id);

  const {
    data,
    aplicarFiltros,
    descargarPDF,
  } = useReportData(selectedReportId);

  const filtros = filtrosPorReporte[selectedReportId] || [];

  return (
    <main className="max-w-7xl mx-auto">
      <ReportGenerator
        reports={reports}
        selectedId={selectedReportId}
        data={data}
        onSelectReport={setSelectedReportId}
        filtros={filtros}
        onApplyFilters={aplicarFiltros}
        onDownloadPDF={descargarPDF}
      />
    </main>
  );
};