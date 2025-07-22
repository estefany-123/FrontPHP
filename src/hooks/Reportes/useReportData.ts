import { useMemo, useState } from "react";
import { pdf } from "@react-pdf/renderer";
import { saveAs } from "file-saver";

import ReportPDF from "@/pdf/ReportPDF";
import { reports } from "@/constants/reportes.config";

import {
  useSitiosConMayorStock,
  useUsuariosMasMovimientos,
  useElementosPorCaducar,
  useHistorialMovimientos,
} from "@/hooks/Reportes/useReportes";

export const useReportData = (reportId: string) => {
  const [filters, setFilters] = useState<Record<string, string>>({});

  const report = reports.find((r) => r.id === reportId);
  if (!report) return { data: [], aplicarFiltros: () => {}, descargarPDF: () => {} };

  const { data: sitiosStock = [] } = useSitiosConMayorStock();
  const { data: usuariosMovs = [] } = useUsuariosMasMovimientos();
  const { data: elementosCaducar = [] } = useElementosPorCaducar();
  const { data: historialMovs = [] } = useHistorialMovimientos(
    filters.desde || "",
    filters.hasta || ""
  );

  const normaliza = (valor?: string | number | null) =>
    valor ? String(valor).toLowerCase() : "";

  const data = useMemo(() => {
    let baseData: Record<string, any>[] = [];

    switch (reportId) {
      case "sitios-con-mayor-stock":
        baseData = sitiosStock;
        if (filters.sitio) {
          baseData = baseData.filter((d) =>
            normaliza(d.sitio).includes(normaliza(filters.sitio))
          );
        }
        if (filters.area) {
          baseData = baseData.filter((d) =>
            normaliza(d.area).includes(normaliza(filters.area))
          );
        }
        break;

      case "usuarios-con-mas-movimientos":
        baseData = usuariosMovs;
        if (filters.usuario) {
          baseData = baseData.filter((d) =>
            normaliza(d.usuario).includes(normaliza(filters.usuario))
          );
        }
        if (filters.sitio) {
          baseData = baseData.filter((d) =>
            normaliza(d.sitio).includes(normaliza(filters.sitio))
          );
        }
        if (filters.nombre) {
          baseData = baseData.filter((d) => {
            const nombre = d.elemento || d.nombre;
            return normaliza(nombre).includes(normaliza(filters.nombre));
          });
        }
        break;

      case "elementos-por-caducar":
        baseData = elementosCaducar;
        if (filters.nombre) {
          baseData = baseData.filter((d) =>
            normaliza(d.nombre).includes(normaliza(filters.nombre))
          );
        }
        if (filters.sitio) {
          baseData = baseData.filter((d) =>
            normaliza(d.sitio).includes(normaliza(filters.sitio))
          );
        }
        if (filters.area) {
          baseData = baseData.filter((d) =>
            normaliza(d.area).includes(normaliza(filters.area))
          );
        }
        if (filters.desde && filters.hasta) {
          const desde = new Date(filters.desde);
          const hasta = new Date(filters.hasta);
          baseData = baseData.filter((d) => {
            const fecha = new Date(d.vencimiento);
            return fecha >= desde && fecha <= hasta;
          });
        }
        break;

      case "historial-movimientos":
        baseData = historialMovs;
        if (filters.tipoMovimiento) {
          baseData = baseData.filter((d) =>
            normaliza(d.tipo).includes(normaliza(filters.tipoMovimiento))
          );
        }
        if (filters.sitio) {
          baseData = baseData.filter((d) =>
            normaliza(d.sitio).includes(normaliza(filters.sitio))
          );
        }
        if (filters.usuario) {
          baseData = baseData.filter((d) =>
            normaliza(d.usuario).includes(normaliza(filters.usuario))
          );
        }
        if (filters.nombre) {
          baseData = baseData.filter((d) => {
            const nombre = d.elemento || d.nombre;
            return normaliza(nombre).includes(normaliza(filters.nombre));
          });
        }
        break;

      default:
        baseData = [];
    }

    return baseData;
  }, [
    reportId,
    filters,
    sitiosStock,
    usuariosMovs,
    elementosCaducar,
    historialMovs,
  ]);

  const aplicarFiltros = (valores: Record<string, string>) => {
    setFilters(valores);
  };

  const descargarPDF = async () => {
    const element = ReportPDF({
      title: report.title,
      headers: report.headers,
      accessors: report.accessors,
      data,
    });

    const blob = await pdf(element).toBlob();
    saveAs(blob, `${report.title}.pdf`);
  };

  return {
    data,
    aplicarFiltros,
    descargarPDF,
  };
};
