import { axiosAPI } from "../axiosAPI";

export async function deleteSitio(id_sitio: number): Promise<any> {
  await axiosAPI.patch(`sitios/state/${id_sitio}`);
  return id_sitio;
}
