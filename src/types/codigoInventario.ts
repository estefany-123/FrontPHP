export type CodigoInventario = {
    id_codigo_inventario?:number
    codigo?:string
    uso?:boolean
    baja?:boolean
    created_at?:string
    updated_at?:string
    fk_inventario?:{
        id_inventario?:number
    }
}
