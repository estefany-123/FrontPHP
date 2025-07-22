import { axiosAPI } from "../axiosAPI";

export interface MovimientoPostData {
  idMovimiento?: number;
  descripcion?: string;
  cantidad?: number;
  horaIngreso?: string;
  horaSalida?: string;
  aceptado?: boolean;
  enProceso?: boolean;
  cancelado?: boolean;
  devolutivo?: boolean;
  noDevolutivo?: boolean;
  createdAt?: string;
  lugarDestino?: string;
  updatedAt?: string;
  fkUsuario?: number;
  fkTipoMovimiento?: number;
  fkSitio?: number;
  fechaDevolucion?: Date | string | null;
  fkInventario?: number;
  codigos?: string[];
}

export async function postMovimiento(data: MovimientoPostData): Promise<any> {
  const { idMovimiento, ...resto } = data;
  const res = await axiosAPI.post(`movimientos`, resto);
  return res.data;
}
