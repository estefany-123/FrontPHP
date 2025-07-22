import { axiosAPI } from "../axiosAPI";

export async function deleteArea(idArea: number): Promise<any> {
  await axiosAPI.patch(`areas/state/${idArea}`);
  return idArea;
}
