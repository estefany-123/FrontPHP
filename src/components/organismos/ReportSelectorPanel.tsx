import {Title} from "@/components/atoms/Title";
import {ReportSelectorButton} from "@/components/molecules/ReportSelectButton";

type ReportItem = {
  id: string;
  title: string;
  description: string;
};

type Props = {
  reports: ReportItem[];
  selectedId: string;
  onChange: (id: string) => void;
};

export const ReportSelectorPanel = ({ reports, selectedId, onChange }: Props) => {
  const current = reports.find((r) => r.id === selectedId);

  return (
    <section className="mb-6">
      <Title> Reportes</Title>
      <ReportSelectorButton
        reports={reports}
        selectedId={selectedId}
        onChange={onChange}
      />
      {current && (
        <div className="bg-gray-100 p-4 rounded mt-2">
          <h2 className="text-lg font-semibold">{current.title}</h2>
          <p className="text-sm text-gray-600">{current.description}</p>
        </div>
      )}
    </section>
  );
};