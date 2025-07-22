import { PDFViewer } from "@react-pdf/renderer";
import ReportPDF from "@/pdf/ReportPDF"

type Props = {
  data: any[];
  title: string;
  headers: string[];
  accessors: string[];
};

export const ReportPreviewPanel = ({ data, title, headers, accessors }: Props) => {
  return (
    <section className="mt-6">
      <h2 className="text-lg font-semibold mb-2"> Vista previa PDF</h2>
      <div className="border rounded overflow-hidden shadow">
        <PDFViewer width="100%" height="500">
          <ReportPDF
            title={title}
            headers={headers}
            accessors={accessors}
            data={data}
          />
        </PDFViewer>
      </div>
    </section>
  );
};
