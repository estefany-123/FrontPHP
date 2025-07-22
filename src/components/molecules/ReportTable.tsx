type Props = {
  headers: string[];
  accessors: string[];
  data: any[];
};

export const ReportTable = ({ headers, accessors, data }: Props) => {
  return (
    <div className="overflow-auto border rounded shadow-sm">
      <table className="min-w-full table-auto">
        <thead className="bg-gray-200">
          <tr>
            {headers.map((header, i) => (
              <th
                key={i}
                className="px-4 py-2 text-left text-sm font-bold whitespace-nowrap"
              >
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.length === 0 && (
            <tr>
              <td colSpan={headers.length} className="text-center p-4">
                No hay datos para mostrar.
              </td>
            </tr>
          )}
          {data.map((row, i) => (
            <tr key={i} className="hover:bg-gray-100">
              {accessors.map((acc, j) => (
                <td
                  key={j}
                  className="px-4 py-2 border-t whitespace-pre-wrap break-words text-sm"
                >
                  {Array.isArray(row[acc])
                    ? row[acc].join(", ") // Si es array, lo separa por comas
                    : row[acc] ?? "-"}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
