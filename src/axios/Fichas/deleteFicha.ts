import { axiosAPI } from "../axiosAPI";

export async function deleteFicha(idFicha:number):Promise<any> {
    await axiosAPI.patch(`fichas/state/${idFicha}`);
    return idFicha;
}