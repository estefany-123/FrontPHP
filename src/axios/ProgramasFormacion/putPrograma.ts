import { axiosAPI } from "../axiosAPI";

export interface ProgramaPutData {
  id_programa?: number;
  nombre: string;
}

export async function putPrograma(
  id_programa: number,
  data: ProgramaPutData
): Promise<any> {
  const res = await axiosAPI.patch(`programaF/${id_programa}`, data);
  return res.data;
}
