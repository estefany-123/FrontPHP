import { z } from "zod";

export const CentroSchema = z.object({
  id_centro: z.number().optional(),
  nombre: z
    .string()
    .min(3, { message: "Es necesario un nombre" })
    .min(3, "Mínimo 3 caracteres"),
  estado: z.boolean({ required_error: "Estado es requerido" }),
  fk_municipio: z.number({ required_error: "Municipio requerido" }),
});

export type Centro = z.infer<typeof CentroSchema>;

export const CentroUpdateSchema = z.object({
  id_centro: z.number(),
  nombre: z
    .string()
    .min(3, { message: "Es necesario un nombre" })
    .min(3, "Mínimo 3 caracteres"),
});

export type CentroUpdate = z.infer<typeof CentroUpdateSchema>;
