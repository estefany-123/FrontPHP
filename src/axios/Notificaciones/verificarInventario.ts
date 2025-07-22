import {axiosAPI} from "@/axios/axiosAPI";

export async function verificarInventario(idUsuario: number) {
  return await axiosAPI.get(`/notificaciones/verificar-inventario/${idUsuario}`);
}