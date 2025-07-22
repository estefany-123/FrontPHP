import { z } from "zod";

export const fichaUpdateSchema = z.object({
  idFicha: z.number(),

  codigoFicha: z.number({ message: "codigo ficha es requerida " }),
});

export type fichaUpdate = z.infer<typeof fichaUpdateSchema>;

export const fichaCreateSchema = z.object({
  codigoFicha: z
    .number({ message: "codigo ficha es requerido" })
    .min(8, { message: "Longitud minima de 8" }),

  estado: z.boolean({ required_error: "Estado es requerido" }),

  fkPrograma: z.number({ message: "programa es requerido" }),
});

export type FichaCreate = z.infer<typeof fichaCreateSchema>;
