import {User} from "@/types/Usuario"
import { axiosAPI } from "../axiosAPI"


export const getByIdUsuario = async (idUsuario : number): Promise<User> => {
    const response = await axiosAPI.get(`/usuarios/${idUsuario}`)
    return response.data
}