import { axiosAPI } from "../axiosAPI";

export interface UnidadPostData {
    nombre: string;
    estado?: boolean;
}

export async function postUnidad(data:UnidadPostData):Promise<any> {
    const res = await axiosAPI.post(`unidades`, data);
    return res.data
}