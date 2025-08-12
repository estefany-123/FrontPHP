import { axiosAPI } from "../axiosAPI";


export async function deleteRol(id_rol:number):Promise<any> {
    await axiosAPI.patch(`roles/state/${id_rol}`);
    return id_rol ;   
}