import { axiosAPI } from "../axiosAPI";

export interface RolPostData {
  id_rol?: number;
  nombre: string;
  estado?: boolean;
}

export async function postRol(data: RolPostData): Promise<any> {
  const { id_rol, ...resto } = data;
  const res = await axiosAPI.post("roles", resto);
  return res.data;
}
