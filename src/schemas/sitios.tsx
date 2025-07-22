import { z } from "zod";

export const sitioUpdateSchema = z.object({
  idSitio: z.number(),
  nombre: z
    .string()
    .min(1, { message: "Nombre es requerido" })
    .min(2, { message: "Longitud minima de 3" }),

  personaEncargada: z
    .string()
    .min(1, { message: "persona encargada es requerido" })
    .min(3, { message: "Longitud minima de 3" }).optional(),

  ubicacion: z
    .string()
    .min(1, { message: "ubicacion es requerido" })
    .min(2, { message: "Longitud minima de 2" }).optional()

});

export type sitioUpdate = z.infer<typeof sitioUpdateSchema>;


export const sitioCreateSchema = z.object({
  nombre: z
    .string()
    .min(1, { message: "Nombre es requerido" })
    .min(2, { message: "Longitud minima de 3" }),

  personaEncargada: z
    .string()
    .min(1, { message: "persona encargada es requerido" })
    .min(3, { message: "Longitud minima de 3" }),

  ubicacion: z
    .string()
    .min(1, { message: "ubicacion es requerido" })
    .min(2, { message: "Longitud minima de 2" }),

  estado: z.boolean({ required_error: "Estado es requerido" }),

  fkTipoSitio: z.number({ message: "tipo sitio es requerido" }),

  fkArea: z.number({ message: "area  es requerido" }),
});

export type sitioCreate = z.infer<typeof sitioCreateSchema>;
