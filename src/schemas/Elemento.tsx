import { z } from "zod";

export const ElementoUpdateSchema = z.object({
  idElemento: z.number(),

  nombre: z
    .string()
    .min(1, { message: "Nombre es  requerido" })
    .min(2, { message: "Debe contener como mimimo 2 caracteres" }),

  descripcion: z
    .string()
    .min(1, { message: "Descripcion es requerida" })
    .min(2, { message: "Longitud minima 2" }),

imagen: z
  .any()
  .refine(
    (file) =>
      file === undefined ||
      file instanceof File ||
      (typeof file === "string" &&
        (file.startsWith("http") || file.startsWith("/"))),
    {
      message: "Debe ser un archivo o una URL o ruta válida",
    }
  )
  .optional().nullable(),
});

export type ElementoUpdate = z.infer<typeof ElementoUpdateSchema>;

export const ElementoCreateSchema = z.object({  
  idElemento: z.number().optional(),
  nombre: z
    .string()
    .min(1, { message: "Nombre es  requerido" })
    .min(2, { message: "Debe contener como mimimo 2 caracteres" }),

  descripcion: z
    .string()
    .min(1, { message: "Descripcion es requerida" })
    .min(2, { message: "Longitud minima 2" }),

  perecedero: z.boolean(),

  noPerecedero: z.boolean(),

  estado: z.boolean({ required_error: "Estado es requerido" }),

  baja: z.boolean({ required_error: "baja es requerida" }).default(false).optional(),

imagen: z
    .any()
    .refine(
      (file) =>
        file === undefined || file instanceof File || typeof file === "string",
      {
        message: "La imagen debe ser un archivo o una URL válida",
      }
    ),

  fechaVencimiento: z.string({ message: "Fecha es requerida" }).optional(),


  fkUnidadMedida: z.number({ required_error: "Unidad es requerida" }),

  fkCategoria: z.number({ required_error: "Categoria es requerida" }),

  fkCaracteristica: z.number({ required_error: "Caracteristica es requerida" }).optional(),

  tipoElemento: z.enum(["perecedero", "noPerecedero"], {
    required_error: "Debe seleccionar un tipo de elemento",
  }),

});
export type ElementoCreate = z.infer<typeof ElementoCreateSchema>;
