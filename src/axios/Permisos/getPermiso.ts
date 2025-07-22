import { Permisos } from "@/types/permisos";
import { axiosAPI } from "../axiosAPI"

export const getPermiso = async ():Promise<Permisos[]> => {
    const res = await axiosAPI.get(`permisos`);
    return res.data
}