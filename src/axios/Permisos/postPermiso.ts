import { axiosAPI } from "../axiosAPI";

export interface PermisoPostData {
    id_permiso?: number;
    permiso: string;
    created_at?: string;
    updated_at?: string;
}

export async function postPermiso(data:PermisoPostData):Promise<any> {
    const res = await axiosAPI.post(`permisos`, data);
    return res.data
}