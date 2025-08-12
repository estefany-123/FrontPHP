import { axiosAPI } from "../axiosAPI";

export async function cambiarEstadoNotificacion(
  id_notificacion: number,
  estado: "aceptado" | "cancelado"
) {
  const res = await axiosAPI.patch(`/notificaciones/${id_notificacion}/estado`, {
    estado,
  });
  return res.data;
}
