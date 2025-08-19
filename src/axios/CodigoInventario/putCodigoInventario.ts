import { axiosAPI } from "../axiosAPI";

export interface CodigoInventarioPutData {
    codigo?: string;
}

export async function putCodigoInventario(id_codigo_inventario:number, data:CodigoInventarioPutData):Promise<any> {
    const res = await axiosAPI.patch(`codigos/${id_codigo_inventario}`, data);
    return res.data;
}