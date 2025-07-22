import {User} from "@/types/Usuario"
import { axiosAPI } from "../axiosAPI"


export const getUsuarios = async (): Promise<User[]> => {
    const response = await axiosAPI.get('/usuarios')
    return response.data
}