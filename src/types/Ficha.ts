export type Ficha = {
    idFicha?: number;
    codigoFicha: number;
    createdAt?:string;
    updatedAt?:string;
    estado?: boolean;
    fkPrograma?: number;
}