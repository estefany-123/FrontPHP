import { Perfil } from "@/types/Usuario";
import { axiosAPI } from "../axiosAPI"


export const getPerfil = async (): Promise<Perfil> => {
    const response = await axiosAPI.get('usuarios/perfil')
    return response.data.usuario
}