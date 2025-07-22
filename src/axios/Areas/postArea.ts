import { axiosAPI } from "../axiosAPI";

export interface AreaPostData {
  idArea?:number
  nombre: string;
  estado?: boolean;
  fkUsuario?:number;
  fkSede?: number;
}

export async function postArea(data: AreaPostData): Promise<any> {
  const {idArea, ...resto} = data;
  const res = await axiosAPI.post("areas", resto);
  return res.data;
}
