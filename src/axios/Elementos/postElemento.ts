import { axiosAPI } from "../axiosAPI";

export interface ElementoPostData {
  nombre: string;
  descripcion: string;
  perecedero?: boolean;
  no_perecedero?: boolean;
  estado?: boolean;
  fecha_vencimiento?: string;
  imagen_elemento?: string | File;
  fk_unidad_medida?: number;
  fk_categoria?: number;
  fk_caracteristica?: number | null;
}

export async function postElemento(data: ElementoPostData): Promise<any> {
  const formData = new FormData();
  formData.append("nombre", data.nombre);
  formData.append("descripcion", data.descripcion);
  if (data.estado !== undefined) {
    formData.append("estado", data.estado.toString());
  }
  if (data.perecedero !== undefined) {
    formData.append("perecedero", data.perecedero.toString());
  }
  if (data.no_perecedero !== undefined) {
    formData.append("no_perecedero", data.no_perecedero.toString());
  }
  if (data.fecha_vencimiento) {
    formData.append("fecha_vencimiento", data.fecha_vencimiento.toString());
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
  if (data.imagen_elemento) {
    formData.append("imagen_elemento", data.imagen_elemento);
  }


  console.log("Enviando:", [...formData.entries()]);

  const res = await axiosAPI.post("elementos", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  const id = res.data?.idElemento;

  if (typeof id !== "number") {
    throw new Error("La respuesta del backend no contiene un id válido");
  }

  return { id_elemento: id };
}
