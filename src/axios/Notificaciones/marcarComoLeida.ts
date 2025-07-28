import { axiosAPI } from "../axiosAPI";

export async function marcarComoLeida(id_notificacion: number) {
  const res = await axiosAPI.patch(`/notificaciones/${id_notificacion}/leida`);
  return res.data;
}
