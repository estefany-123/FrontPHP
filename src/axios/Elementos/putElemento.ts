import { axiosAPI } from "../axiosAPI";

export interface ElementoPutData {
  nombre: string;
  descripcion: string;
  imagen_elemento?: string | File | undefined;
  fk_unidad_medida?: number;
  fk_categoria?: number;
  fk_caracteristica?: number | null;
}

export async function putElemento(
  id: number,
  data: ElementoPutData
): Promise<any> {
  const formData = new FormData();
  formData.append("nombre", data.nombre);
  formData.append("descripcion", data.descripcion);
  if (data.imagen_elemento) {
    formData.append("imagen_elemento", data.imagen_elemento);
  }
  if (data.fk_unidad_medida) {
    formData.append("fk_unidad_medida", data.fk_unidad_medida.toString());
  }
  if (data.fk_categoria) {
    formData.append("fk_categoria", data.fk_categoria.toString());
  }
  if (data.fk_caracteristica) {
    formData.append("fk_caracteristica", data.fk_caracteristica.toString());
  }
  const res = await axiosAPI.patch(`elementos/${id}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return res.data;
}