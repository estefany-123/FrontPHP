import { z } from "zod";

export const AreaUpdateSchema = z.object({
  id_area: z.number().optional(),
  nombre: z
    .string()
    .min(1, { message: "Nombre es requerido" })
    .min(3, { message: "Longitud minima de 3" }),
});

export type AreaUpdate = z.infer<typeof AreaUpdateSchema>;

export const AreaCreateSchema = z.object({
  nombre: z
    .string()
    .min(1, { message: "Nombre es requerido" })
    .min(3, { message: "Longitud minima de 3" }),

  estado: z.boolean({ required_error: "Estado es requerido" }),

  fk_sede: z.number({ message: "Sede es requerido" }),

  fk_usuario: z.number({ message: "Usuario es requerido" }),
});

export type AreaCreate = z.infer<typeof AreaCreateSchema>;
