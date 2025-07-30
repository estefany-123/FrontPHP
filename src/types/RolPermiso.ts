export type RolPermiso = {
  id_rol_permiso: number;
  estado: boolean;
  created_at: string;
  updated_at: string;
  fk_permiso: {
    idPermiso: number;
    permiso: string;
  };
  fk_rol: {
    id_ol: number;
    nombre: string;
  };
};
export type RolPermisoPost = {
  id_rol_permiso?: number;
  estado: boolean;
  created_at?: string;
  updated_at?: string;
  fk_permiso: number;
  fk_rol: number;
};
