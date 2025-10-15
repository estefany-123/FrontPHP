import { postForgotPassword } from "@/axios/Usuarios/postForgotPasswrod";
import { postResetPassword } from "@/axios/Usuarios/postResetPassword";
import { forgotPass, resetPass } from "@/schemas/User";

import { useState } from "react";

export default function usePassword(){

    const [isError,setIsError] = useState<boolean>(false);
    const [error,setError] = useState<string | undefined>(undefined);
    const [isLoading, setIsLoading] = useState<boolean>(false);


    async function forgotPassword(data : forgotPass){
        setIsError(false);
        setIsLoading(true);
        console.log("caragdno setisloadin")
        
        try{
            const response = await postForgotPassword(data);
            console.log(response)
            
        }
        catch(error:any){
            setIsLoading(false)
            console.log("error password",error)
            const err = error.message
            setIsError(true);
            setError(err);
            throw error;
        }
        finally{
            setIsLoading(false);
        }
        
    }


    async function resetPassword(token: string, data :resetPass){
        setIsLoading(true)
        try{
            const response = await postResetPassword(token, data)
            console.log(response)
            
        }
        catch(error){
            console.error("No se pudo restablecer la contraseña",error)
            setIsError(true);
            setError("Error restableciendo la contraseña");
        }
        
    }

    return {forgotPassword,resetPassword,isError,error,isLoading}

}