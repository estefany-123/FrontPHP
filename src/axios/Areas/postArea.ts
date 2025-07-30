import { axiosAPI } from "../axiosAPI";

export interface AreaPostData {
  id_area?: number;
  nombre: string;
  estado?: boolean;
  fk_usuario?: number;
  fk_sede?: number;
}

export async function postArea(data: AreaPostData): Promise<any> {
  const { id_area, ...resto } = data;
  const res = await axiosAPI.post("areas", resto);
  return res.data;
}
