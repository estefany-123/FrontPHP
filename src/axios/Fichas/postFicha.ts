import { axiosAPI } from "../axiosAPI";

export interface FichaPostData {
  idFicha?: number;
  codigoFicha: number;
  estado?: boolean;
  fkPrograma?: number;
}

export async function postFicha(data: FichaPostData): Promise<any> {
  const { idFicha, ...resto } = data;
  const res = await axiosAPI.post(`fichas`, resto);
  return res.data;
}
