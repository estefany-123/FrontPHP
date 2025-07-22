import { SitioStock } from "@/types/Reportes";
import { axiosAPI } from "../axiosAPI";

export const getSitiosConMayorStock = async (): Promise<SitioStock[]> => {
  const res = await axiosAPI.get('/reportes/sitios-mayor-stock');
  return res.data;
};