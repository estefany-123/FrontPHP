import { Area } from "@/types/area";
import { axiosAPI } from "../axiosAPI";

export const getArea = async (): Promise<Area[]> => {
  const res = await axiosAPI.get("areas");
  return res.data;
};
