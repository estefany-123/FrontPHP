import { axiosAPI } from "../axiosAPI";

export type AgregateStockData = {
  id_inventario?: number;
  fk_elemento?: number;
  fk_sitio?: number;
  codigos?: string[];
};

export async function agregateStock(data: AgregateStockData): Promise<any> {
  const { id_inventario, ...resto } = data;
  const res = await axiosAPI.post(
    `/inventarios/agregateStock`,
    resto
  );
  return res.data;
}
