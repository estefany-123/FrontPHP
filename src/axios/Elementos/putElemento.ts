import { axiosAPI } from "../axiosAPI";

export interface ElementoPutData {
    nombre: string;
    descripcion: string;
    imagen_elemento?: string | File | undefined;
}

export async function putElemento(id:number, data:ElementoPutData):Promise<any> {
    const formData = new FormData();
    formData.append('nombre', data.nombre);
    formData.append('descripcion', data.descripcion);
    if (data.imagen_elemento) {
        formData.append('imagen_elemento', data.imagen_elemento);
    }
    const res = await axiosAPI.patch(`elementos/${id}`, formData, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    });
    return res.data;
}