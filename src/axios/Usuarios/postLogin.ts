import { axiosAPI } from "../axiosAPI";
import { LoginCrede, LoginRes } from "@/types/Usuario";

export async function postLogin(data: LoginCrede): Promise<LoginRes> {
  const response = await axiosAPI.post("/login", data);
  console.log(response);
  return response.data;
}
