import { Elemento } from "@/types/Elemento";
import { axiosAPI } from "../axiosAPI";

export const getElemento = async ():Promise<Elemento[]> => {
    const res = await axiosAPI.get('/elementos');
    console.log("reselementos",res)
    return res.data;
}