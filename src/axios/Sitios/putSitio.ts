import { axiosAPI } from "../axiosAPI";

export interface SitioPutData {
  id_sitio?: number;
  nombre: string;
  persona_encargada?: string;
  ubicacion?: string;
}

export async function putSitio(
  id_sitio: number,
  data: SitioPutData
): Promise<any> {
  const res = await axiosAPI.patch(`sitios/${id_sitio}`, data);
  return res.data;
}
