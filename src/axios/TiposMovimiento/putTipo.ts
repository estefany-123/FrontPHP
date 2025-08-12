import { axiosAPI } from "../axiosAPI";

export interface TipoPutData {
    nombre: string;
}

export async function putTipo(id:number, data:TipoPutData):Promise<any> {
    const res = await axiosAPI.patch(`tipos/${id}`, data);
    return res.data;
}