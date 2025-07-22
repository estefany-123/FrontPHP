import { axiosAPI } from "../axiosAPI";

export interface ProgramaPostData {
  idPrograma?: number;
  nombre: string;
  estado?: boolean;
  createdAt?: string;
  updatedAt?: string;
  fkArea?: number;
}

export async function postPrograma(data:ProgramaPostData):Promise<any> {
  const {idPrograma, ...resto} = data;
    const res = await axiosAPI.post(`programas-formacion`, resto);
    return res.data
}
