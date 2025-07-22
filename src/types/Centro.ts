export type Centro = {
    idCentro ?: number,
    nombre : string,
    estado : boolean,
    createdAt?: string
    updatedAt?: string
    fkMunicipio : number
}

export type PutCentro = {
    idCentro ?: number,
    nombre : string
}