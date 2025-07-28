import { axiosAPI } from "../axiosAPI"
import { Caracteristica } from "@/types/Caracteristica"

export async function updateCategoria(
  id_caracteristica: number,
  data: Caracteristica
): Promise<any> {
  const response = await axiosAPI.patch(`caracteristicas/update/${id_caracteristica}`, data);
  return response.data;
}
