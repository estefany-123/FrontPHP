import { axiosAPI } from "../axiosAPI"
import {PutCentro} from "@/types/Centro"


export async function updateCentro(
  id_centro: number,
  data: PutCentro
): Promise<any> {
  const response = await axiosAPI.put(`centros/update/${id_centro}`, data);
  return response.data;
}
