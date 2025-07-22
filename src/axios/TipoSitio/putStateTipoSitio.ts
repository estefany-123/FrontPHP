import { axiosAPI } from "../axiosAPI"

export const StateTipoSitio = async (idTipo : number): Promise<any> => {
    const response = await axiosAPI.patch(`tipos_sitio/estado/${idTipo}`)
    return response.data
}
