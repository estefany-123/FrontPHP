import { axiosAPI } from "../axiosAPI"
import {UpTipoSitio} from "@/types/TipoSitio"


export async function updateTipoSitio(
  idTipo: number,
  data: UpTipoSitio
): Promise<any> {
  const response = await axiosAPI.patch(`tipos_sitio/update/${idTipo}`, data);
  return response.data;
}
