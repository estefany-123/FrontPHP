import { Perfil } from "@/schemas/User";
import { axiosAPI } from "../axiosAPI";


export async function patchPerfil(data: Perfil): Promise<any> {
  const response = await axiosAPI.patch("usuarios/perfil", data);
  return response.data;
}
