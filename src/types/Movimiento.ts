

export type Movimiento = {
  id_movimiento?: number;
  descripcion?: string;
  cantidad?: number;
  hora_ingreso?: string;
  hora_salida?: string;
  estado?: boolean;
  aceptado?: boolean;
  en_proceso?: boolean;
  cancelado?: boolean;
  lugar_destino?: string;
  devolutivo?: boolean;
  no_devolutivo?: boolean;
  fecha_devolucion?: Date | string | null;
  created_at?: string;
  updated_at?: string;
  fk_usuario?: number;
  fk_tipo_movimiento?: number;
  fk_sitio?: number;
  fk_inventario?: number;
  tipo_bien?: string;
  codigos?: string[];
};

export type MovimientoExtendido = Movimiento & {
  fk_tipo_movimiento?: { nombre: string };
  fk_usuario?: { nombre: string };
  fk_inventario?: {
    fk_elemento?: { nombre: string };
  };
};