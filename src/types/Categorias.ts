export type Categoria = {
  idCategoria?: number;
  nombre: string;
  estado?: boolean;
  codigoUNPSC: string;
  createdAt?: string;
  updatedAt?: string;
};

export type UpCategoria = {
  idCategoria?: number;
  nombre: string;
  codigoUNPSC: string
};
