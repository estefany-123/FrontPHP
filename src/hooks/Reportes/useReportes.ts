import { getElementosPorCaducar } from "@/axios/Reportes/getElementosPorCaducar";
import { getHistorialDeMovimientos } from "@/axios/Reportes/getHistorialDeMovimientos";
import { getSitiosConMayorStock } from "@/axios/Reportes/getSitiosConMayorStock";
import { getUsuariosMasMovimientos } from "@/axios/Reportes/getUsuariosMasMovimientos";
import { useQuery } from "@tanstack/react-query";

export const useSitiosConMayorStock = () =>
  useQuery({
    queryKey: ["sitios-con-mayor-stock"],
    queryFn: getSitiosConMayorStock,
  });

export const useUsuariosMasMovimientos = () =>
  useQuery({
    queryKey: ["usuarios-con-mas-movimientos"],
    queryFn: getUsuariosMasMovimientos,
  });

export const useElementosPorCaducar = () =>
  useQuery({
    queryKey: ["elementos-por-caducar"],
    queryFn: getElementosPorCaducar,
  });

export const useHistorialMovimientos = (
  fechaInicio: string,
  fechaFin: string
) =>
  useQuery({
    queryKey: ["historial-movimientos", fechaInicio, fechaFin],
    queryFn: () => getHistorialDeMovimientos(fechaInicio, fechaFin),
    enabled: !!fechaInicio && !!fechaFin,
  });
