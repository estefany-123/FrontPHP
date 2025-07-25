export type CodigoInventario = {
  id_codigo_inventario: number;
  codigo: string;
  uso:boolean
  baja:boolean
};

export type Inventario = {
  id_inventario?: number;
  stock?: number;
  estado?: boolean;
  created_at?: string;
  updated_at?: string;
  fk_sitio?: number;
  fk_elemento?: number;
  imagen_elemento?: string;
  acciones?: string;
  codigos?: CodigoInventario[];
};


export type InventarioConSitio = Inventario & {
  id_inventario?: number;
  stock?: number;
  estado?: boolean;
  created_at?: string;
  updated_at?: string;
  imagen_elemento?: string;
  acciones?: string;
  codigos?: string[];
  fk_sitio: {
    id_sitio: number;
    nombre: string;
  };
  fk_elemento: {
    id_elemento: number;
    nombre: string;
    imagen_elemento?: string;
    fk_caracteristica?: number
  };
};

export type InventarioConElemento = Inventario & {
  fk_sitio: {
    id_sitio: number;
    nombre: string;
  };
  fk_elemento: {
    id_elemento: number;
    nombre: string;
    imagen_elemento?: string;
    fk_caracteristica: boolean;
  };
};
