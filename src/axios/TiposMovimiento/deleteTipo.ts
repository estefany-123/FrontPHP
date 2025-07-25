import { axiosAPI } from "../axiosAPI";

export async function deleteTipo(id_tipo:number):Promise<any> {
    await axiosAPI.patch(`tipos-movimiento/state/${id_tipo}`);
    return id_tipo;
}