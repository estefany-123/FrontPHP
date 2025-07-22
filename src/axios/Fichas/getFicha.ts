import { Ficha } from "@/types/Ficha";
import { axiosAPI } from "../axiosAPI"

export const getFicha = async ():Promise<Ficha[]> =>{
    const res = await axiosAPI.get(`fichas`);
    return res.data
}