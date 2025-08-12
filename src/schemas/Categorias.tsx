import { z } from "zod";

export const CategoriaSchema = z.object({
  id_categoria: z.number().optional(),
  nombre: z
    .string()
    .min(1, { message: "Es necesario un nombre" })
    .min(2, "Mínimo 2 caracteres"),
  estado: z.boolean({ required_error: "Estado es requerido" }),
  codigo_unpsc: z
    .string()
    .min(1, { message: "Es necesario un codigo" })
    .min(2, "Mínimo 2 caracteres"),
});

export type Categoria = z.infer<typeof CategoriaSchema>;

export const CategoriaUpdateSchema = z.object({
  id_categoria: z.number().optional(),
  nombre: z
    .string()
    .min(1, { message: "Es necesario un nombre" })
    .min(2, "Mínimo 2 caracteres"),

  codigo_unpsc: z
    .string()
    .min(1, { message: "Es necesario un codigo" })
    .min(2, "Mínimo 2 caracteres"),
});

export type CategoriaUpdate = z.infer<typeof CategoriaUpdateSchema>;
