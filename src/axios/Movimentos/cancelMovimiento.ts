import { axiosAPI } from "../axiosAPI";

export async function cancelMovimiento(idMovimiento:number):Promise<any> {
    await axiosAPI.patch(`movimientos/cancel/${idMovimiento}`);
    return idMovimiento;
}