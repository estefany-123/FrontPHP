export type postElementos = {
  nombre: string;
  descripcion: string;
  perecedero?: boolean;
  no_perecedero?: boolean;
  estado?: boolean;
  fecha_vencimiento?: string;
  imagen_elemento?: string | File | undefined;
  fk_unidad_medida?: number;
  fk_categoria?: number;
  fk_caracteristica?: number | null;
};

export type putElementos = {
  id_elemento?: number;
  nombre: string;
  descripcion: string;
  imagen_elemento?: string | File | undefined;
};

export type Elemento = {
  id_elemento?: number;
  nombre: string;
  descripcion: string;
  perecedero?: boolean;
  no_perecedero?: boolean;
  estado?: boolean;
  fecha_vencimiento?: string;
  baja?: boolean;
  imagen?: string;
  fk_unidad_medida?: number;
  fk_categoria?: number;
  fk_caracteristica?: number | null;
  created_at?: string;
  updated_at?: string;
  tipoElemento?: "perecedero" | "no_perecedero";
};
