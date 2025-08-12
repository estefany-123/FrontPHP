import { axiosAPI } from "../axiosAPI";

export interface FichaPostData {
  id_ficha?: number;
  codigo_ficha: number;
  estado?: boolean;
  fk_programa?: number;
}

export async function postFicha(data: FichaPostData): Promise<any> {
  const { id_ficha, ...resto } = data;
  const res = await axiosAPI.post(`fichas`, resto);
  return res.data;
}
