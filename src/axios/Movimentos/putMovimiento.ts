import { axiosAPI } from "../axiosAPI";

export interface MovimientoPutData {
  id_movimiento?: number;
  descripcion?: string;
  cantidad?: number;
  hora_ingreso?: string;
  hora_salida?: string;
}

export async function putMovimiento(id_movimiento:number, data:MovimientoPutData):Promise<any> {
    const res = await axiosAPI.patch(`movimientos/${id_movimiento}`,data);
    return res.data
}