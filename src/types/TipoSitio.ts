export type TipoSitio = {
    id_tipo ?:number,
    nombre : string,
    estado : boolean
    created_at?: string
    updated_at?: string
}

export type UpTipoSitio = {
    id_tipo ?:number,
    nombre : string
}