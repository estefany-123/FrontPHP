import { axiosAPI } from "../axiosAPI";

export interface SedePostData {
    id_Sede?: number;
    nombre: string;
    estado?: boolean;
    created_at?:string;
    updated_at?:string;
    fkCentro?: number;
}

export async function postSede(data:SedePostData):Promise<any> {
    const {id_Sede, ...resto}= data;
    const res = await axiosAPI.post(`sedes`, resto);
    return res.data
}