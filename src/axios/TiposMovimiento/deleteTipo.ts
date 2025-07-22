import { axiosAPI } from "../axiosAPI";

export async function deleteTipo(idTipo:number):Promise<any> {
    await axiosAPI.patch(`tipos-movimiento/state/${idTipo}`);
    return idTipo;
}