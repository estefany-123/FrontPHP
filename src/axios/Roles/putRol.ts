import { axiosAPI } from "../axiosAPI";

export interface RolPutData {
    nombre: string;
}

export async function putRol( id_rol:number, data:RolPutData):Promise<any>{
    const res = await axiosAPI.patch(`roles/${id_rol}`, data);
    return res.data;
}