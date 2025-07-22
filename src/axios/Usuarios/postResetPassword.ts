import { axiosAPI } from "../axiosAPI";
import {resetPassword} from "@/types/Usuario"


//  type resetPassword = {
//     token: string;
//     password: string;
//     confirmPassword: string;
// }
export async function postResetPassword(
    token: string,
    data: resetPassword
  ): Promise<any> {
    const response = await axiosAPI.post(
      `auth/reset-password?token=${token}`,
      data
    );
    return response.data; 
  }