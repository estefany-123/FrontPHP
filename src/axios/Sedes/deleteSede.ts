import { axiosAPI } from "../axiosAPI";

export async function deleteSede(id_sede: number): Promise<any> {
  await axiosAPI.patch(`sedes/state/${id_sede}`);
  return id_sede;
}
