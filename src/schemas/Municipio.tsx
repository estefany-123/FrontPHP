import { z } from 'zod'

export const MunicipioSchema = z.object({
    idMunicipio : z.number().optional(),
    nombre : z
        .string().min(1,{message:"Nombre es requerido"}).min(1,{message:"Minimo 5 caracteres"}),
    departamento : z
        .string()
        .min(1,{message:"Departamento es requerido"})
        .min(1,{message:"Minimo 5 caracteres"}),
    estado: z
        .boolean({ required_error: "Estado es requerido" }),
})

export type Municipio = z.infer<typeof MunicipioSchema>

export const MunicipioUPSchema = z.object({
    idMunicipio : z
        .number().optional(),
    nombre : z
        .string().min(1,{message:"Nombre es requerido"}).min(1,{message:"Minimo 5 caracteres"})
})

export type MunicipioUP = z.infer<typeof MunicipioUPSchema>