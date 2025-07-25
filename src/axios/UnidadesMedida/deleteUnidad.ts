import { axiosAPI } from "../axiosAPI";

export async function deleteUnidad(id_unidad:number):Promise<any> {
    await axiosAPI.patch(`unidades-medida/state/${id_unidad}`);
    return id_unidad;
}