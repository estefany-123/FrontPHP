import { z } from "zod";

export const InventarioUpdateSchema = z.object({
  idInventario: z.number().optional(),

  stock: z.number({ required_error: "Valor es requerido y debe ser entero" }).optional(),
});

export type InventarioUpdate = z.infer<typeof InventarioUpdateSchema>;

export const InventarioCreateSchema = z.object({
  stock: z.number({ required_error: "Valor es requerido y debe ser entero" }).default(0).optional(),

  estado: z.boolean({ required_error: "Estado es requerido" }),

  fkSitio: z.number({ message: "Sitio es requerido" }),

  fkElemento: z.number({ message: "Elemento es requerido" }),
});

export type InventarioCreate = z.infer<typeof InventarioCreateSchema>;
