import { MovimientoCreate } from "@/schemas/Movimento";
import { MovimientoPostData } from "@/axios/Movimentos/postMovimiento";

export function mapMovimiento(data: MovimientoCreate): MovimientoPostData {
  return {
    descripcion: data.descripcion,
    cantidad: data.cantidad ?? 0,
    hora_ingreso: data.hora_ingreso ?? "",
    hora_salida: data.hora_salida ?? "",
    aceptado: data.aceptado ?? false,
    en_proceso: data.en_proceso ?? true,
    cancelado: data.cancelado ?? false,
    devolutivo: data.tipo_bien === "devolutivo",
    no_devolutivo: data.tipo_bien === "no_devolutivo",
    fk_usuario: data.fk_usuario,
    fk_tipo_movimiento: data.fk_tipo_movimiento,
    fk_sitio: data.fk_sitio,
    fk_inventario: data.fk_inventario,
    fecha_devolucion: data.fecha_devolucion
      ? new Date(data.fecha_devolucion)
      : undefined,
    codigos: data.codigos ?? [],
    created_at: undefined,
    updated_at: undefined,
    lugar_destino: data.lugar_destino
  };
}