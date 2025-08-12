import { axiosAPI } from "../axiosAPI";

export interface SedePostData {
  id_sede?: number;
  nombre: string;
  estado?: boolean;
  created_at?: string;
  updated_at?: string;
  fk_centro?: number;
}

export async function postSede(data: SedePostData): Promise<any> {
  const { id_sede, ...resto } = data;
  const res = await axiosAPI.post(`sedes`, resto);
  return res.data;
}
