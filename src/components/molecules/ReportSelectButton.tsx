type ReportItem = {
  id: string;
  title: string;
};

type Props = {
  reports: ReportItem[];
  selectedId: string;
  onChange: (id: string) => void;
};

export const ReportSelectorButton = ({ reports, selectedId, onChange }: Props) => {
  return (
    <div className="mb-4">
      <label className="block text-sm font-semibold mb-1">Seleccionar reporte:</label>
      <select
        className="border px-3 py-2 rounded w-full max-w-md"
        value={selectedId}
        onChange={(e) => onChange(e.target.value)}
      >
        {reports.map((r) => (
          <option key={r.id} value={r.id}>
            {r.title}
          </option>
        ))}
      </select>
    </div>
  );
};