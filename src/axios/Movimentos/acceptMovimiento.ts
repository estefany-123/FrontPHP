import { axiosAPI } from "../axiosAPI";

export async function acceptMovimiento(idMovimiento:number):Promise<any> {
    await axiosAPI.patch(`movimientos/accept/${idMovimiento}`);
    return idMovimiento;
}