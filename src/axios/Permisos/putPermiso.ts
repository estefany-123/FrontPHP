import { axiosAPI } from "../axiosAPI";

export interface PermisoPutData {
    id_permiso?: number;
    permiso: string;
    createdAt?: string;
    updatedAt?: string;
}

export async function putPermiso(id_permiso:number, data:PermisoPutData):Promise<any> {
    const res = await axiosAPI.patch(`permisos/${id_permiso}`, data);
    return res.data
}