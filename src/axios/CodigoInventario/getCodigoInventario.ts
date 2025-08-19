import { axiosAPI } from "../axiosAPI";
import { CodigoInventario } from "@/types/codigoInventario";

export const getCodigoInventario = async ():Promise<CodigoInventario[]> => {
    const res = await axiosAPI.get('codigos');
    return res.data;
}