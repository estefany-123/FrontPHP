import { axiosAPI } from "../axiosAPI";
import { Centro } from "@/types/Centro";

export async function postCentros(
    data: Centro
  ): Promise<any> {
    const response = await axiosAPI.post(
      "centros",
      data
    );
    return response.data; 
  }
