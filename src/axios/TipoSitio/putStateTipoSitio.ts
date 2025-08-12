import { axiosAPI } from "../axiosAPI"

export const StateTipoSitio = async (id_tipo : number): Promise<any> => {
    const response = await axiosAPI.patch(`tipos_sitio/estado/${id_tipo}`)
    return response.data
}
