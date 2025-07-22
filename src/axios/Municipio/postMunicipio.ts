import { axiosAPI } from "../axiosAPI";
import { Municipio } from "@/types/Municipio";

export async function postMunicipio(
    data: Municipio
  ): Promise<any> {
    const response = await axiosAPI.post(
      "municipios",
      data
    );
    return response.data; 
  }
