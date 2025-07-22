import { axiosAPI } from "../axiosAPI";

export interface AreaPutData {
  nombre: string;

}

export async function putArea(idArea: number, data: AreaPutData): Promise<any> {
  const res = await axiosAPI.patch(`areas/${idArea}`, data);
  return res.data;
}
