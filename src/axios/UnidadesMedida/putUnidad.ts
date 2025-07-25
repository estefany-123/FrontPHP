import { axiosAPI } from "../axiosAPI";

export interface UnidadPutData {
    nombre: string;
}

export async function putUnidad(id_unidad:number, data:UnidadPutData):Promise<any> {
    const res = await axiosAPI.patch(`unidades-medida/${id_unidad}`, data);
    return res.data
}