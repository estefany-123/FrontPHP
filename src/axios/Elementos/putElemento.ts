import { axiosAPI } from "../axiosAPI";

export interface ElementoPutData {
    nombre: string;
    descripcion: string;
    imagen?: string | File | undefined;
}

export async function putElemento(id:number, data:ElementoPutData):Promise<any> {
    const formData = new FormData();
    formData.append('nombre', data.nombre);
    formData.append('descripcion', data.descripcion);
    if (data.imagen) {
        formData.append('imagen', data.imagen);
    }
    const res = await axiosAPI.patch(`elementos/${id}`, formData, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    });
    return res.data;
}