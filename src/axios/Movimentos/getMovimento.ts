import { Movimiento } from "@/types/Movimiento";
import { axiosAPI } from "../axiosAPI";

export const getMovimiento = async ():Promise<Movimiento[]> =>{
    const res = await axiosAPI.get(`movimientos`);
    return res.data
}