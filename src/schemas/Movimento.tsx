import { z } from "zod";

export const MovimientoUpdateSchema = z.object({
  idMovimiento: z.number(),

  descripcion: z
    .string()
    .min(1, { message: "Descripcion es  requerida" })
    .min(2, { message: "Debe contener como mimimo 2 caracteres" })
    .optional(),

  cantidad: z
    .number({
      required_error: "Cantidad es requerida y debe ser entero",
    })
    .optional(),
  horaIngreso: z
    .string()
    .regex(/^([01]\d|2[0-3]):([0-5]\d)$/, {
      message: "La hora debe tener el formato HH:mm (24h)",
    })
    .optional(),
  horaSalida: z
    .string()
    .regex(/^([01]\d|2[0-3]):([0-5]\d)$/, {
      message: "La hora debe tener el formato HH:mm (24h)",
    })
    .optional(),

  fechaDevolucion: z
    .string().date()
    .nullable()
    .optional()
    .refine(
      (val) => !val || (typeof val === "string" && !isNaN(Date.parse(val))),
      { message: "Fecha inválida" }
    ),
});

export type MovimientoUpdate = z.infer<typeof MovimientoUpdateSchema>;

export const MovimientoCreateSchema = z
  .object({
    descripcion: z
      .string()
      .min(1, { message: "Descripcion es requerida" })
      .min(2, { message: "Debe contener como mínimo 2 caracteres" }),

    cantidad: z.number().optional(),

    horaIngreso: z.string().optional(),
    horaSalida: z
      .string()
      .regex(/^([01]\d|2[0-3]):([0-5]\d)$/, {
        message: "La hora debe tener el formato HH:mm (24h)",
      })
      .optional(),

    estado: z.boolean().optional(),
    aceptado: z.boolean().default(false).optional(),
    enProceso: z.boolean().default(true).optional(),
    cancelado: z.boolean().default(false).optional(),

    devolutivo: z.boolean().optional(),
    noDevolutivo: z.boolean().optional(),

    fechaDevolucion: z
      .string()
      .nullable()
      .optional()
      .refine(
        (val) => !val || (typeof val === "string" && !isNaN(Date.parse(val))),
        { message: "Fecha inválida" }
      ),

    fkUsuario: z.number({ message: "Usuario es requerido" }),
    lugarDestino: z.string({ message: "Lugar de destino es requerido" }),
    fkTipoMovimiento: z.number({ message: "Tipo de Movimiento es requerido" }),
    fkSitio: z.number({ message: "Sitio es requerido" }),
    fkInventario: z.number({ message: "Inventario es requerido" }),

    tipo_bien: z.enum(["devolutivo", "no_devolutivo"], {
      required_error: "Debe seleccionar un tipo de bien",
    }),

    codigos: z.array(z.string()).optional(),

    // Este no se guarda, solo sirve para validación condicional
    tipoMovimientoNombre: z
      .enum(["ingreso", "salida", "baja", "préstamo"])
      .optional(),
  })
  .superRefine((data, ctx) => {
    if (data.tipoMovimientoNombre === "ingreso") {
      if (!data.horaIngreso) {
        ctx.addIssue({
          path: ["horaIngreso"],
          code: z.ZodIssueCode.custom,
          message: "Hora de ingreso es requerida para tipo ingreso",
        });
      } else if (!/^([01]\d|2[0-3]):([0-5]\d)$/.test(data.horaIngreso)) {
        ctx.addIssue({
          path: ["horaIngreso"],
          code: z.ZodIssueCode.custom,
          message: "Hora de ingreso debe tener formato HH:mm (24h)",
        });
      }
    }
  });

export type MovimientoCreate = z.infer<typeof MovimientoCreateSchema>;
