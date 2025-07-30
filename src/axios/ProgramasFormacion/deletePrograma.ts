import { axiosAPI } from "../axiosAPI";

export async function deletePrograma(id_programa: number): Promise<any> {
  await axiosAPI.patch(`programaF/state/${id_programa}`);
  return id_programa;
}
