import { axiosAPI } from "../axiosAPI";

export async function cancelMovimiento(id_movimiento:number):Promise<any> {
    await axiosAPI.patch(`movimientos/cancel/${id_movimiento}`);
    return id_movimiento;
}