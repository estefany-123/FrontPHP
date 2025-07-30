import { z } from "zod";

// 🎯 Para el formulario: permite varios permisos
export const RolPermisoSchema = z.object({
  permisos: z
    .array(z.number())
    .min(1, "Debes seleccionar al menos un permiso"),
  fk_rol: z.number({
    required_error: "Debes seleccionar un rol",
    invalid_type_error: "Rol inválido",
  }),
  estado: z.boolean(),
});
export type RolPermisoCreate = z.infer<typeof RolPermisoSchema>;

// 🎯 Para el POST individual al backend
export const RolPermisoPostSchema = z.object({
  f_pPermiso: z.number().int().min(1),
  fk_rol: z.number().int().min(1),
  estado: z.boolean(),
});
export type RolPermisoPost = z.infer<typeof RolPermisoPostSchema>;
