import { axiosAPI } from "../axiosAPI";

export async function deletePrograma(idPrograma:number):Promise<any> {
    await axiosAPI.patch(`programas-formacion/state/${idPrograma}`);
    return idPrograma;
}