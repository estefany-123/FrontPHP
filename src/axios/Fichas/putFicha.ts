import { axiosAPI } from "../axiosAPI";

export interface FichaPutData {
    codigoFicha: number;

}

export async function putFicha(id:number, data:FichaPutData):Promise<any> {
    const res = await axiosAPI.patch(`fichas/${id}`, data);
    return res.data
}