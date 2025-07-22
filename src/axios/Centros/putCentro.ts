import { axiosAPI } from "../axiosAPI"
import {PutCentro} from "@/types/Centro"


export async function updateCentro(
  idCentro: number,
  data: PutCentro
): Promise<any> {
  const response = await axiosAPI.patch(`centros/update/${idCentro}`, data);
  return response.data;
}
