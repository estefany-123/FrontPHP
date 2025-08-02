export type Municipio = {
  id_municipio?: number;
  nombre: string;
  departamento: string;
  estado: boolean;
  created_at?: string;
  updated_at?: string;
};

export type UpdMunicipio = {
  id_municipio?: number;
  nombre: string;
};
