export type Sede = {
    idSede?: number;
    nombre: string;
    estado?: boolean;
    createdAt?:string;
    updatedAt?:string;
    fkCentro?: number;
}