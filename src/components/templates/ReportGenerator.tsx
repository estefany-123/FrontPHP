import { ReportSelectorPanel } from "@/components/organismos/ReportSelectorPanel";
import { ReportFilterForm } from "@/components/molecules/ReportFilterForm";
import { ReportTableSection } from "@/components/organismos/ReportTableSection";
import { ReportPreviewPanel } from "@/components/organismos/ReportPreviewPanel";

type ReportItem = {
  id: string;
  title: string;
  description: string;
  headers: string[];
  accessors: string[];
};

type Props = {
  reports: ReportItem[];
  selectedId: string;
  data: any[];
  onSelectReport: (id: string) => void;
  filtros: Array<
    | "fecha"
    | "tipoMovimiento"
    | "sitio"
    | "estado"
    | "nombre"
    | "usuario"
    | "area"
  >;
  onApplyFilters: (filters: Record<string, string>) => void;
  onDownloadPDF: () => void;
};

export const ReportGenerator = ({
  reports,
  selectedId,
  data,
  onSelectReport,
  filtros,
  onApplyFilters,
  onDownloadPDF,
}: Props) => {
  const report = reports.find((r) => r.id === selectedId);

  if (!report) return <p>Reporte no encontrado.</p>;

  return (
    <div className="p-6 space-y-6">
      <ReportSelectorPanel
        reports={reports}
        selectedId={selectedId}
        onChange={onSelectReport}
      />

      <ReportFilterForm filtros={filtros} onFilter={onApplyFilters} />

      <ReportTableSection
        headers={report.headers}
        accessors={report.accessors}
        data={data}
        onDownload={onDownloadPDF}
      />

      <ReportPreviewPanel
        title={report.title}
        headers={report.headers}
        accessors={report.accessors}
        data={data}
      />
    </div>
  );
};
