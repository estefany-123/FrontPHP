
export type User = {
    id?: number;
    documento?: number;
    nombre: string;
    apellido: string;
    edad: number;
    telefono: string;
    correo: string;
    estado?: boolean;
    cargo?: string;
    password?: string;
    fk_rol?: number;
}

export type Perfil={
    documento:number,
    edad:number,
    nombre : string,
    apellido:string,
    telefono : string,
    correo : string,
    perfil: string,
    rol:string

}
export type UpPerfil={
    nombre:string,
    apellido:string,
    edad:number,
    telefono:string,
    correo:string,
    password:string
}

export type postUser = {
    documento?: number;
    nombre: string;
    apellido: string;
    edad: number;
    telefono: string;
    correo: string;
    estado?: boolean;
    cargo?: string;
    password?: string;
    password_confirmation?:string;
    fk_rol?: number;
}

export type putUser = {
    id?: number;
    nombre: string;
    apellido: string | null;
    edad: number | null;
    telefono: string | null;
    correo: string | null;
}

export type LoginCrede = {
    documento : string,
    password : string
}

export type LoginRes = {
    access_token : string,
    documento : number,
    password : string,
    modules : any[]
    data:any
}

export type resetPassword = {
    password:string
    password_confirmation:string
}

export type forgotPassword = {
    correo : string
}