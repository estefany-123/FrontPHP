import { axiosAPI } from "../axiosAPI";

export interface InventarioPutData {
    stock?: number;
}

export async function putInventario(id_inventario:number, data:InventarioPutData):Promise<any> {
    const res = await axiosAPI.patch(`inventarios/${id_inventario}`, data);
    return res.data;
}