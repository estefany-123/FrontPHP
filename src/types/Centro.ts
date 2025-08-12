export type Centro = {
  id_centro?: number;
  nombre: string;
  estado: boolean;
  created_at?: string;
  updated_at?: string;
  fk_municipio: number;
};

export type PutCentro = {
  id_centro?: number;
  nombre: string;
};
