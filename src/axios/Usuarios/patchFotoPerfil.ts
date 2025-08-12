import { axiosAPI } from "../axiosAPI";

export async function patchFotoPerfil(file: File): Promise<any> {
    const formData = new FormData();
    formData.append("perfil", file);
    const response = await axiosAPI.post(`usuarios/perfil/update`, formData,{
        headers:{
            "Content-Type": "multipart/form-data"
        }
    });
    console.log("foto request",response);
    console.log("foto ",formData);

    return response.data;
}
