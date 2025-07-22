import { ListarSitios } from "@/types/sitios";
import { axiosAPI } from "../axiosAPI";

export const getSitio = async ():Promise<ListarSitios[]> => {
    const res = await axiosAPI.get(`sitios`);
    return res.data
}