import { axiosAPI } from "../axiosAPI";

export interface SedePutData {
    nombre: string


}

export async function putSede(idSede:number, data:SedePutData):Promise<any> {
    const res = await axiosAPI.patch(`sedes/${idSede}`, data);
    return res.data
}