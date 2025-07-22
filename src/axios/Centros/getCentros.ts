import { Centro } from "@/types/Centro"
import { axiosAPI } from "../axiosAPI"


export const getCentro = async (): Promise<Centro[]> => {
    const response = await axiosAPI.get('centros')
    return response.data
}