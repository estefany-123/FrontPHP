import { axiosAPI } from "../axiosAPI";

export const getCodigosDisponiblesParaDevolver = async (idInventario: number): Promise<string[]> => {
  const res = await axiosAPI.get(`movimientos/codigos-disponibles/${idInventario}`);
  return res.data;
};
