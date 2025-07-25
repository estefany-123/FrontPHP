import { axiosAPI } from "../axiosAPI";
import { LoginCrede, LoginRes } from "@/types/Usuario";

export async function postLogin(data: LoginCrede): Promise<LoginRes> {
  const response = await axiosAPI.post("http://127.0.0.1:8000/ap/login", data);
  console.log(response);
  return response.data;
}
