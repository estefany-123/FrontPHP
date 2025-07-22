import { axiosAPI } from "../axiosAPI";

export async function deleteElemento(idElemento:number):Promise<any> {
    await axiosAPI.patch(`elementos/state/${idElemento}`);
    return idElemento;
}