import { axiosAPI } from "../axiosAPI";

export interface ElementoPostData {
  nombre: string;
  descripcion: string;
  perecedero?: boolean;
  noPerecedero?: boolean;
  estado?: boolean;
  fechaVencimiento?: string;
  imagen?: string | File;
  fkUnidadMedida?: number;
  fkCategoria?: number;
  fkCaracteristica?: number | null;
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
  if (data.noPerecedero !== undefined) {
    formData.append("noPerecedero", data.noPerecedero.toString());
  }
  if (data.fechaVencimiento) {
    formData.append("fechaVencimiento", data.fechaVencimiento.toString());
  }
  if (data.fkUnidadMedida) {
    formData.append("fkUnidadMedida", data.fkUnidadMedida.toString());
  }
  if (data.fkCategoria) {
    formData.append("fkCategoria", data.fkCategoria.toString());
  }
  if (data.fkCaracteristica) {
    formData.append("fkCaracteristica", data.fkCaracteristica.toString());
  }
  if (data.imagen) {
    formData.append("imagen", data.imagen);
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

  return { idElemento: id };
}
