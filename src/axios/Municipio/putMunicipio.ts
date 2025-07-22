import { axiosAPI } from "../axiosAPI"
import { UpdMunicipio } from "@/types/Municipio";


export async function UpMunicipio(
  idMunicipio: number,
  data: UpdMunicipio
): Promise<any> {
  const response = await axiosAPI.patch(`municipios/update/${idMunicipio}`, data);
  return response.data;
}
