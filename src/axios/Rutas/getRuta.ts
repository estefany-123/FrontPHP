import { Ruta } from "@/types/Ruta"
import { axiosAPI } from "../axiosAPI"


export const getRuta = async (): Promise<Ruta[]> => {
    const response = await axiosAPI.get('/rutas/')
    return response.data
}