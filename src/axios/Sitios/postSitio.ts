import { axiosAPI } from "../axiosAPI";

export interface SitioPostData {
    idSitio?: number;
    nombre: string;
    persona_encargada?: string;
    ubicacion?: string;
    estado?: boolean;
    fk_tipoSitio?: number;
    fk_area?: number;
}

export async function postSitio(data:SitioPostData):Promise<any> {
    const res = await axiosAPI.post(`sitios`, data);
    return res.data
}