import { axiosAPI } from "../axiosAPI";

export interface InventarioPostData {
    id_inventario?: number;
    stock?: number;
    estado?: boolean;
    fkSitio?: number;
    fkElemento?: number;
}

export async function postInventario(data:InventarioPostData):Promise<any> {
    const {id_inventario, ...resto} = data
    const res = await axiosAPI.post(`inventarios`, resto);
    return res.data;
}