import { Unidad } from "@/types/Unidad";
import { axiosAPI } from "../axiosAPI";

export const getUnidad = async ():Promise<Unidad[]> => {
    const res = await axiosAPI.get(`unidades`);
    return res.data;
}