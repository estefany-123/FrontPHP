import { MovimientoDetalle } from "@/types/Reportes";
import { axiosAPI } from "../axiosAPI";

export const getHistorialDeMovimientos = async (
  fechaInicio: string,
  fechaFin: string
): Promise<MovimientoDetalle[]> => {
  const res = await axiosAPI.get('/reportes/historial-movimientos', {
    params: { fechaInicio, fechaFin },
  });
  return res.data;
};