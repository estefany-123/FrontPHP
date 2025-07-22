import {  InventarioConSitio } from "@/types/Inventario";
import { axiosAPI } from "../axiosAPI";

export const getInventario = async():Promise<InventarioConSitio[]> =>{
    const res = await axiosAPI.get(`inventarios`);
    return res.data
}