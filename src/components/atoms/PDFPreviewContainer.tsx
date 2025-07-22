import React from "react";

type Props = {
  children: React.ReactNode;
};

export const PDFPreviewContainer = ({ children }: Props) => {
  return (
    <div className="border border-gray-300 p-4 mt-4 rounded shadow-sm">
      <h2 className="text-lg font-semibold mb-2">Vista previa del PDF generado</h2>
      {children}
    </div>
  );
};