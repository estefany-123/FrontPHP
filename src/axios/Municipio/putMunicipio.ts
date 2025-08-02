import { axiosAPI } from "../axiosAPI"
import { UpdMunicipio } from "@/types/Municipio";


export async function UpMunicipio(
  id_municipio: number,
  data: UpdMunicipio
): Promise<any> {
  const response = await axiosAPI.put(`municipios/update/${id_municipio}`, data);
  return response.data;
}
