import { Area } from "@/types/area";
import { axiosAPI } from "../axiosAPI";

export const getArea = async (): Promise<Area[]> => {
  const res = await axiosAPI.get("http://localhost:8000/api/areas");
  return res.data;
};
