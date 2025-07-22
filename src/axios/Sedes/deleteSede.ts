import { axiosAPI } from "../axiosAPI";

export async function deleteSede(idSede:number):Promise<any> {
    await axiosAPI.patch(`sedes/state/${idSede}`);
    return idSede;
}