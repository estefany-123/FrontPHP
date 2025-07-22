import { z } from "zod";

export const programaUpdateSchema = z.object({
  idPrograma: z.number(),
  
  nombre: z
    .string()
    .min(1, { message: "Nombre es requerido" })
    .min(3, { message: "Longitud minima de 3" }),


});

export type programaUpdate = z.infer<typeof programaUpdateSchema>;

export const programaCreateSchema = z.object({
  nombre: z
    .string()
    .min(1, { message: "Nombre es requerido" })
    .min(3, { message: "Longitud minima de 3" }),

  estado: z.boolean({ required_error: "Estado es requerido" }),

  fkArea: z.number({ message: "area  es requerido" }),
});

export type programaCreate = z.infer<typeof programaCreateSchema>;