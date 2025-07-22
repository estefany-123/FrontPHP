import { axiosAPI } from "../axiosAPI";
import { TipoSitio } from "@/types/TipoSitio";

export async function postTipoSitio(
    data: TipoSitio
  ): Promise<any> {
    const response = await axiosAPI.post(
      "tipos_sitio",
      data
    );
    return response.data; 
  }
