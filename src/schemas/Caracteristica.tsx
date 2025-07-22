import { z } from "zod";

export const CaracteristicaCreateSchema = z.object({
  idCaracteristica: z.number().optional(),
  nombre: z
    .string()
    .min(1, { message: "Es necesario un nombre" })
    .min(2, "Mínimo 2 caracteres"),

  simbolo: z
    .string({message:"Simbolo debe ser un string"}).min(2,{message:"Minimo 2 caracteres"})
});

export type CaracteristicaCreate = z.infer<typeof CaracteristicaCreateSchema>;

export const CaracteristicaUpdateSchema = z.object({
  idCaracteristica: z.number().optional(),
  nombre: z
    .string()
    .min(1, { message: "Es necesario un nombre" })
    .min(2, "Mínimo 2 caracteres"),
});

export type CaracteristicaUpdate = z.infer<typeof CaracteristicaUpdateSchema>;
