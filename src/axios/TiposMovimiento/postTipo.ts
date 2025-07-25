import { axiosAPI } from "../axiosAPI";

export interface TipoPostData {
    nombre: string;
    estado?: boolean;
}

export async function postTipo(data:TipoPostData):Promise<any> {
    const res = await axiosAPI.post(`tipos-movimiento`, data);
    return res.data;
}