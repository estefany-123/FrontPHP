import { axiosAPI } from "../axiosAPI"

export const StateMunicipio = async (idMunicipio : number): Promise<any> => {
    const response = await axiosAPI.patch(`/municipios/estado/${idMunicipio}`)
    return response.data
}
