import { axiosAPI } from "../axiosAPI"

export const StateCentro = async (idCentro : number): Promise<any> => {
    const response = await axiosAPI.patch(`centros/estado/${idCentro}`)
    return response.data
}
