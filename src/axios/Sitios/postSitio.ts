import { axiosAPI } from "../axiosAPI";

export interface SitioPostData {
    idSitio?: number;
    nombre: string;
    personaEncargada?: string;
    ubicacion?: string;
    estado?: boolean;
    fkTipoSitio?: number;
    fkArea?: number;
}

export async function postSitio(data:SitioPostData):Promise<any> {
    const res = await axiosAPI.post(`sitios`, data);
    return res.data
}