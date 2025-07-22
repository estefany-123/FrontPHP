import {ReportTable} from "@/components/molecules/ReportTable";
import Buton from "../molecules/Button";

type Props = {
  headers: string[];
  accessors: string[];
  data: any[];
  onDownload: () => void;
};

export const ReportTableSection = ({ headers, accessors, data, onDownload }: Props) => {
  return (
    <section className="mt-6">
      <ReportTable headers={headers} accessors={accessors} data={data} />
      <div className="flex justify-end mt-4">
        <Buton text="Descargar Pdf" onPress={onDownload} />
      </div>
    </section>
  );
};