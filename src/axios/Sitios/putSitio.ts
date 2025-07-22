import { axiosAPI } from "../axiosAPI";

export interface SitioPutData {
    idSitio?: number;
    nombre: string;
    personaEncargada?: string;
    ubicacion?: string;
}

export async function putSitio(idSitio:number, data:SitioPutData):Promise<any> {
    const res = await axiosAPI.patch(`sitios/${idSitio}`, data);
    return res.data
}