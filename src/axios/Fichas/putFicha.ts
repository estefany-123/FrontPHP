import { axiosAPI } from "../axiosAPI";

export interface FichaPutData {
  codigo_ficha: number;
}

export async function putFicha(
  id_ficha: number,
  data: FichaPutData
): Promise<any> {
  const res = await axiosAPI.patch(`fichas/${id_ficha}`, data);
  return res.data;
}
