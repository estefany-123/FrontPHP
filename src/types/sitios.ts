export type Sitios = {
    idSitio?: number;
    nombre: string;
    personaEncargada?: string;
    ubicacion?: string;
    estado?: boolean;
    createdAt?:string;
    updatedAt?:string;
    fkTipoSitio?: number;
    fkArea?: number;
}

export type ListarSitios = {
    idSitio?: number;
    nombre: string;
    personaEncargada?: string;
    ubicacion?: string;
    estado?: boolean;
    createdAt?:string;
    updatedAt?:string;
    fkTipoSitio?: number;
    fkArea?: {
        idArea:number
        nombre:string
    };
}