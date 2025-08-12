import { axiosAPI } from "../axiosAPI";

export async function getNotificacionesPorUsuario(id_usuario: number) {
  const res = await axiosAPI.get(`/notificaciones/usuario/${id_usuario}`);
  return res.data;
}