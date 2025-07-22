import { axiosAPI } from "../axiosAPI";

export interface InventarioPostData {
    idInventario?: number;
    stock?: number;
    estado?: boolean;
    fkSitio?: number;
    fkElemento?: number;
}

export async function postInventario(data:InventarioPostData):Promise<any> {
    const {idInventario, ...resto} = data
    const res = await axiosAPI.post(`inventarios`, resto);
    return res.data;
}