import { axiosAPI } from "../axiosAPI";
import {resetPassword} from "@/types/Usuario"

export async function postResetPassword(
    token: string,
    data: resetPassword
  ): Promise<any> {
    const response = await axiosAPI.post(
      `/reset-password?token=${token}`,
      data
    );
    console.log(response);
    return response.data; 
  }