import { axiosAPI } from "../axiosAPI";

export interface SedePostData {
    idSede?: number;
    nombre: string;
    estado?: boolean;
    createdAt?:string;
    updatedAt?:string;
    fkCentro?: number;
}

export async function postSede(data:SedePostData):Promise<any> {
    const {idSede, ...resto}= data;
    const res = await axiosAPI.post(`sedes`, resto);
    return res.data
}