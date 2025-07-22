

export type Movimiento = {
  idMovimiento?: number;
  descripcion?: string;
  cantidad?: number;
  horaIngreso?: string;
  horaSalida?: string;
  estado?: boolean;
  aceptado?: boolean;
  enProceso?: boolean;
  cancelado?: boolean;
  lugarDestino?: string;
  devolutivo?: boolean;
  noDevolutivo?: boolean;
  fechaDevolucion?: Date | string | null;
  createdAt?: string;
  updatedAt?: string;
  fkUsuario?: number;
  fkTipoMovimiento?: number;
  fkSitio?: number;
  fkInventario?: number;
  tipo_bien?: string;
  codigos?: string[];
};

export type MovimientoExtendido = Movimiento & {
  fkTipoMovimiento?: { nombre: string };
  fkUsuario?: { nombre: string };
  fkInventario?: {
    fkElemento?: { nombre: string };
  };
};