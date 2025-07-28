import { axiosAPI } from "../axiosAPI";

export interface MovimientoPostData {
  id_movimiento?: number;
  descripcion?: string;
  cantidad?: number;
  hora_ingreso?: string;
  hora_salida?: string;
  aceptado?: boolean;
  en_proceso?: boolean;
  cancelado?: boolean;
  devolutivo?: boolean;
  no_devolutivo?: boolean;
  created_at?: string;
  lugar_destino?: string;
  updated_at?: string;
  fk_usuario?: number;
  fk_tipo_movimiento?: number;
  fk_sitio?: number;
  fecha_devolucion?: Date | string | null;
  fk_inventario?: number;
  codigos?: string[];
}

export async function postMovimiento(data: MovimientoPostData): Promise<any> {
  const { id_movimiento, ...resto } = data;
  const res = await axiosAPI.post(`movimientos`, resto);
  return res.data;
}
