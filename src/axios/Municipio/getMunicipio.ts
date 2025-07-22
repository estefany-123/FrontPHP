import { Municipio } from "@/types/Municipio"
import { axiosAPI } from "../axiosAPI"


export const getMunicipio = async (): Promise<Municipio[]> => {
    const response = await axiosAPI.get('municipios')
    return response.data
}