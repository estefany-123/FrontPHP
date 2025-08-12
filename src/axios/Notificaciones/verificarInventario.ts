import {axiosAPI} from "@/axios/axiosAPI";

export async function verificarInventario(id_usuario: number) {
  return await axiosAPI.get(`/notificaciones/verificar-inventario/${id_usuario}`);
}