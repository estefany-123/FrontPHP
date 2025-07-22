import { ElementoCaducar } from "@/types/Reportes";
import { axiosAPI } from "../axiosAPI";

export const getElementosPorCaducar = async (): Promise<ElementoCaducar[]> => {
  const res = await axiosAPI.get('/reportes/elementos-por-caducar');
  return res.data;
};