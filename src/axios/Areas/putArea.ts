import { axiosAPI } from "../axiosAPI";

export interface AreaPutData {
  nombre: string;

}

export async function putArea(id_area: number, data: AreaPutData): Promise<any> {
  const res = await axiosAPI.patch(`areas/${id_area}`, data);
  return res.data;
}
