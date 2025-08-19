import { Categoria } from "@/types/Categorias"
import { axiosAPI } from "../axiosAPI"


export const getCategorias = async (): Promise<Categoria[]> => {
    const response = await axiosAPI.get('/categorias')
    console.log("getcategorias",response)
    return response.data
}