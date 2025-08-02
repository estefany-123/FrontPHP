import {User} from "@/types/Usuario"
import { axiosAPI } from "../axiosAPI"


export const getByIdUsuario = async (id : number): Promise<User> => {
    const response = await axiosAPI.get(`/usuarios/${id}`)
    return response.data
}