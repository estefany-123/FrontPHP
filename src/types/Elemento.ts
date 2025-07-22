export type postElementos = {
  nombre: string;
  descripcion: string;
  perecedero?: boolean;
  noPerecedero?: boolean;
  estado?: boolean;
  fechaVencimiento?: string;
  imagen?: string | File | undefined;
  fkUnidadMedida?: number;
  fkCategoria?: number;
  fkCaracteristica?: number | null;
};

export type putElementos = {
  idElemento?: number;
  nombre: string;
  descripcion: string;
  imagen?: string | File | undefined;
};

export type Elemento = {
  idElemento?: number;
  nombre: string;
  descripcion: string;
  perecedero?: boolean;
  noPerecedero?: boolean;
  estado?: boolean;
  fechaVencimiento?: string;
  baja?: boolean;
  imagen?: string;
  fkUnidadMedida?: number;
  fkCategoria?: number;
  fkCaracteristica?: number | null;
  createdAt?: string;
  updatedAt?: string;
  tipoElemento?: "perecedero" | "noPerecedero";
};
