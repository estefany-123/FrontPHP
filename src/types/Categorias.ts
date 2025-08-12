export type Categoria = {
  id_categoria?: number;
  nombre: string;
  estado?: boolean;
  codigo_unpsc: string;
  created_at?: string;
  updated_at?: string;
};

export type UpCategoria = {
  id_categoria?: number;
  nombre: string;
  codigo_unpsc: string
};
