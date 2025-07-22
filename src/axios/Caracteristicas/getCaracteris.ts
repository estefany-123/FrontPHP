import { Caracteristica } from "@/types/Caracteristica"
import { axiosAPI } from "../axiosAPI"


export const getCaracteristicas = async (): Promise<Caracteristica[]> => {
    const response = await axiosAPI.get('caracteristicas')
    return response.data
}