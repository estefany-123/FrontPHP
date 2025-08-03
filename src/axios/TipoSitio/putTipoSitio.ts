import { axiosAPI } from "../axiosAPI"
import {UpTipoSitio} from "@/types/TipoSitio"


export async function updateTipoSitio(
  id_tipo: number,
  data: UpTipoSitio
): Promise<any> {
  const response = await axiosAPI.put(`tipos_sitio/update/${id_tipo}`, data);
  return response.data;
}
