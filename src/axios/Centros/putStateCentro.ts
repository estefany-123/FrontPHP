import { axiosAPI } from "../axiosAPI"

export const StateCentro = async (id_centro : number): Promise<any> => {
    const response = await axiosAPI.patch(`centros/estado/${id_centro}`)
    return response.data
}
