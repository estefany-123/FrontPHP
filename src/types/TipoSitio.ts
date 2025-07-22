export type TipoSitio = {
    idTipo ?:number,
    nombre : string,
    estado : boolean
    createdAt?: string
    updatedAt?: string
}

export type UpTipoSitio = {
    idTipo ?:number,
    nombre : string
}