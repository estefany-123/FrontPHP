import { Pformacion } from "@/types/programaFormacion";
import { axiosAPI } from "../axiosAPI";

export const getPrograma = async ():Promise<Pformacion[]> => {
    const res = await axiosAPI.get(`programas-formacion`);
    return res.data
}