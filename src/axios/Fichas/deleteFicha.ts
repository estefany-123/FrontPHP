import { axiosAPI } from "../axiosAPI";

export async function deleteFicha(id_ficha: number): Promise<any> {
  await axiosAPI.patch(`fichas/state/${id_ficha}`);
  return id_ficha;
}
