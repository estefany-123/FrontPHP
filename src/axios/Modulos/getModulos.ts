import { Modulo } from "@/types/Modulo"
import { axiosAPI } from "../axiosAPI"


export const getModulo = async (): Promise<Modulo[]> => {
    const response = await axiosAPI.get('modulos')
    return response.data
}