export type Area = {
    idArea?: number;
    nombre: string;
    estado?: boolean;
    createdAt?:string;
    updatedAt?:string;
    fkUsuario?:number
    fkSede?: number;
}