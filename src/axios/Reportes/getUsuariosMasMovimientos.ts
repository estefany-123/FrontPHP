import { UsuarioMovimientos } from "@/types/Reportes";
import { axiosAPI } from "../axiosAPI";

export const getUsuariosMasMovimientos = async (): Promise<UsuarioMovimientos[]> => {
  const res = await axiosAPI.get('/reportes/usuarios-mas-movimientos');
  return res.data;
};