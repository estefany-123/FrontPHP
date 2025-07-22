export type CodigoInventario = {
  idCodigoInventario: number;
  codigo: string;
  uso:boolean
  baja:boolean
};

export type Inventario = {
  idInventario?: number;
  stock?: number;
  estado?: boolean;
  createdAt?: string;
  updatedAt?: string;
  fkSitio?: number;
  fkElemento?: number;
  imagenElemento?: string;
  acciones?: string;
  codigos?: CodigoInventario[];
};


export type InventarioConSitio = Inventario & {
  idInventario?: number;
  stock?: number;
  estado?: boolean;
  createdAt?: string;
  updatedAt?: string;
  imagenElemento?: string;
  acciones?: string;
  codigos?: string[];
  fkSitio: {
    idSitio: number;
    nombre: string;
  };
  fkElemento: {
    idElemento: number;
    nombre: string;
    imagenElemento?: string;
    fkCaracteristica?: number
  };
};

export type InventarioConElemento = Inventario & {
  fkSitio: {
    idSitio: number;
    nombre: string;
  };
  fkElemento: {
    idElemento: number;
    nombre: string;
    imagenElemento?: string;
    fkCaracteristica: boolean;
  };
};
