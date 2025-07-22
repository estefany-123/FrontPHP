import { axiosAPI } from "../axiosAPI";

export interface ProgramaPutData {
  idPrograma?: number;
  nombre: string;

}

export async function putPrograma(idPrograma:number, data:ProgramaPutData):Promise<any> {
    const res = await axiosAPI.patch(`programas-formacion/${idPrograma}`, data);
    return res.data
}