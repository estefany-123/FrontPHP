export type NotificacionEstado = "aceptado" | "cancelado" | "enProceso" | null;

export type Notificacion = {
  id_notificacion: number;
  titulo: string;
  mensaje: string | null;
  leido: boolean;
  requiere_accion: boolean;
  estado: NotificacionEstado;
  data: {
    id_movimiento?: number;
    id_elemento?: number;
    [key: string]: any;
  } | null;
  created_at: string;
  fk_usuario: {
    id_usuario: number;
    nombre: string;

};
}
